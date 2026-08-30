import {
  assertCapability,
  EntitlementError,
  getEntitlements,
  type SubscriptionPlan,
} from "@/lib/entitlements";
import { getTheme, isRestaurantThemeId } from "@/lib/themes/restaurant-themes";
import { themeAllowedForEntitlements } from "@/lib/design/resolve";

export type DesignPatch = {
  themeId?: string;
  logoAssetId?: string | null;
  coverAssetId?: string | null;
  faviconAssetId?: string | null;
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
  customCssEnabled?: boolean;
  whiteLabelEnabled?: boolean;
};

export function assertDesignPatchAllowed(
  plan: SubscriptionPlan,
  patch: DesignPatch,
): void {
  const entitlements = getEntitlements(plan);

  if (patch.themeId) {
    if (!isRestaurantThemeId(patch.themeId)) {
      throw new EntitlementError("PRO_THEMES", plan);
    }
    if (!themeAllowedForEntitlements(getTheme(patch.themeId), entitlements)) {
      throw new EntitlementError(
        getTheme(patch.themeId).tier === "advanced"
          ? "ADVANCED_DESIGN"
          : "PRO_THEMES",
        plan,
      );
    }
  }

  if (patch.logoAssetId != null) assertCapability(plan, "CUSTOM_LOGO");
  if (patch.coverAssetId != null) assertCapability(plan, "CUSTOM_COVER");
  if (patch.faviconAssetId != null) assertCapability(plan, "CUSTOM_FAVICON");

  if (
    patch.primaryColor != null ||
    patch.secondaryColor != null ||
    patch.accentColor != null ||
    patch.backgroundColor != null ||
    patch.textColor != null
  ) {
    assertCapability(plan, "BRAND_COLORS");
  }

  if (
    patch.headingFont != null ||
    patch.bodyFont != null ||
    patch.buttonStyle != null ||
    patch.cardStyle != null
  ) {
    assertCapability(plan, "PRO_THEMES");
  }

  if (
    patch.navigationStyle != null ||
    patch.menuLayout != null ||
    patch.imageStyle != null ||
    patch.footerStyle != null
  ) {
    assertCapability(plan, "ADVANCED_DESIGN");
  }

  if (
    patch.customCssEnabled === true ||
    (patch.customCss != null && patch.customCss.length > 0)
  ) {
    assertCapability(plan, "CUSTOM_CSS");
  }

  if (patch.whiteLabelEnabled) {
    assertCapability(plan, "WHITE_LABEL");
  }
}
