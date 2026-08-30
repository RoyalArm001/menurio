import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  restaurantSeoSettings,
  restaurantSeoTranslations,
  slugRedirects,
  domains,
} from "@/db/schema";
import type { RestaurantSeoTranslation } from "@/db/schema/seo";
import type { SubscriptionPlan } from "@/lib/entitlements";
import {
  canEditCustomSeo,
  canEditMultilingualSeo,
  canUseHreflang,
  canUseStructuredData,
  canUseCustomDomainSeo,
  canUseSeoAnalytics,
} from "@/lib/entitlements/seo";
import {
  buildRestaurantPublicPath,
  buildRestaurantPublicUrl,
} from "@/lib/utils/public-urls";
import {
  buildAbsolutePublicUrl,
  buildHreflangAlternates,
  buildLocalizedPublicPath,
  normalizeSeoLanguages,
} from "@/lib/seo/urls";

export type SeoResolveInput = {
  restaurant: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    logoUrl: string | null;
    defaultLanguage: string;
    supportedLanguages: string[];
    isPublished: boolean;
  };
  translation?: {
    name: string;
    description: string | null;
    tagline: string | null;
  } | null;
  settings?: {
    seoTitle?: string | null;
    seoDescription?: string | null;
    ogImageUrl?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    openingHours?: Array<{ days: string; time: string }> | null;
    socialLinks?: { instagram?: string; facebook?: string } | null;
  } | null;
  plan: SubscriptionPlan;
  language: string;
  coverImageUrl?: string | null;
  faviconUrl?: string | null;
  whiteLabel?: boolean;
  hostname?: string | null;
  publicBasePath?: string;
};

export type ResolvedSeo = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  canonicalUrl: string;
  indexable: boolean;
  languages: string[];
  hreflang: Record<string, string>;
  structuredData: boolean;
  analyticsMeasurementId?: string | null;
  googleSiteVerification?: string | null;
};

export async function getRestaurantSeoSettings(restaurantId: string) {
  const db = getDb();
  const [settings] = await db
    .select()
    .from(restaurantSeoSettings)
    .where(eq(restaurantSeoSettings.restaurantId, restaurantId))
    .limit(1);
  return settings ?? null;
}

export async function getRestaurantSeoTranslations(restaurantId: string) {
  const db = getDb();
  return db
    .select()
    .from(restaurantSeoTranslations)
    .where(eq(restaurantSeoTranslations.restaurantId, restaurantId));
}

export async function resolvePrimaryPublicUrl(
  restaurantId: string,
  slug: string,
  plan: SubscriptionPlan,
): Promise<string> {
  if (!canUseCustomDomainSeo(plan)) {
    return buildRestaurantPublicUrl(slug);
  }
  const db = getDb();
  const [primary] = await db
    .select()
    .from(domains)
    .where(
      and(
        eq(domains.restaurantId, restaurantId),
        eq(domains.verified, true),
        eq(domains.isPrimary, true),
      ),
    )
    .limit(1);
  if (primary) {
    return `https://${primary.hostname}`;
  }
  return buildRestaurantPublicUrl(slug);
}

function pickTranslationSeo(
  translations: RestaurantSeoTranslation[],
  language: string,
): RestaurantSeoTranslation | undefined {
  return (
    translations.find((t) => t.languageCode === language) ??
    translations[0]
  );
}

export async function resolveRestaurantSeo(
  input: SeoResolveInput,
): Promise<ResolvedSeo> {
  const db = getDb();
  const [seoSettings] = await db
    .select()
    .from(restaurantSeoSettings)
    .where(eq(restaurantSeoSettings.restaurantId, input.restaurant.id))
    .limit(1);

  const seoTranslations = canEditMultilingualSeo(input.plan)
    ? await getRestaurantSeoTranslations(input.restaurant.id)
    : [];

  const localeSeo = pickTranslationSeo(seoTranslations, input.language);
  const displayName = input.translation?.name ?? input.restaurant.name;
  const displayDescription =
    input.translation?.description ??
    input.translation?.tagline ??
    input.restaurant.description;

  const autoTitle = `${displayName} Menu | MENURIO`;
  const autoDescription =
    displayDescription?.trim() ||
    `Browse the menu for ${displayName}. View dishes, prices, and order online.`;

  let title = autoTitle;
  let description = autoDescription;
  let ogTitle = title;
  let ogDescription = description;
  let ogImage =
    input.settings?.ogImageUrl ??
    seoSettings?.defaultOgImage ??
    input.coverImageUrl ??
    input.restaurant.logoUrl ??
    undefined;

  if (canEditCustomSeo(input.plan)) {
    if (localeSeo?.title?.trim()) title = localeSeo.title.trim();
    else if (input.settings?.seoTitle?.trim()) title = input.settings.seoTitle.trim();

    if (localeSeo?.description?.trim()) description = localeSeo.description.trim();
    else if (input.settings?.seoDescription?.trim())
      description = input.settings.seoDescription.trim();

    ogTitle = localeSeo?.ogTitle?.trim() || title;
    ogDescription = localeSeo?.ogDescription?.trim() || description;
    ogImage =
      localeSeo?.ogImage?.trim() ||
      input.settings?.ogImageUrl ||
      seoSettings?.defaultOgImage ||
      ogImage;
  }

  const baseForCanonical = input.hostname?.startsWith("http")
    ? input.hostname.replace(/\/$/, "")
    : input.hostname
      ? `https://${input.hostname}`
      : undefined;

  const canonicalBasePath =
    input.publicBasePath ?? buildRestaurantPublicPath(input.restaurant.slug);
  const canonicalPath = buildLocalizedPublicPath({
    publicBasePath: canonicalBasePath,
    language: input.language,
    defaultLanguage: input.restaurant.defaultLanguage,
  });
  const canonicalUrl = buildAbsolutePublicUrl(canonicalPath, baseForCanonical);

  if (ogImage) {
    ogImage = buildAbsolutePublicUrl(ogImage, baseForCanonical);
  }

  const languages = normalizeSeoLanguages(
    input.restaurant.defaultLanguage,
    input.restaurant.supportedLanguages,
  );

  const hreflang: Record<string, string> = {};
  if (canUseHreflang(input.plan) && languages.length > 1) {
    Object.assign(
      hreflang,
      buildHreflangAlternates({
        publicBasePath: canonicalBasePath,
        defaultLanguage: input.restaurant.defaultLanguage,
        languages,
        hostname: baseForCanonical,
      }),
    );
  }

  const indexable =
    input.restaurant.isPublished && (seoSettings?.indexable ?? true);

  return {
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage: ogImage ?? undefined,
    canonicalUrl,
    indexable,
    languages,
    hreflang,
    structuredData: canUseStructuredData(input.plan),
    analyticsMeasurementId: seoSettings?.analyticsMeasurementId,
    googleSiteVerification: seoSettings?.googleSiteVerification,
  };
}

export async function resolveSlugRedirect(slug: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(slugRedirects)
    .where(eq(slugRedirects.fromSlug, slug))
    .limit(1);
  return row ?? null;
}

export async function upsertRestaurantSeo(
  restaurantId: string,
  plan: SubscriptionPlan,
  data: {
    indexable?: boolean;
    defaultOgImage?: string | null;
    analyticsMeasurementId?: string | null;
    googleSiteVerification?: string | null;
    translations?: Array<{
      languageCode: string;
      title?: string | null;
      description?: string | null;
      ogTitle?: string | null;
      ogDescription?: string | null;
      ogImage?: string | null;
    }>;
  },
) {
  if (!canEditCustomSeo(plan)) {
    throw new Error("Custom SEO requires PRO");
  }

  const db = getDb();
  const now = new Date();
  const [existing] = await db
    .select()
    .from(restaurantSeoSettings)
    .where(eq(restaurantSeoSettings.restaurantId, restaurantId))
    .limit(1);

  if (existing) {
    await db
      .update(restaurantSeoSettings)
      .set({
        indexable: data.indexable ?? existing.indexable,
        defaultOgImage: data.defaultOgImage ?? existing.defaultOgImage,
        analyticsMeasurementId: canUseSeoAnalytics(plan)
          ? (data.analyticsMeasurementId ?? existing.analyticsMeasurementId)
          : existing.analyticsMeasurementId,
        googleSiteVerification:
          data.googleSiteVerification ?? existing.googleSiteVerification,
        updatedAt: now,
      })
      .where(eq(restaurantSeoSettings.restaurantId, restaurantId));
  } else {
    await db.insert(restaurantSeoSettings).values({
      restaurantId,
      indexable: data.indexable ?? true,
      defaultOgImage: data.defaultOgImage ?? null,
      analyticsMeasurementId: canUseSeoAnalytics(plan)
        ? (data.analyticsMeasurementId ?? null)
        : null,
      googleSiteVerification: data.googleSiteVerification ?? null,
    });
  }

  if (data.translations?.length && canEditMultilingualSeo(plan)) {
    for (const tr of data.translations) {
      const [row] = await db
        .select()
        .from(restaurantSeoTranslations)
        .where(
          and(
            eq(restaurantSeoTranslations.restaurantId, restaurantId),
            eq(restaurantSeoTranslations.languageCode, tr.languageCode),
          ),
        )
        .limit(1);

      if (row) {
        await db
          .update(restaurantSeoTranslations)
          .set({
            title: tr.title ?? row.title,
            description: tr.description ?? row.description,
            ogTitle: tr.ogTitle ?? row.ogTitle,
            ogDescription: tr.ogDescription ?? row.ogDescription,
            ogImage: tr.ogImage ?? row.ogImage,
            updatedAt: now,
          })
          .where(eq(restaurantSeoTranslations.id, row.id));
      } else {
        await db.insert(restaurantSeoTranslations).values({
          restaurantId,
          languageCode: tr.languageCode,
          title: tr.title ?? null,
          description: tr.description ?? null,
          ogTitle: tr.ogTitle ?? null,
          ogDescription: tr.ogDescription ?? null,
          ogImage: tr.ogImage ?? null,
        });
      }
    }
  }

  return getRestaurantSeoSettings(restaurantId);
}

export async function recordSlugRedirect(
  restaurantId: string,
  fromSlug: string,
  toSlug: string,
  plan: SubscriptionPlan,
) {
  const { canUseSeoRedirects } = await import("@/lib/entitlements/seo");
  if (!canUseSeoRedirects(plan)) {
    throw new Error("Slug redirects require PRO+");
  }
  const db = getDb();
  await db.insert(slugRedirects).values({
    restaurantId,
    fromSlug,
    toSlug,
  });
}
