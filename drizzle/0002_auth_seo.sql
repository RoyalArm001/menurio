CREATE TABLE `restaurant_seo_settings` (
	`restaurant_id` varchar(36) NOT NULL,
	`indexable` boolean NOT NULL DEFAULT true,
	`default_og_image` text,
	`analytics_measurement_id` varchar(32),
	`google_site_verification` varchar(128),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `restaurant_seo_settings_restaurant_id` PRIMARY KEY(`restaurant_id`)
);--> statement-breakpoint
CREATE TABLE `restaurant_seo_translations` (
	`id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`language_code` varchar(5) NOT NULL,
	`title` text,
	`description` text,
	`og_title` text,
	`og_description` text,
	`og_image` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `restaurant_seo_translations_id` PRIMARY KEY(`id`)
);--> statement-breakpoint
CREATE TABLE `slug_redirects` (
	`id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`from_slug` varchar(64) NOT NULL,
	`to_slug` varchar(64) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `slug_redirects_id` PRIMARY KEY(`id`)
);--> statement-breakpoint
ALTER TABLE `restaurant_seo_settings` ADD CONSTRAINT `restaurant_seo_settings_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `restaurant_seo_translations` ADD CONSTRAINT `restaurant_seo_translations_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `slug_redirects` ADD CONSTRAINT `slug_redirects_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX `restaurant_seo_translations_unique_idx` ON `restaurant_seo_translations` (`restaurant_id`,`language_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `slug_redirects_from_slug_idx` ON `slug_redirects` (`from_slug`);
