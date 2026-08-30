import { getPlatformBaseUrl } from "@/lib/utils/public-urls";

const BLOCKED_PROTOCOLS = new Set(["javascript:", "data:", "vbscript:", "file:"]);

/** Validate notification click targets — same-origin internal paths only */
export function validateNotificationTargetUrl(
  raw: string,
  restaurantSlug: string,
): { ok: true; url: string } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: true, url: `/r/${restaurantSlug}` };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed, getPlatformBaseUrl());
  } catch {
    return { ok: false, error: "Invalid URL" };
  }

  if (BLOCKED_PROTOCOLS.has(parsed.protocol.toLowerCase())) {
    return { ok: false, error: "Disallowed URL protocol" };
  }

  const base = new URL(getPlatformBaseUrl());
  if (parsed.origin !== base.origin) {
    return { ok: false, error: "External URLs are not allowed" };
  }

  const path = parsed.pathname;
  if (!path.startsWith(`/r/${restaurantSlug}`)) {
    return {
      ok: false,
      error: "Target URL must stay within this restaurant's public pages",
    };
  }

  return { ok: true, url: `${path}${parsed.search}${parsed.hash}` };
}
