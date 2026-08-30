import {
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
import { products } from "./menus";
import { orderStatusEnum, orderTypeEnum } from "./enums";
import { qrCodes } from "./analytics";
import { pkId, refId } from "../columns";

export const orders = mysqlTable(
  "orders",
  {
    id: pkId(),
    restaurantId: refId("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    branchId: refId("branch_id").references(() => branches.id, {
      onDelete: "set null",
    }),
    orderNumber: int("order_number").notNull(),
    orderType: orderTypeEnum.notNull().default("TABLE"),
    status: orderStatusEnum.notNull().default("NEW"),
    customerName: text("customer_name"),
    customerPhone: varchar("customer_phone", { length: 32 }),
    customerEmail: varchar("customer_email", { length: 254 }),
    customerNotes: text("customer_notes"),
    tableLabel: varchar("table_label", { length: 64 }),
    qrCodeId: refId("qr_code_id").references(() => qrCodes.id, {
      onDelete: "set null",
    }),
    subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
    tax: decimal("tax", { precision: 12, scale: 2 }).notNull().default("0"),
    total: decimal("total", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("AMD"),
    metadata: json("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("orders_restaurant_number_idx").on(
      table.restaurantId,
      table.orderNumber,
    ),
  ],
);

export const orderItems = mysqlTable("order_items", {
  id: pkId(),
  orderId: refId("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  restaurantId: refId("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  productId: refId("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  productName: text("product_name").notNull(),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  quantity: int("quantity").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const orderEvents = mysqlTable("order_events", {
  id: pkId(),
  orderId: refId("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  restaurantId: refId("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  status: orderStatusEnum.notNull(),
  actorUserId: refId("actor_user_id"),
  note: text("note"),
  metadata: json("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type OrderEvent = typeof orderEvents.$inferSelect;
