import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { restaurants, branches } from "./restaurants";
import { waiterRequestTypeEnum } from "./enums";
import { pkId, refId } from "../columns";

export const waiterRequests = mysqlTable("waiter_requests", {
  id: pkId(),
  restaurantId: refId("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  branchId: refId("branch_id").references(() => branches.id, {
    onDelete: "set null",
  }),
  type: waiterRequestTypeEnum.notNull(),
  tableLabel: varchar("table_label", { length: 64 }),
  status: varchar("status", { length: 32 }).notNull().default("NEW"),
  acknowledgedByUserId: refId("acknowledged_by_user_id"),
  acknowledgedAt: timestamp("acknowledged_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export type WaiterRequest = typeof waiterRequests.$inferSelect;
