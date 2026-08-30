export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import Script from "next/script";
import type { Metadata } from "next";
import {
  getRestaurantPublicProfile,
  resolveRestaurantSlug,
} from "@/services/restaurant.service";
import { resolveTenantDesign } from "@/services/design.service";
import { getMenuTree } from "@/services/menu.service";
import {
  buildRestaurantMetadata,
  buildRestaurantJsonLd,
  buildMenuJsonLd,
  serializeJsonLd,
} from "@/lib/seo/metadata";
import { resolvePublicLanguage } from "@/lib/i18n/public-languages";
import { resolveRestaurantSeo } from "@/services/seo.service";
import { PublicHomePage, type PublicMenuProduct } from "@/components/restaurant/public-home";
import { getPublicRequestContext } from "@/lib/tenant/public-request";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = await searchParams;
  const profile = await getRestaurantPublicProfile(slug);
  if (!profile || !profile.restaurant.isPublished) {
    return { title: "Not Found", robots: { index: false, follow: false } };
  }
  const plan = profile.subscription?.plan ?? "FREE";
  const language = resolvePublicLanguage(
    lang ?? profile.restaurant.defaultLanguage,
    profile.restaurant.supportedLanguages,
    profile.restaurant.defaultLanguage,
  );
  const translation =
    profile.translations.find((t) => t.languageCode === language) ??
    profile.translations[0];
  const design = await resolveTenantDesign(profile.restaurant.id, plan);
  const requestContext = await getPublicRequestContext(
    profile.restaurant.id,
    profile.restaurant.slug,
  );
  const seo = await resolveRestaurantSeo({
    restaurant: profile.restaurant,
    translation,
    settings: profile.settings,
    plan,
    language,
    coverImageUrl: design.coverUrl ?? profile.restaurant.coverImageUrl,
    faviconUrl: design.faviconUrl,
    whiteLabel: design.whiteLabelEnabled,
    hostname: requestContext.customHostname,
    publicBasePath: requestContext.publicBasePath,
  });
  return buildRestaurantMetadata({
    restaurant: profile.restaurant,
    language,
    whiteLabel: design.whiteLabelEnabled,
    faviconUrl: design.faviconUrl,
    resolved: seo,
  });
}

function flattenProducts(
  menus: Awaited<ReturnType<typeof getMenuTree>>,
  language: string,
): PublicMenuProduct[] {
  const result: PublicMenuProduct[] = [];
  for (const menu of menus) {
    for (const category of menu.categories) {
      const catName =
        category.translations.find((t) => t.languageCode === language)?.name ??
        category.translations[0]?.name ??
        "Category";
      for (const product of category.products) {
        const t =
          product.translations.find((tr) => tr.languageCode === language) ??
          product.translations[0];
        result.push({
          id: product.id,
          name: t?.name ?? "Item",
          description: t?.description,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : null,
          imageUrl: product.imageUrl,
          isAvailable: product.isAvailable,
          isFeatured: product.isFeatured ?? false,
          categoryId: category.id,
          categoryName: catName,
          tags: product.tags ?? [],
        });
      }
    }
  }
  return result;
}

export default async function PublicRestaurantPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { lang } = await searchParams;

  const resolved = await resolveRestaurantSlug(slug);
  if (resolved.redirectedFrom && resolved.restaurant?.isPublished) {
    redirect(`/r/${resolved.restaurant.slug}`);
  }

  const profile = await getRestaurantPublicProfile(slug);
  if (!profile || !profile.restaurant.isPublished) {
    notFound();
  }

  const plan = profile.subscription?.plan ?? "FREE";
  const language = resolvePublicLanguage(
    lang ?? profile.restaurant.defaultLanguage,
    profile.restaurant.supportedLanguages,
    profile.restaurant.defaultLanguage,
  );
  const translation =
    profile.translations.find((t) => t.languageCode === language) ??
    profile.translations[0];

  const design = await resolveTenantDesign(profile.restaurant.id, plan);
  const requestContext = await getPublicRequestContext(
    profile.restaurant.id,
    profile.restaurant.slug,
  );
  const seo = await resolveRestaurantSeo({
    restaurant: profile.restaurant,
    translation,
    settings: profile.settings,
    plan,
    language,
    coverImageUrl: design.coverUrl ?? profile.restaurant.coverImageUrl,
    faviconUrl: design.faviconUrl,
    whiteLabel: design.whiteLabelEnabled,
    hostname: requestContext.customHostname,
    publicBasePath: requestContext.publicBasePath,
  });

  const menus = await getMenuTree(profile.restaurant.id);
  const products = flattenProducts(menus, language);
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  const publicUrl = seo.canonicalUrl;

  const sameAs = [
    profile.settings?.socialLinks?.instagram,
    profile.settings?.socialLinks?.facebook,
  ].filter(Boolean) as string[];

  const restaurantJsonLd =
    seo.structuredData
      ? buildRestaurantJsonLd({
          name: translation?.name ?? profile.restaurant.name,
          description: translation?.description ?? profile.restaurant.description,
          url: publicUrl,
          image: design.coverUrl ?? profile.restaurant.logoUrl,
          telephone: profile.settings?.phone,
          email: profile.settings?.email,
          address: profile.settings?.address,
          openingHours: profile.settings?.openingHours ?? null,
          sameAs,
        })
      : null;

  const defaultMenu = menus[0];
  const menuJsonLd =
    seo.structuredData && defaultMenu
      ? buildMenuJsonLd({
          restaurantName: translation?.name ?? profile.restaurant.name,
          restaurantUrl: publicUrl,
          menuName: defaultMenu.name,
          language,
          items: products.slice(0, 50).map((p) => ({
            name: p.name,
            description: p.description ?? undefined,
            price: String(p.price),
            currency: profile.restaurant.currency,
          })),
        })
      : null;

  return (
    <>
      {restaurantJsonLd ? (
        <Script
          id="restaurant-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(restaurantJsonLd) }}
        />
      ) : null}
      {menuJsonLd ? (
        <Script
          id="menu-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(menuJsonLd) }}
        />
      ) : null}
      {seo.analyticsMeasurementId ? (
        <Script
          id="restaurant-ga"
          src={`https://www.googletagmanager.com/gtag/js?id=${seo.analyticsMeasurementId}`}
          strategy="afterInteractive"
        />
      ) : null}
      {seo.analyticsMeasurementId ? (
        <Script id="restaurant-ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', ${JSON.stringify(seo.analyticsMeasurementId)});
          `}
        </Script>
      ) : null}
      <PublicHomePage featuredProducts={featuredProducts} />
    </>
  );
}
