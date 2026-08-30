import {
  boolean,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { restaurants } from "./restaurants";
import { pkId, refId } from "../columns";

export const restaurantSeoSettings = mysqlTable("restaurant_seo_settings", {
  restaurantId: refId("restaurant_id")
    .primaryKey()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  indexable: boolean("indexable").notNull().default(true),
  defaultOgImage: text("default_og_image"),
  analyticsMeasurementId: varchar("analytics_measurement_id", { length: 32 }),
  googleSiteVerification: varchar("google_site_verification", { length: 128 }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const restaurantSeoTranslations = mysqlTable(
  "restaurant_seo_translations",
  {
    id: pkId(),
    restaurantId: refId("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    languageCode: varchar("language_code", { length: 35 }).notNull(),
    title: text("title"),
    description: text("description"),
    ogTitle: text("og_title"),
    ogDescription: text("og_description"),
    ogImage: text("og_image"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("restaurant_seo_translations_unique_idx").on(
      table.restaurantId,
      table.languageCode,
    ),
  ],
);

export const slugRedirects = mysqlTable(
  "slug_redirects",
  {
    id: pkId(),
    restaurantId: refId("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    fromSlug: varchar("from_slug", { length: 64 }).notNull(),
    toSlug: varchar("to_slug", { length: 64 }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("slug_redirects_from_slug_idx").on(table.fromSlug)],
);

export type RestaurantSeoSettings = typeof restaurantSeoSettings.$inferSelect;
export type RestaurantSeoTranslation =
  typeof restaurantSeoTranslations.$inferSelect;
export type SlugRedirect = typeof slugRedirects.$inferSelect;
