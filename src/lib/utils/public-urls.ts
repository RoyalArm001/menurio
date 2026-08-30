/** Client-safe URL helpers — no database imports. */

const FALLBACK_PLATFORM_BASE_URL = "https://menurio.store";

function normalizeBaseUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const withProtocol = /^[a-z][a-z\d+\-.]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    const path = url.pathname.replace(/\/+$/, "");
    return `${url.origin}${path === "/" ? "" : path}`;
  } catch {
    return null;
  }
}

export function getPlatformBaseUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_PLATFORM_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.AUTH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    FALLBACK_PLATFORM_BASE_URL,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeBaseUrl(candidate);
    if (normalized) return normalized;
  }

  return FALLBACK_PLATFORM_BASE_URL;
}

export function buildRestaurantPublicPath(slug: string): string {
  return `/r/${slug}`;
}

export function buildRestaurantPublicUrl(slug: string): string {
  return `${getPlatformBaseUrl()}${buildRestaurantPublicPath(slug)}`;
}

export function buildQrPermanentPath(permanentId: string): string {
  return `/q/${permanentId}`;
}

export function buildQrPermanentUrl(permanentId: string): string {
  return `${getPlatformBaseUrl()}${buildQrPermanentPath(permanentId)}`;
}
