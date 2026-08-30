/** Centralized Menurio platform branding - never hardcode paths elsewhere */

export const PLATFORM_BRANDING = {
  name: "MENURIO",
  shortName: "MENURIO",
  /** Default logo when a restaurant has no logo/PWA icon */
  logoUrl: "/icons/menurio-logo-512.png",
  icon192: "/icons/menurio-icon-192.png",
  icon512: "/icons/menurio-icon-512.png",
  notificationIcon: "/icons/menurio-icon-192.png",
  themeColor: "#96691F",
} as const;

export type PlatformBranding = typeof PLATFORM_BRANDING;
