import type { Metadata } from "next";
import type { Restaurant } from "@/db/schema/restaurants";
import type { ResolvedSeo } from "@/services/seo.service";
import { buildRestaurantPublicUrl } from "@/lib/utils/public-urls";
import { buildHreflangAlternates } from "@/lib/seo/urls";

export interface RestaurantSeoInput {
  restaurant: Pick<
    Restaurant,
    "name" | "slug" | "description" | "logoUrl" | "defaultLanguage" | "supportedLanguages"
  >;
  language?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  coverImageUrl?: string | null;
  faviconUrl?: string | null;
  whiteLabel?: boolean;
  resolved?: ResolvedSeo;
}

export function buildRestaurantMetadata(input: RestaurantSeoInput): Metadata {
  const robots = input.resolved?.indexable ?? true
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
        },
      }
    : {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      };

  if (input.resolved) {
    const seo = input.resolved;
    return {
      title: seo.title,
      description: seo.description,
      icons: input.faviconUrl
        ? { icon: [{ url: input.faviconUrl }] }
        : input.restaurant.logoUrl
          ? { icon: [{ url: input.restaurant.logoUrl }] }
          : undefined,
      alternates: {
        canonical: seo.canonicalUrl,
        languages: Object.keys(seo.hreflang).length ? seo.hreflang : undefined,
      },
      openGraph: {
        type: "website",
        url: seo.canonicalUrl,
        title: seo.ogTitle,
        description: seo.ogDescription,
        locale: input.language ?? input.restaurant.defaultLanguage,
        siteName: input.whiteLabel ? input.restaurant.name : "Menurio",
        images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: seo.ogTitle,
        description: seo.ogDescription,
        images: seo.ogImage ? [seo.ogImage] : undefined,
      },
      robots,
      verification: seo.googleSiteVerification
        ? { google: seo.googleSiteVerification }
        : undefined,
    };
  }

  const lang = input.language ?? input.restaurant.defaultLanguage;
  const url = buildRestaurantPublicUrl(input.restaurant.slug);
  const title = input.seoTitle || `${input.restaurant.name} Menu | MENURIO`;
  const description =
    input.seoDescription ||
    input.restaurant.description ||
    `Browse the menu for ${input.restaurant.name}.`;

  const languages = input.restaurant.supportedLanguages ?? [input.restaurant.defaultLanguage];
  const ogImage = input.coverImageUrl || input.restaurant.logoUrl || undefined;
  const hreflang = buildHreflangAlternates({
    publicBasePath: `/r/${input.restaurant.slug}`,
    defaultLanguage: input.restaurant.defaultLanguage,
    languages,
  });

  return {
    title,
    description,
    icons: input.faviconUrl
      ? { icon: [{ url: input.faviconUrl }] }
      : input.restaurant.logoUrl
        ? { icon: [{ url: input.restaurant.logoUrl }] }
        : undefined,
    alternates: {
      canonical: url,
      languages: Object.keys(hreflang).length ? hreflang : undefined,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      locale: lang,
      siteName: input.whiteLabel ? input.restaurant.name : "Menurio",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots,
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (char) => {
    switch (char) {
      case "<":
        return "\\u003c";
      case ">":
        return "\\u003e";
      case "&":
        return "\\u0026";
      case "\u2028":
        return "\\u2028";
      case "\u2029":
        return "\\u2029";
      default:
        return char;
    }
  });
}

export function buildRestaurantJsonLd(input: {
  name: string;
  description?: string | null;
  url: string;
  image?: string | null;
  telephone?: string | null;
  email?: string | null;
  address?: string | null;
  openingHours?: Array<{ days: string; time: string }> | null;
  sameAs?: string[];
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: input.name,
    url: input.url,
  };

  if (input.description?.trim()) schema.description = input.description.trim();
  if (input.image) schema.image = input.image;
  if (input.telephone?.trim()) schema.telephone = input.telephone.trim();
  if (input.email?.trim()) schema.email = input.email.trim();
  if (input.address?.trim()) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: input.address.trim(),
    };
  }
  if (input.openingHours?.length) {
    schema.openingHoursSpecification = input.openingHours.map((row) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: row.days,
      opens: row.time.split("-")[0]?.trim(),
      closes: row.time.split("-")[1]?.trim(),
    }));
  }
  if (input.sameAs?.length) schema.sameAs = input.sameAs;

  return schema;
}

export function buildMenuJsonLd(params: {
  restaurantName: string;
  restaurantUrl: string;
  menuName: string;
  language?: string;
  items: Array<{ name: string; description?: string | null; price: string; currency: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: params.menuName,
    ...(params.language ? { inLanguage: params.language } : {}),
    hasMenuSection: {
      "@type": "MenuSection",
      hasMenuItem: params.items.map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        description: item.description,
        offers: {
          "@type": "Offer",
          price: item.price,
          priceCurrency: item.currency,
        },
      })),
    },
    provider: {
      "@type": "Restaurant",
      name: params.restaurantName,
      url: params.restaurantUrl,
    },
  };
}
