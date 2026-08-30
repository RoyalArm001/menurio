ALTER TABLE `restaurants` MODIFY COLUMN `default_language` varchar(35) NOT NULL DEFAULT 'en';--> statement-breakpoint
ALTER TABLE `category_translations` MODIFY COLUMN `language_code` varchar(35) NOT NULL;--> statement-breakpoint
ALTER TABLE `product_translations` MODIFY COLUMN `language_code` varchar(35) NOT NULL;--> statement-breakpoint
ALTER TABLE `restaurant_translations` MODIFY COLUMN `language_code` varchar(35) NOT NULL;--> statement-breakpoint
ALTER TABLE `restaurant_seo_translations` MODIFY COLUMN `language_code` varchar(35) NOT NULL;
