/** Client-safe URL helpers — no database imports. */

export function getPlatformBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_PLATFORM_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.AUTH_URL ??
    "https://menurio.store"
  ).replace(/\/$/, "");
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
