export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { getDb } from "@/db";
import { restaurants } from "@/db/schema";
import { restaurantSeoSettings } from "@/db/schema/seo";
import { eq } from "drizzle-orm";
import { getPlatformBaseUrl } from "@/lib/utils/slug";
import { buildRestaurantPublicPath } from "@/lib/utils/public-urls";
import { marketingFeatures } from "@/data/marketing-features";
import {
  buildAbsolutePublicUrl,
  buildLocalizedPublicUrl,
  normalizeSeoLanguages,
} from "@/lib/seo/urls";

function staticEntries(baseUrl: string, lastModified: Date): MetadataRoute.Sitemap {
  const paths = [
    { path: "/", priority: 1 },
    { path: "/pricing", priority: 0.9 },
    { path: "/features", priority: 0.9 },
    { path: "/terms", priority: 0.3 },
    { path: "/privacy", priority: 0.3 },
    ...marketingFeatures.map((feature) => ({
      path: `/features/${feature.slug}`,
      priority: 0.75,
    })),
  ];

  return paths.map((entry) => ({
    url: buildAbsolutePublicUrl(entry.path, baseUrl),
    lastModified,
    changeFrequency: entry.path === "/" ? "weekly" : "monthly",
    priority: entry.priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getPlatformBaseUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = staticEntries(baseUrl, now);

  try {
    const db = getDb();
    const rows = await db
      .select({
        slug: restaurants.slug,
        updatedAt: restaurants.updatedAt,
        supportedLanguages: restaurants.supportedLanguages,
        defaultLanguage: restaurants.defaultLanguage,
        indexable: restaurantSeoSettings.indexable,
      })
      .from(restaurants)
      .leftJoin(
        restaurantSeoSettings,
        eq(restaurantSeoSettings.restaurantId, restaurants.id),
      )
      .where(eq(restaurants.isPublished, true));

    for (const r of rows) {
      if (r.indexable === false) continue;
      const langs = normalizeSeoLanguages(
        r.defaultLanguage,
        r.supportedLanguages as string[] | null,
      );
      entries.push({
        url: buildAbsolutePublicUrl(buildRestaurantPublicPath(r.slug), baseUrl),
        lastModified: r.updatedAt,
        changeFrequency: "daily",
        priority: 0.8,
      });
      for (const lang of langs) {
        if (lang === r.defaultLanguage) continue;
        entries.push({
          url: buildLocalizedPublicUrl({
            publicBasePath: buildRestaurantPublicPath(r.slug),
            language: lang,
            defaultLanguage: r.defaultLanguage,
            hostname: baseUrl,
          }),
          lastModified: r.updatedAt,
          changeFrequency: "daily",
          priority: 0.7,
        });
      }
    }

    return entries;
  } catch {
    return entries;
  }
}
