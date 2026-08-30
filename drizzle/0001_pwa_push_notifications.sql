ALTER TABLE `restaurant_settings` ADD COLUMN `pwa_enabled` boolean NOT NULL DEFAULT true;--> statement-breakpoint
ALTER TABLE `restaurant_settings` ADD COLUMN `pwa_display_name` varchar(120);--> statement-breakpoint
ALTER TABLE `restaurant_settings` ADD COLUMN `pwa_icon_url` text;--> statement-breakpoint
ALTER TABLE `restaurant_settings` ADD COLUMN `push_notifications_enabled` boolean NOT NULL DEFAULT true;--> statement-breakpoint
CREATE TABLE `push_subscriptions` (
	`id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`endpoint` text NOT NULL,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL,
	`user_agent` varchar(512),
	`active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `push_subscriptions_id` PRIMARY KEY(`id`)
);--> statement-breakpoint
CREATE TABLE `notification_campaigns` (
	`id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`created_by_user_id` varchar(36),
	`title` varchar(120) NOT NULL,
	`message` text NOT NULL,
	`image_url` text,
	`target_url` text NOT NULL,
	`status` enum('DRAFT','SCHEDULED','SENDING','SENT','FAILED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
	`scheduled_at` timestamp,
	`sent_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notification_campaigns_id` PRIMARY KEY(`id`)
);--> statement-breakpoint
CREATE TABLE `notification_deliveries` (
	`id` varchar(36) NOT NULL,
	`campaign_id` varchar(36) NOT NULL,
	`subscription_id` varchar(36) NOT NULL,
	`status` enum('PENDING','SENT','FAILED') NOT NULL DEFAULT 'PENDING',
	`error` text,
	`sent_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notification_deliveries_id` PRIMARY KEY(`id`)
);--> statement-breakpoint
ALTER TABLE `push_subscriptions` ADD CONSTRAINT `push_subscriptions_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification_campaigns` ADD CONSTRAINT `notification_campaigns_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification_campaigns` ADD CONSTRAINT `notification_campaigns_created_by_user_id_users_id_fk` FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification_deliveries` ADD CONSTRAINT `notification_deliveries_campaign_id_notification_campaigns_id_fk` FOREIGN KEY (`campaign_id`) REFERENCES `notification_campaigns`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification_deliveries` ADD CONSTRAINT `notification_deliveries_subscription_id_push_subscriptions_id_fk` FOREIGN KEY (`subscription_id`) REFERENCES `push_subscriptions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX `push_subscriptions_endpoint_idx` ON `push_subscriptions` (`endpoint`(255));
