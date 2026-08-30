import { PLATFORM_BRANDING } from "@/lib/platform/branding";

export type PwaBrandingInput = {
  restaurantName: string;
  pwaDisplayName?: string | null;
  pwaIconUrl?: string | null;
  logoUrl?: string | null;
};

export type ResolvedPwaBranding = {
  name: string;
  shortName: string;
  iconUrl: string;
  notificationIconUrl: string;
};

/** Application name: pwaDisplayName → restaurant name → MENURIO */
export function resolvePwaDisplayName(input: PwaBrandingInput): string {
  const trimmed = input.pwaDisplayName?.trim();
  if (trimmed) return trimmed;
  const name = input.restaurantName.trim();
  if (name) return name;
  return PLATFORM_BRANDING.name;
}

/** Icon: PWA icon → logo → Menurio default (never broken) */
export function resolvePwaIconUrl(input: PwaBrandingInput): string {
  const pwaIcon = input.pwaIconUrl?.trim();
  if (pwaIcon) return pwaIcon;
  const logo = input.logoUrl?.trim();
  if (logo) return logo;
  return PLATFORM_BRANDING.icon192;
}

export function resolvePwaBranding(input: PwaBrandingInput): ResolvedPwaBranding {
  const name = resolvePwaDisplayName(input);
  const iconUrl = resolvePwaIconUrl(input);
  return {
    name,
    shortName: name.length > 12 ? `${name.slice(0, 12).trim()}…` : name,
    iconUrl,
    notificationIconUrl: iconUrl,
  };
}

function resolveManifestIconSrc(iconUrl: string, size: "192x192" | "512x512") {
  if (iconUrl !== PLATFORM_BRANDING.icon192) return iconUrl;
  return size === "512x512" ? PLATFORM_BRANDING.icon512 : PLATFORM_BRANDING.icon192;
}

export function buildManifestIcons(iconUrl: string) {
  const sizes = ["192x192", "512x512"] as const;
  return sizes.flatMap((size) => [
    {
      src: resolveManifestIconSrc(iconUrl, size),
      sizes: size,
      type: iconUrl.endsWith(".svg") ? "image/svg+xml" : "image/png",
      purpose: "any",
    },
    {
      src: resolveManifestIconSrc(iconUrl, size),
      sizes: size,
      type: iconUrl.endsWith(".svg") ? "image/svg+xml" : "image/png",
      purpose: "maskable",
    },
  ]);
}
