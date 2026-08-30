import {
  boolean,
  json,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { restaurants, branches } from "./restaurants";
import { menus } from "./menus";
import { qrCodeTypeEnum, analyticsEventTypeEnum } from "./enums";
import { users } from "./users";
import { pkId, refId } from "../columns";

export const qrCodes = mysqlTable(
  "qr_codes",
  {
    id: pkId(),
    restaurantId: refId("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    permanentId: varchar("permanent_id", { length: 32 }).notNull(),
    label: text("label"),
    type: qrCodeTypeEnum.notNull().default("restaurant"),
    targetMenuId: refId("target_menu_id").references(() => menus.id, {
      onDelete: "set null",
    }),
    targetBranchId: refId("target_branch_id").references(() => branches.id, {
      onDelete: "set null",
    }),
    tableLabel: varchar("table_label", { length: 64 }),
    metadata: json("metadata").$type<Record<string, unknown>>().default({}),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("qr_codes_permanent_id_idx").on(table.permanentId)],
);

export const analyticsEvents = mysqlTable("analytics_events", {
  id: pkId(),
  restaurantId: refId("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  eventType: analyticsEventTypeEnum.notNull(),
  sessionId: varchar("session_id", { length: 64 }),
  path: text("path"),
  productId: refId("product_id"),
  qrCodeId: refId("qr_code_id"),
  metadata: json("metadata").$type<Record<string, unknown>>().default({}),
  ipHash: varchar("ip_hash", { length: 128 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const auditLogs = mysqlTable("audit_logs", {
  id: pkId(),
  restaurantId: refId("restaurant_id").references(() => restaurants.id, {
    onDelete: "set null",
  }),
  userId: refId("user_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 128 }).notNull(),
  entityType: varchar("entity_type", { length: 64 }),
  entityId: refId("entity_id"),
  metadata: json("metadata").$type<Record<string, unknown>>().default({}),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export type QrCode = typeof qrCodes.$inferSelect;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
