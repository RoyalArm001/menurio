import {
  boolean,
  decimal,
  int,
  json,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { restaurants, branches } from "./restaurants";
import { pkId, refId } from "../columns";

export const menus = mysqlTable("menus", {
  id: pkId(),
  restaurantId: refId("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  branchId: refId("branch_id").references(() => branches.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 64 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  isDefault: boolean("is_default").notNull().default(false),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const categories = mysqlTable("categories", {
  id: pkId(),
  menuId: refId("menu_id")
    .notNull()
    .references(() => menus.id, { onDelete: "cascade" }),
  restaurantId: refId("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 64 }).notNull(),
  sortOrder: int("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  imageUrl: text("image_url"),
  imageKey: text("image_key"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const products = mysqlTable("products", {
  id: pkId(),
  categoryId: refId("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  restaurantId: refId("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  compareAtPrice: decimal("compare_at_price", { precision: 12, scale: 2 }),
  currency: varchar("currency", { length: 3 }).notNull().default("AMD"),
  isAvailable: boolean("is_available").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  ingredients: json("ingredients").$type<string[]>().notNull().default([]),
  calories: int("calories"),
  tags: json("tags").$type<string[]>().notNull().default([]),
  allergens: json("allergens").$type<string[]>().notNull().default([]),
  imageUrl: text("image_url"),
  imageKey: text("image_key"),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const productTranslations = mysqlTable(
  "product_translations",
  {
    id: pkId(),
    productId: refId("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    restaurantId: refId("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    languageCode: varchar("language_code", { length: 35 }).notNull(),
    name: text("name").notNull(),
    description: text("description"),
    ingredients: text("ingredients"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("product_translations_unique_idx").on(
      table.productId,
      table.languageCode,
    ),
  ],
);

export const categoryTranslations = mysqlTable(
  "category_translations",
  {
    id: pkId(),
    categoryId: refId("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    restaurantId: refId("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    languageCode: varchar("language_code", { length: 35 }).notNull(),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("category_translations_unique_idx").on(
      table.categoryId,
      table.languageCode,
    ),
  ],
);

export type Menu = typeof menus.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductTranslation = typeof productTranslations.$inferSelect;
export type CategoryTranslation = typeof categoryTranslations.$inferSelect;
