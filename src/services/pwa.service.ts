import {
  canUsePwa,
  canUsePush,
  type SubscriptionPlan,
} from "@/lib/entitlements";
import {
  buildManifestIcons,
  resolvePwaBranding,
} from "@/lib/pwa/resolve-branding";
import { PLATFORM_BRANDING } from "@/lib/platform/branding";
import {
  buildRestaurantPublicPath,
  getPlatformBaseUrl,
} from "@/lib/utils/public-urls";
import type { RestaurantSettings } from "@/db/schema/settings";

export type PwaManifestInput = {
  slug: string;
  restaurantName: string;
  logoUrl?: string | null;
  settings?: RestaurantSettings | null;
  plan: SubscriptionPlan;
  publicBasePath?: string;
};

export function isPwaAvailableForRestaurant(input: PwaManifestInput): boolean {
  if (!canUsePwa(input.plan)) return false;
  if (input.settings?.pwaEnabled === false) return false;
  return true;
}

export function isPushAvailableForRestaurant(input: {
  plan: SubscriptionPlan;
  settings?: RestaurantSettings | null;
}): boolean {
  if (!canUsePush(input.plan)) return false;
  if (input.settings?.pushNotificationsEnabled === false) return false;
  return true;
}

export function buildRestaurantWebManifest(input: PwaManifestInput) {
  const branding = resolvePwaBranding({
    restaurantName: input.restaurantName,
    pwaDisplayName: input.settings?.pwaDisplayName,
    pwaIconUrl: input.settings?.pwaIconUrl,
    logoUrl: input.logoUrl,
  });

  const startPath = input.publicBasePath ?? buildRestaurantPublicPath(input.slug);
  const baseUrl = getPlatformBaseUrl();

  return {
    name: branding.name,
    short_name: branding.shortName,
    description: `${branding.name} menu`,
    start_url: startPath,
    scope: startPath,
    id: startPath,
    display: "standalone" as const,
    background_color: PLATFORM_BRANDING.themeColor,
    theme_color: PLATFORM_BRANDING.themeColor,
    lang: "en",
    icons: buildManifestIcons(branding.iconUrl).map((icon) => ({
      ...icon,
      src: icon.src.startsWith("http") ? icon.src : `${baseUrl}${icon.src}`,
    })),
  };
}

export function resolveNotificationIcon(input: {
  restaurantName: string;
  pwaIconUrl?: string | null;
  logoUrl?: string | null;
}): string {
  return resolvePwaBranding({
    restaurantName: input.restaurantName,
    pwaIconUrl: input.pwaIconUrl,
    logoUrl: input.logoUrl,
  }).notificationIconUrl;
}
