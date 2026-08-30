import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getRestaurantBySlug,
  getRestaurantPublicProfile,
} from "@/services/restaurant.service";
import { getMenuTree } from "@/services/menu.service";
import { resolvePublicLanguage } from "@/lib/i18n/public-languages";
import { PublicMenuClient } from "@/components/restaurant/public-menu-client";
import type { PublicMenuProduct } from "@/components/restaurant/public-home";
import { resolveTenantDesign } from "@/services/design.service";
import { buildRestaurantMetadata } from "@/lib/seo/metadata";
import { resolveRestaurantSeo } from "@/services/seo.service";
import { getPublicRequestContext } from "@/lib/tenant/public-request";
import {
  buildHreflangAlternates,
  buildLocalizedPublicUrl,
} from "@/lib/seo/urls";

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
    return { title: "Menu not found", robots: { index: false, follow: false } };
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

  const displayName = translation?.name ?? profile.restaurant.name;
  const title = `${displayName} Menu`;
  const description =
    translation?.description ??
    profile.restaurant.description ??
    `Browse ${displayName}'s current menu with prices, photos and ordering options.`;

  return buildRestaurantMetadata({
    restaurant: profile.restaurant,
    language,
    whiteLabel: design.whiteLabelEnabled,
    faviconUrl: design.faviconUrl,
    resolved: {
      ...seo,
      title,
      description,
      ogTitle: title,
      ogDescription: description,
      canonicalUrl: buildLocalizedPublicUrl({
        publicBasePath: requestContext.publicBasePath,
        language,
        defaultLanguage: profile.restaurant.defaultLanguage,
        hostname: requestContext.customHostname,
        pathSuffix: "menu",
      }),
      hreflang: buildHreflangAlternates({
        publicBasePath: requestContext.publicBasePath,
        defaultLanguage: profile.restaurant.defaultLanguage,
        languages: seo.languages,
        hostname: requestContext.customHostname,
        pathSuffix: "menu",
      }),
    },
  });
}

function flattenMenu(
  menus: Awaited<ReturnType<typeof getMenuTree>>,
  language: string,
) {
  const products: PublicMenuProduct[] = [];
  const categories: Array<{ id: string; name: string }> = [];
  const seen = new Set<string>();

  for (const menu of menus) {
    for (const category of menu.categories) {
      const catName =
        category.translations.find((t) => t.languageCode === language)?.name ??
        category.translations[0]?.name ??
        "Category";
      if (!seen.has(category.id)) {
        seen.add(category.id);
        categories.push({ id: category.id, name: catName });
      }
      for (const product of category.products) {
        const t =
          product.translations.find((tr) => tr.languageCode === language) ??
          product.translations[0];
        products.push({
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

  return { products, categories };
}

export default async function PublicMenuPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant || !restaurant.isPublished) notFound();

  const menus = await getMenuTree(restaurant.id);
  const language = resolvePublicLanguage(
    lang ?? restaurant.defaultLanguage,
    restaurant.supportedLanguages,
    restaurant.defaultLanguage,
  );
  const { products, categories } = flattenMenu(menus, language);

  return <PublicMenuClient products={products} categories={categories} />;
}
