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
import { domainTypeEnum } from "./enums";
import { pkId, refId } from "../columns";

export const themes = mysqlTable("themes", {
  id: pkId(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  config: json("config").$type<Record<string, unknown>>().notNull().default({}),
  isSystem: boolean("is_system").notNull().default(true),
  restaurantId: refId("restaurant_id").references(() => restaurants.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const domains = mysqlTable(
  "domains",
  {
    id: pkId(),
    restaurantId: refId("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    hostname: varchar("hostname", { length: 255 }).notNull(),
    type: domainTypeEnum.notNull().default("custom"),
    verified: boolean("verified").notNull().default(false),
    isPrimary: boolean("is_primary").notNull().default(false),
    verificationToken: varchar("verification_token", { length: 128 }),
    sslStatus: varchar("ssl_status", { length: 32 }).default("pending"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("domains_hostname_idx").on(table.hostname)],
);

export type Theme = typeof themes.$inferSelect;
export type Domain = typeof domains.$inferSelect;
