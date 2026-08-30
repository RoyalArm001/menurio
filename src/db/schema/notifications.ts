import {
  boolean,
  int,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import {
  notificationCampaignStatusEnum,
  notificationDeliveryStatusEnum,
} from "./enums";
import { restaurants } from "./restaurants";
import { users } from "./users";
import { pkId, refId } from "../columns";

export const pushSubscriptions = mysqlTable(
  "push_subscriptions",
  {
    id: pkId(),
    restaurantId: refId("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    endpoint: text("endpoint").notNull(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    userAgent: varchar("user_agent", { length: 512 }),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("push_subscriptions_endpoint_idx").on(table.endpoint),
  ],
);

export const notificationCampaigns = mysqlTable("notification_campaigns", {
  id: pkId(),
  restaurantId: refId("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  createdByUserId: refId("created_by_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  title: varchar("title", { length: 120 }).notNull(),
  message: text("message").notNull(),
  imageUrl: text("image_url"),
  targetUrl: text("target_url").notNull(),
  status: notificationCampaignStatusEnum.notNull().default("DRAFT"),
  scheduledAt: timestamp("scheduled_at", { mode: "date" }),
  sentAt: timestamp("sent_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const notificationDeliveries = mysqlTable("notification_deliveries", {
  id: pkId(),
  campaignId: refId("campaign_id")
    .notNull()
    .references(() => notificationCampaigns.id, { onDelete: "cascade" }),
  subscriptionId: refId("subscription_id")
    .notNull()
    .references(() => pushSubscriptions.id, { onDelete: "cascade" }),
  status: notificationDeliveryStatusEnum.notNull().default("PENDING"),
  error: text("error"),
  attemptCount: int("attempt_count").notNull().default(0),
  nextAttemptAt: timestamp("next_attempt_at", { mode: "date" }),
  lockedAt: timestamp("locked_at", { mode: "date" }),
  lockToken: varchar("lock_token", { length: 64 }),
  sentAt: timestamp("sent_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("notification_deliveries_campaign_subscription_idx").on(
    table.campaignId,
    table.subscriptionId,
  ),
]);

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type NotificationCampaign = typeof notificationCampaigns.$inferSelect;
export type NotificationDelivery = typeof notificationDeliveries.$inferSelect;
