CREATE TABLE `rate_limit_buckets` (
	`bucket_key` varchar(128) NOT NULL,
	`request_count` int NOT NULL DEFAULT 0,
	`reset_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rate_limit_buckets_bucket_key` PRIMARY KEY(`bucket_key`)
);--> statement-breakpoint
ALTER TABLE `notification_deliveries` ADD COLUMN `attempt_count` int NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `notification_deliveries` ADD COLUMN `next_attempt_at` timestamp;--> statement-breakpoint
ALTER TABLE `notification_deliveries` ADD COLUMN `locked_at` timestamp;--> statement-breakpoint
ALTER TABLE `notification_deliveries` ADD COLUMN `lock_token` varchar(64);--> statement-breakpoint
CREATE UNIQUE INDEX `notification_deliveries_campaign_subscription_idx` ON `notification_deliveries` (`campaign_id`,`subscription_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_restaurant_number_idx` ON `orders` (`restaurant_id`,`order_number`);
