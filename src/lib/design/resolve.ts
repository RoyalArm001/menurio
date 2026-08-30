import {
  getEntitlements,
  type PlanEntitlements,
  type SubscriptionPlan,
} from "@/lib/entitlements";
import { sanitizeCustomCss } from "@/lib/security/sanitize-css";
import {
  getTheme,
  isRestaurantThemeId,
  type ButtonStyle,
  type CardStyle,
  type FooterStyle,
  type FontToken,
  type ImageStyle,
  type MenuLayout,
  type NavigationStyle,
  type RestaurantTheme,
  type RestaurantThemeId,
} from "@/lib/themes/restaurant-themes";

export type DesignOverrides = {
  themeId?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  headingFont?: string | null;
  bodyFont?: string | null;
  buttonStyle?: string | null;
  cardStyle?: string | null;
  navigationStyle?: string | null;
  menuLayout?: string | null;
  imageStyle?: string | null;
  footerStyle?: string | null;
  customCss?: string | null;
  customCssEnabled?: boolean | null;
  whiteLabelEnabled?: boolean | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  faviconUrl?: string | null;
};

export type ResolvedRestaurantDesign = {
  themeId: RestaurantThemeId;
  theme: RestaurantTheme;
  colors: RestaurantTheme["colors"];
  fonts: { heading: FontToken; body: FontToken };
  buttonStyle: ButtonStyle;
  cardStyle: CardStyle;
  navigationStyle: NavigationStyle;
  menuLayout: MenuLayout;
  imageStyle: ImageStyle;
  footerStyle: FooterStyle;
  logoUrl: string | null;
  coverUrl: string | null;
  faviconUrl: string | null;
  customCss: string | null;
  whiteLabelEnabled: boolean;
  cssVariables: Record<string, string>;
};

const FONT_STACK: Record<FontToken, string> = {
  display: "var(--font-display), Georgia, serif",
  sans: "var(--font-sans), Arial, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
};

const BUTTON_RADIUS: Record<ButtonStyle, string> = {
  pill: "999px",
  rounded: "16px",
  square: "6px",
};

const CARD_RADIUS: Record<CardStyle, string> = {
  elevated: "24px",
  outlined: "20px",
  flat: "12px",
  compact: "10px",
};

function isHexColor(value: string | null | undefined): value is string {
  return !!value && /^#[0-9A-Fa-f]{6}$/.test(value);
}

function asFont(value: string | null | undefined): FontToken | null {
  if (value === "display" || value === "sans" || value === "serif") return value;
  return null;
}

function pick<T extends string>(
  value: string | null | undefined,
  allowed: readonly T[],
): T | null {
  return value && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : null;
}

export function themeAllowedForEntitlements(
  theme: RestaurantTheme,
  entitlements: PlanEntitlements,
): boolean {
  if (theme.tier === "basic") return true;
  if (theme.tier === "professional") return entitlements.PRO_THEMES;
  return entitlements.ADVANCED_DESIGN;
}

export function resolveRestaurantDesign(
  overrides: DesignOverrides,
  plan: SubscriptionPlan,
): ResolvedRestaurantDesign {
  const entitlements = getEntitlements(plan);
  const requestedTheme = getTheme(overrides.themeId);
  const theme = themeAllowedForEntitlements(requestedTheme, entitlements)
    ? requestedTheme
    : getTheme("modern");

  const colors = { ...theme.colors };
  if (entitlements.BRAND_COLORS) {
    if (isHexColor(overrides.primaryColor)) colors.primary = overrides.primaryColor;
    if (isHexColor(overrides.secondaryColor)) colors.secondary = overrides.secondaryColor;
    if (isHexColor(overrides.accentColor)) colors.accent = overrides.accentColor;
    if (isHexColor(overrides.backgroundColor)) colors.background = overrides.backgroundColor;
    if (isHexColor(overrides.textColor)) colors.text = overrides.textColor;
  }

  const fonts = { ...theme.fonts };
  if (entitlements.PRO_THEMES) {
    fonts.heading = asFont(overrides.headingFont) ?? fonts.heading;
    fonts.body = asFont(overrides.bodyFont) ?? fonts.body;
  }

  let buttonStyle = theme.buttonStyle;
  let cardStyle = theme.cardStyle;
  if (entitlements.PRO_THEMES) {
    buttonStyle =
      pick(overrides.buttonStyle, ["rounded", "pill", "square"] as const) ??
      buttonStyle;
    cardStyle =
      pick(overrides.cardStyle, ["elevated", "flat", "outlined", "compact"] as const) ??
      cardStyle;
  }

  let navigationStyle = theme.navigationStyle;
  let menuLayout = theme.menuLayout;
  let imageStyle = theme.imageStyle;
  let footerStyle = theme.footerStyle;
  if (entitlements.ADVANCED_DESIGN) {
    navigationStyle =
      pick(overrides.navigationStyle, ["sticky", "solid", "transparent", "minimal"] as const) ??
      navigationStyle;
    menuLayout =
      pick(overrides.menuLayout, ["cards", "list", "grid", "editorial"] as const) ??
      menuLayout;
    imageStyle =
      pick(overrides.imageStyle, ["cover", "rounded", "contain", "square"] as const) ??
      imageStyle;
    footerStyle =
      pick(overrides.footerStyle, ["simple", "branded", "minimal"] as const) ??
      footerStyle;
  }

  let customCss: string | null = null;
  if (entitlements.CUSTOM_CSS && overrides.customCssEnabled && overrides.customCss) {
    customCss = sanitizeCustomCss(overrides.customCss);
  }

  const whiteLabelEnabled = Boolean(
    entitlements.WHITE_LABEL && overrides.whiteLabelEnabled,
  );

  return {
    themeId: theme.id,
    theme,
    colors,
    fonts,
    buttonStyle,
    cardStyle,
    navigationStyle,
    menuLayout,
    imageStyle,
    footerStyle,
    logoUrl: entitlements.CUSTOM_LOGO ? overrides.logoUrl ?? null : null,
    coverUrl: entitlements.CUSTOM_COVER ? overrides.coverUrl ?? null : null,
    faviconUrl: entitlements.CUSTOM_FAVICON ? overrides.faviconUrl ?? null : null,
    customCss,
    whiteLabelEnabled,
    cssVariables: {
      "--r-primary": colors.primary,
      "--r-secondary": colors.secondary,
      "--r-accent": colors.accent,
      "--r-bg": colors.background,
      "--r-surface": colors.surface,
      "--r-text": colors.text,
      "--r-muted": colors.muted,
      "--r-line": `${colors.text}14`,
      "--r-heading-font": FONT_STACK[fonts.heading],
      "--r-body-font": FONT_STACK[fonts.body],
      "--r-button-radius": BUTTON_RADIUS[buttonStyle],
      "--r-card-radius": CARD_RADIUS[cardStyle],
    },
  };
}

export function assertThemeId(themeId: string): RestaurantThemeId {
  if (!isRestaurantThemeId(themeId)) {
    throw new Error("Unknown theme");
  }
  return themeId;
}
