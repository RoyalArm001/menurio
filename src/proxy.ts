import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isPlatformRootHostname,
  resolveTenantFromHostname,
} from "@/services/domain.service";
import { applySecurityHeaders } from "@/lib/security/middleware-helpers";

const PASSTHROUGH_PATHS = [
  "/api/",
  "/_next/",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/q/",
];

function isUnsafeMethod(method: string): boolean {
  return !["GET", "HEAD", "OPTIONS"].includes(method);
}

function hasSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

function withRequestHeaders(
  request: NextRequest,
  hostname: string,
): Headers {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  requestHeaders.set("x-hostname", hostname);
  // Never trust a client-supplied value for custom-domain rendering.
  requestHeaders.delete("x-menurio-public-host");
  return requestHeaders;
}

function secureResponse(response: NextResponse): NextResponse {
  return applySecurityHeaders(response);
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/") && isUnsafeMethod(request.method)) {
    if (!hasSameOrigin(request)) {
      return secureResponse(
        NextResponse.json({ error: "Cross-origin requests are not allowed" }, { status: 403 }),
      );
    }
  }

  const hostname = request.headers.get("host") ?? "";
  const requestHeaders = withRequestHeaders(request, hostname);

  if (!isPlatformRootHostname(hostname)) {
    try {
      const tenant = await resolveTenantFromHostname(hostname);
      const pathname = request.nextUrl.pathname;
      const isPassthrough = PASSTHROUGH_PATHS.some(
        (path) => pathname === path || pathname.startsWith(path),
      );

      if (tenant?.source === "custom_domain" && !isPassthrough) {
        const legacyPrefix = `/r/${tenant.slug}`;
        if (pathname === legacyPrefix || pathname.startsWith(`${legacyPrefix}/`)) {
          const canonicalPath = pathname.slice(legacyPrefix.length) || "/";
          const redirectUrl = new URL(canonicalPath, request.url);
          redirectUrl.search = request.nextUrl.search;
          return secureResponse(NextResponse.redirect(redirectUrl, 308));
        }

        requestHeaders.set("x-menurio-public-host", tenant.hostname);
        const rewriteUrl = request.nextUrl.clone();
        rewriteUrl.pathname = `${legacyPrefix}${pathname === "/" ? "" : pathname}`;
        return secureResponse(
          NextResponse.rewrite(rewriteUrl, {
            request: { headers: requestHeaders },
          }),
        );
      }
    } catch {
      // A tenant lookup must never make the platform unavailable.
    }
  }

  return secureResponse(
    NextResponse.next({ request: { headers: requestHeaders } }),
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
