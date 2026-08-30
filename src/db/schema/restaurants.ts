import {
  boolean,
  json,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { users } from "./users";
import { pkId, refId } from "../columns";
import {
  memberRoleEnum,
  subscriptionPlanEnum,
  subscriptionStatusEnum,
} from "./enums";

export const restaurants = mysqlTable(
  "restaurants",
  {
    id: pkId(),
    slug: varchar("slug", { length: 64 }).notNull(),
    name: text("name").notNull(),
    description: text("description"),
    logoUrl: text("logo_url"),
    coverImageUrl: text("cover_image_url"),
    defaultLanguage: varchar("default_language", { length: 35 }).notNull().default("en"),
    supportedLanguages: json("supported_languages")
      .$type<string[]>()
      .notNull()
      .default(["en"]),
    timezone: varchar("timezone", { length: 64 }).notNull().default("Asia/Yerevan"),
    currency: varchar("currency", { length: 3 }).notNull().default("AMD"),
    settings: json("settings").$type<Record<string, unknown>>().default({}),
    themeId: refId("theme_id"),
    ownerUserId: refId("owner_user_id")
      .notNull()
      .references(() => users.id),
    isPublished: boolean("is_published").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("restaurants_slug_idx").on(table.slug)],
);

export const branches = mysqlTable("branches", {
  id: pkId(),
  restaurantId: refId("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 64 }).notNull(),
  name: text("name").notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 32 }),
  email: varchar("email", { length: 254 }),
  isDefault: boolean("is_default").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  settings: json("settings").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const restaurantMembers = mysqlTable(
  "restaurant_members",
  {
    id: pkId(),
    restaurantId: refId("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    userId: refId("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: memberRoleEnum.notNull(),
    invitedAt: timestamp("invited_at", { mode: "date" }),
    acceptedAt: timestamp("accepted_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("restaurant_members_unique_idx").on(
      table.restaurantId,
      table.userId,
    ),
  ],
);

export const subscriptions = mysqlTable("subscriptions", {
  id: pkId(),
  restaurantId: refId("restaurant_id")
    .notNull()
    .unique()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  plan: subscriptionPlanEnum.notNull().default("FREE"),
  status: subscriptionStatusEnum.notNull().default("trialing"),
  trialEndsAt: timestamp("trial_ends_at", { mode: "date" }),
  currentPeriodStart: timestamp("current_period_start", { mode: "date" }),
  currentPeriodEnd: timestamp("current_period_end", { mode: "date" }),
  externalCustomerId: varchar("external_customer_id", { length: 128 }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export type Restaurant = typeof restaurants.$inferSelect;
export type Branch = typeof branches.$inferSelect;
export type RestaurantMember = typeof restaurantMembers.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
