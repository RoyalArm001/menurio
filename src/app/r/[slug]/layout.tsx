import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getRestaurantPublicProfile, resolveRestaurantSlug } from "@/services/restaurant.service";
import { resolveTenantDesign } from "@/services/design.service";
import { PublicRestaurantShell } from "@/components/restaurant/public-shell";
import type { PublicRestaurantData } from "@/contexts/public-restaurant-context";
import { buildRestaurantMetadata } from "@/lib/seo/metadata";
import { resolveRestaurantSeo } from "@/services/seo.service";
import {
  isPwaAvailableForRestaurant,
  isPushAvailableForRestaurant,
} from "@/services/pwa.service";
import { resolvePwaBranding } from "@/lib/pwa/resolve-branding";
import { getVapidPublicKey } from "@/lib/push/vapid";
import { getPublicRequestContext } from "@/lib/tenant/public-request";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveRestaurantSlug(slug);
  if (resolved.redirectedFrom && resolved.restaurant?.isPublished) {
    redirect(`/r/${resolved.restaurant.slug}`);
  }
  const profile = await getRestaurantPublicProfile(slug);
  if (!profile || !profile.restaurant.isPublished) return { title: "Not Found", robots: { index: false, follow: false } };
  const design = await resolveTenantDesign(
    profile.restaurant.id,
    profile.subscription?.plan,
  );
  const plan = profile.subscription?.plan ?? "FREE";
  const requestContext = await getPublicRequestContext(
    profile.restaurant.id,
    profile.restaurant.slug,
  );
  const translation =
    profile.translations.find((t) => t.languageCode === profile.restaurant.defaultLanguage) ??
    profile.translations[0];
  const seo = await resolveRestaurantSeo({
    restaurant: profile.restaurant,
    translation,
    settings: profile.settings,
    plan,
    language: profile.restaurant.defaultLanguage,
    coverImageUrl: design.coverUrl ?? profile.restaurant.coverImageUrl,
    faviconUrl: design.faviconUrl,
    whiteLabel: design.whiteLabelEnabled,
    hostname: requestContext.customHostname,
    publicBasePath: requestContext.publicBasePath,
  });
  const pwaAvailable = isPwaAvailableForRestaurant({
    slug,
    restaurantName: profile.restaurant.name,
    plan,
    settings: profile.settings,
  });
  const branding = resolvePwaBranding({
    restaurantName: profile.restaurant.name,
    pwaDisplayName: profile.settings?.pwaDisplayName,
    pwaIconUrl: profile.settings?.pwaIconUrl,
    logoUrl: design.logoUrl ?? profile.restaurant.logoUrl,
  });

  return {
    ...buildRestaurantMetadata({
      restaurant: profile.restaurant,
      whiteLabel: design.whiteLabelEnabled,
      faviconUrl: design.faviconUrl,
      resolved: seo,
    }),
    manifest: pwaAvailable
      ? `${requestContext.publicBasePath}/manifest.webmanifest`
      : undefined,
    appleWebApp: pwaAvailable
      ? { capable: true, title: branding.name, statusBarStyle: "default" }
      : undefined,
    other: {
      google: "notranslate",
    },
  };
}

export default async function PublicRestaurantLayout({
  children,
  params,
}: LayoutProps) {
  const { slug } = await params;
  const resolved = await resolveRestaurantSlug(slug);
  if (resolved.redirectedFrom && resolved.restaurant?.isPublished) {
    redirect(`/r/${resolved.restaurant.slug}`);
  }
  const profile = await getRestaurantPublicProfile(slug);

  if (!profile || !profile.restaurant.isPublished) {
    notFound();
  }

  const design = await resolveTenantDesign(
    profile.restaurant.id,
    profile.subscription?.plan,
  );

  const translation =
    profile.translations.find(
      (t) => t.languageCode === profile.restaurant.defaultLanguage,
    ) ?? profile.translations[0];

  const plan = profile.subscription?.plan ?? "FREE";
  const requestContext = await getPublicRequestContext(
    profile.restaurant.id,
    profile.restaurant.slug,
  );
  const logoUrl = design.logoUrl ?? profile.restaurant.logoUrl;
  const pwaAvailable = isPwaAvailableForRestaurant({
    slug,
    restaurantName: profile.restaurant.name,
    plan,
    settings: profile.settings,
  });
  const pushAvailable = isPushAvailableForRestaurant({
    plan,
    settings: profile.settings,
  });
  const branding = resolvePwaBranding({
    restaurantName: profile.restaurant.name,
    pwaDisplayName: profile.settings?.pwaDisplayName,
    pwaIconUrl: profile.settings?.pwaIconUrl,
    logoUrl,
  });

  const data: PublicRestaurantData = {
    slug: profile.restaurant.slug,
    id: profile.restaurant.id,
    name: translation?.name ?? profile.restaurant.name,
    description: translation?.description ?? profile.restaurant.description,
    tagline: translation?.tagline ?? profile.settings?.tagline ?? null,
    translations: profile.translations.map((t) => ({
      languageCode: t.languageCode,
      name: t.name,
      description: t.description,
      tagline: t.tagline,
    })),
    logoUrl: design.logoUrl ?? profile.restaurant.logoUrl,
    coverImageUrl: design.coverUrl ?? profile.restaurant.coverImageUrl,
    defaultLanguage: profile.restaurant.defaultLanguage,
    supportedLanguages: profile.restaurant.supportedLanguages,
    publicBasePath: requestContext.publicBasePath,
    customHostname: requestContext.customHostname,
    currency: profile.restaurant.currency,
    address: profile.settings?.address ?? null,
    phone: profile.settings?.phone ?? null,
    email: profile.settings?.email ?? null,
    deliveryEnabled: profile.settings?.deliveryEnabled ?? false,
    pickupEnabled: profile.settings?.pickupEnabled ?? true,
    tableOrderingEnabled: profile.settings?.tableOrderingEnabled ?? false,
    waiterCallEnabled: profile.settings?.waiterCallEnabled ?? false,
    socialLinks: profile.settings?.socialLinks ?? {},
    themeSlug: design.themeId,
    design,
    plan,
    pwa: {
      enabled: pwaAvailable,
      canInstall: pwaAvailable,
      displayName: branding.name,
      iconUrl: branding.iconUrl,
    },
    push: {
      enabled: pushAvailable,
      canSubscribe: pushAvailable && Boolean(getVapidPublicKey()),
      vapidPublicKey: pushAvailable ? getVapidPublicKey() : null,
    },
  };

  return <PublicRestaurantShell data={data}>{children}</PublicRestaurantShell>;
}
