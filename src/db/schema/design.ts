import {
  boolean,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { restaurants } from "./restaurants";
import { uploadedAssets } from "./imports";
import { refId } from "../columns";

export const restaurantDesigns = mysqlTable("restaurant_designs", {
  restaurantId: refId("restaurant_id")
    .primaryKey()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  themeId: varchar("theme_id", { length: 32 }).notNull().default("modern"),
  logoAssetId: refId("logo_asset_id").references(() => uploadedAssets.id, {
    onDelete: "set null",
  }),
  coverAssetId: refId("cover_asset_id").references(() => uploadedAssets.id, {
    onDelete: "set null",
  }),
  faviconAssetId: refId("favicon_asset_id").references(() => uploadedAssets.id, {
    onDelete: "set null",
  }),
  primaryColor: varchar("primary_color", { length: 16 }),
  secondaryColor: varchar("secondary_color", { length: 16 }),
  accentColor: varchar("accent_color", { length: 16 }),
  backgroundColor: varchar("background_color", { length: 16 }),
  textColor: varchar("text_color", { length: 16 }),
  headingFont: varchar("heading_font", { length: 32 }),
  bodyFont: varchar("body_font", { length: 32 }),
  buttonStyle: varchar("button_style", { length: 32 }),
  cardStyle: varchar("card_style", { length: 32 }),
  navigationStyle: varchar("navigation_style", { length: 32 }),
  menuLayout: varchar("menu_layout", { length: 32 }),
  imageStyle: varchar("image_style", { length: 32 }),
  footerStyle: varchar("footer_style", { length: 32 }),
  customCss: text("custom_css"),
  customCssEnabled: boolean("custom_css_enabled").notNull().default(false),
  whiteLabelEnabled: boolean("white_label_enabled").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export type RestaurantDesign = typeof restaurantDesigns.$inferSelect;
