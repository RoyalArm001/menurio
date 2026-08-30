import {
  boolean,
  json,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { restaurants } from "./restaurants";
import { pkId, refId } from "../columns";

export type OpeningHours = Array<{ days: string; time: string }>;
export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  phone?: string;
  email?: string;
};

export const restaurantSettings = mysqlTable("restaurant_settings", {
  restaurantId: refId("restaurant_id")
    .primaryKey()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  tagline: text("tagline"),
  address: text("address"),
  phone: varchar("phone", { length: 32 }),
  email: varchar("email", { length: 254 }),
  deliveryEnabled: boolean("delivery_enabled").notNull().default(false),
  pickupEnabled: boolean("pickup_enabled").notNull().default(true),
  tableOrderingEnabled: boolean("table_ordering_enabled").notNull().default(false),
  waiterCallEnabled: boolean("waiter_call_enabled").notNull().default(false),
  openingHours: json("opening_hours").$type<OpeningHours>().default([]),
  socialLinks: json("social_links").$type<SocialLinks>().default({}),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  ogImageUrl: text("og_image_url"),
  brandPrimaryColor: varchar("brand_primary_color", { length: 16 }).default("#D95532"),
  brandFont: varchar("brand_font", { length: 32 }),
  themeSlug: varchar("theme_slug", { length: 32 }).notNull().default("modern"),
  pwaEnabled: boolean("pwa_enabled").notNull().default(true),
  pwaDisplayName: varchar("pwa_display_name", { length: 120 }),
  pwaIconUrl: text("pwa_icon_url"),
  pushNotificationsEnabled: boolean("push_notifications_enabled").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const restaurantTranslations = mysqlTable(
  "restaurant_translations",
  {
    id: pkId(),
    restaurantId: refId("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    languageCode: varchar("language_code", { length: 35 }).notNull(),
    name: text("name").notNull(),
    description: text("description"),
    tagline: text("tagline"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("restaurant_translations_unique_idx").on(
      table.restaurantId,
      table.languageCode,
    ),
  ],
);

export type RestaurantSettings = typeof restaurantSettings.$inferSelect;
export type RestaurantTranslation = typeof restaurantTranslations.$inferSelect;
