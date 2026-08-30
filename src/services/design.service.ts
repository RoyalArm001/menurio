import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  restaurantDesigns,
  restaurants,
  uploadedAssets,
  restaurantSettings,
  domains,
  subscriptions,
} from "@/db/schema";
import { writeAuditLog } from "@/lib/audit/log";
import { getEntitlements, type SubscriptionPlan } from "@/lib/entitlements";
import {
  assertDesignPatchAllowed,
  type DesignPatch,
} from "@/lib/design/assert-patch";
import {
  resolveRestaurantDesign,
  type DesignOverrides,
  type ResolvedRestaurantDesign,
} from "@/lib/design/resolve";
import { sanitizeCustomCss } from "@/lib/security/sanitize-css";
import { assertTenantScope } from "@/lib/tenant/context";

async function getPlan(restaurantId: string): Promise<SubscriptionPlan> {
  const db = getDb();
  const [sub] = await db
    .select({ plan: subscriptions.plan, status: subscriptions.status })
    .from(subscriptions)
    .where(eq(subscriptions.restaurantId, restaurantId))
    .limit(1);
  return sub?.plan ?? "FREE";
}

export type { DesignPatch };

export async function ensureRestaurantDesign(restaurantId: string) {
  const db = getDb();
  const [existing] = await db
    .select()
    .from(restaurantDesigns)
    .where(eq(restaurantDesigns.restaurantId, restaurantId))
    .limit(1);
  if (existing) return existing;

  const [settings] = await db
    .select()
    .from(restaurantSettings)
    .where(eq(restaurantSettings.restaurantId, restaurantId))
    .limit(1);

  await db
    .insert(restaurantDesigns)
    .ignore()
    .values({
      restaurantId,
      themeId: settings?.themeSlug ?? "modern",
      primaryColor: settings?.brandPrimaryColor ?? null,
    });

  const [row] = await db
    .select()
    .from(restaurantDesigns)
    .where(eq(restaurantDesigns.restaurantId, restaurantId))
    .limit(1);
  return row!;
}

async function assetUrl(
  restaurantId: string,
  assetId: string | null | undefined,
): Promise<string | null> {
  if (!assetId) return null;
  const db = getDb();
  const [asset] = await db
    .select()
    .from(uploadedAssets)
    .where(eq(uploadedAssets.id, assetId))
    .limit(1);
  if (!asset) return null;
  assertTenantScope(asset.restaurantId, restaurantId);
  return asset.url;
}

export async function assertAssetOwnedByRestaurant(
  restaurantId: string,
  assetId: string | null | undefined,
) {
  if (!assetId) return;
  const db = getDb();
  const [asset] = await db
    .select({ id: uploadedAssets.id, restaurantId: uploadedAssets.restaurantId })
    .from(uploadedAssets)
    .where(eq(uploadedAssets.id, assetId))
    .limit(1);
  if (!asset) throw new Error("Asset not found");
  assertTenantScope(asset.restaurantId, restaurantId);
}

export async function updateRestaurantDesign(params: {
  restaurantId: string;
  actorUserId: string;
  actorRestaurantId: string;
  plan: SubscriptionPlan;
  patch: DesignPatch;
}) {
  assertTenantScope(params.restaurantId, params.actorRestaurantId);
  assertDesignPatchAllowed(params.plan, params.patch);

  await assertAssetOwnedByRestaurant(params.restaurantId, params.patch.logoAssetId);
  await assertAssetOwnedByRestaurant(params.restaurantId, params.patch.coverAssetId);
  await assertAssetOwnedByRestaurant(params.restaurantId, params.patch.faviconAssetId);

  let customCss = params.patch.customCss;
  if (customCss !== undefined) {
    customCss = sanitizeCustomCss(customCss);
  }

  const db = getDb();
  await ensureRestaurantDesign(params.restaurantId);

  await db
    .update(restaurantDesigns)
    .set({
      ...params.patch,
      customCss,
      updatedAt: new Date(),
    })
    .where(eq(restaurantDesigns.restaurantId, params.restaurantId));

  const [updated] = await db
    .select()
    .from(restaurantDesigns)
    .where(eq(restaurantDesigns.restaurantId, params.restaurantId))
    .limit(1);

  if (!updated) throw new Error("Restaurant design not found");

  if (params.patch.themeId || params.patch.primaryColor !== undefined) {
    await db
      .update(restaurantSettings)
      .set({
        ...(params.patch.themeId ? { themeSlug: params.patch.themeId } : {}),
        ...(params.patch.primaryColor !== undefined
          ? { brandPrimaryColor: params.patch.primaryColor }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(restaurantSettings.restaurantId, params.restaurantId));
  }

  const logoUrl = await assetUrl(params.restaurantId, updated.logoAssetId);
  const coverUrl = await assetUrl(params.restaurantId, updated.coverAssetId);
  if (logoUrl || coverUrl) {
    await db
      .update(restaurants)
      .set({
        ...(logoUrl ? { logoUrl } : {}),
        ...(coverUrl ? { coverImageUrl: coverUrl } : {}),
        updatedAt: new Date(),
      })
      .where(eq(restaurants.id, params.restaurantId));
  }

  await writeAuditLog({
    restaurantId: params.restaurantId,
    userId: params.actorUserId,
    action: "restaurant.design_updated",
    entityType: "restaurant_design",
    entityId: params.restaurantId,
  });

  return updated;
}

export async function resolveTenantDesign(
  restaurantId: string,
  plan?: SubscriptionPlan | null,
): Promise<ResolvedRestaurantDesign> {
  const db = getDb();
  const design = await ensureRestaurantDesign(restaurantId);
  const resolvedPlan = plan ?? (await getPlan(restaurantId));
  const [restaurant] = await db
    .select({
      logoUrl: restaurants.logoUrl,
      coverImageUrl: restaurants.coverImageUrl,
    })
    .from(restaurants)
    .where(eq(restaurants.id, restaurantId))
    .limit(1);

  const logoUrl =
    (await assetUrl(restaurantId, design.logoAssetId)) ??
    restaurant?.logoUrl ??
    null;
  const coverUrl =
    (await assetUrl(restaurantId, design.coverAssetId)) ??
    restaurant?.coverImageUrl ??
    null;
  const faviconUrl = await assetUrl(restaurantId, design.faviconAssetId);

  const overrides: DesignOverrides = {
    themeId: design.themeId,
    primaryColor: design.primaryColor,
    secondaryColor: design.secondaryColor,
    accentColor: design.accentColor,
    backgroundColor: design.backgroundColor,
    textColor: design.textColor,
    headingFont: design.headingFont,
    bodyFont: design.bodyFont,
    buttonStyle: design.buttonStyle,
    cardStyle: design.cardStyle,
    navigationStyle: design.navigationStyle,
    menuLayout: design.menuLayout,
    imageStyle: design.imageStyle,
    footerStyle: design.footerStyle,
    customCss: design.customCss,
    customCssEnabled: design.customCssEnabled,
    whiteLabelEnabled: design.whiteLabelEnabled,
    logoUrl,
    coverUrl,
    faviconUrl,
  };

  return resolveRestaurantDesign(overrides, resolvedPlan);
}

export async function getDesignAdminView(restaurantId: string) {
  const db = getDb();
  const design = await ensureRestaurantDesign(restaurantId);
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.restaurantId, restaurantId))
    .limit(1);
  const tenantDomains = await db
    .select({
      hostname: domains.hostname,
      verified: domains.verified,
      isPrimary: domains.isPrimary,
    })
    .from(domains)
    .where(eq(domains.restaurantId, restaurantId));

  return {
    restaurantId,
    themeId: design.themeId,
    whiteLabelEnabled: design.whiteLabelEnabled,
    customCssEnabled: design.customCssEnabled,
    hasLogo: Boolean(design.logoAssetId),
    hasCover: Boolean(design.coverAssetId),
    hasFavicon: Boolean(design.faviconAssetId),
    plan: subscription?.plan ?? "FREE",
    subscriptionStatus: subscription?.status ?? "trialing",
    entitlements: getEntitlements(subscription?.plan ?? "FREE"),
    customDomain: tenantDomains.some((d) => d.verified),
    domains: tenantDomains,
  };
}
