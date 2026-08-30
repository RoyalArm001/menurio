import { mysqlEnum } from "drizzle-orm/mysql-core";

export const memberRoleEnum = mysqlEnum("member_role", [
  "OWNER",
  "ADMIN",
  "MANAGER",
  "EDITOR",
  "ORDER_OPERATOR",
]);

export const subscriptionPlanEnum = mysqlEnum("subscription_plan", [
  "FREE",
  "START",
  "PRO",
  "PRO_PLUS",
]);

export const subscriptionStatusEnum = mysqlEnum("subscription_status", [
  "active",
  "trialing",
  "past_due",
  "cancelled",
  "expired",
]);

export const orderTypeEnum = mysqlEnum("order_type", [
  "TABLE",
  "PICKUP",
  "DELIVERY",
]);

export const importJobTypeEnum = mysqlEnum("import_job_type", [
  "excel",
  "pdf",
  "photo",
]);

export const importJobStatusEnum = mysqlEnum("import_job_status", [
  "pending",
  "preview_ready",
  "confirmed",
  "failed",
  "cancelled",
]);

export const waiterRequestTypeEnum = mysqlEnum("waiter_request_type", [
  "CALL_WAITER",
  "REQUEST_BILL",
]);

export const domainTypeEnum = mysqlEnum("domain_type", [
  "platform_subdomain",
  "custom",
]);

export const orderStatusEnum = mysqlEnum("order_status", [
  "NEW",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "REJECTED",
  "CANCELLED",
]);

export const qrCodeTypeEnum = mysqlEnum("qr_code_type", [
  "restaurant",
  "menu",
  "table",
  "promotion",
]);

export const analyticsEventTypeEnum = mysqlEnum("analytics_event_type", [
  "restaurant_page_view",
  "menu_view",
  "qr_scan",
  "product_view",
  "add_to_cart",
  "order_created",
  "waiter_call",
  "bill_request",
]);

export const notificationCampaignStatusEnum = mysqlEnum("notification_campaign_status", [
  "DRAFT",
  "SCHEDULED",
  "SENDING",
  "SENT",
  "FAILED",
  "CANCELLED",
]);

export const notificationDeliveryStatusEnum = mysqlEnum("notification_delivery_status", [
  "PENDING",
  "SENT",
  "FAILED",
]);
