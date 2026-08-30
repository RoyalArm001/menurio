import { NextResponse } from "next/server";
import { getRestaurantPublicProfile } from "@/services/restaurant.service";
import { isPwaAvailableForRestaurant } from "@/services/pwa.service";
import { buildRestaurantServiceWorker } from "@/lib/pwa/service-worker-template";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const profile = await getRestaurantPublicProfile(slug);

  if (!profile || !profile.restaurant.isPublished) {
    return jsonError("Not found", 404);
  }

  const plan = profile.subscription?.plan ?? "FREE";
  if (
    !isPwaAvailableForRestaurant({
      slug,
      restaurantName: profile.restaurant.name,
      plan,
      settings: profile.settings,
    })
  ) {
    return jsonError("PWA not available", 403);
  }

  const publicBasePath = request.headers.get("x-menurio-public-host") ? "" : `/r/${slug}`;
  const body = buildRestaurantServiceWorker(slug, publicBasePath);
  return applySecurityHeaders(
    new NextResponse(body, {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Service-Worker-Allowed": publicBasePath || "/",
        "Cache-Control": "public, max-age=3600",
      },
    }),
  );
}
