CREATE TABLE `accounts` (
	`user_id` varchar(36) NOT NULL,
	`type` varchar(32) NOT NULL,
	`provider` varchar(64) NOT NULL,
	`provider_account_id` varchar(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(32),
	`scope` text,
	`id_token` text,
	`session_state` text,
	CONSTRAINT `accounts_provider_provider_account_id_pk` PRIMARY KEY(`provider`,`provider_account_id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`session_token` varchar(255) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `sessions_session_token` PRIMARY KEY(`session_token`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`name` text,
	`email` varchar(254) NOT NULL,
	`email_verified` timestamp,
	`image` text,
	`password_hash` text,
	`mfa_enabled` boolean NOT NULL DEFAULT false,
	`mfa_secret_encrypted` text,
	`is_platform_admin` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification_tokens` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `verification_tokens_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
CREATE TABLE `branches` (
	`id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`slug` varchar(64) NOT NULL,
	`name` text NOT NULL,
	`address` text,
	`phone` varchar(32),
	`email` varchar(254),
	`is_default` boolean NOT NULL DEFAULT false,
	`is_active` boolean NOT NULL DEFAULT true,
	`settings` json DEFAULT ('{}'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `branches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `restaurant_members` (
	`id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`member_role` enum('OWNER','ADMIN','MANAGER','EDITOR','ORDER_OPERATOR') NOT NULL,
	`invited_at` timestamp,
	`accepted_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `restaurant_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `restaurant_members_unique_idx` UNIQUE(`restaurant_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `restaurants` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(64) NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`logo_url` text,
	`cover_image_url` text,
	`default_language` varchar(5) NOT NULL DEFAULT 'en',
	`supported_languages` json NOT NULL DEFAULT ('["en"]'),
	`timezone` varchar(64) NOT NULL DEFAULT 'Asia/Yerevan',
	`currency` varchar(3) NOT NULL DEFAULT 'AMD',
	`settings` json DEFAULT ('{}'),
	`theme_id` varchar(36),
	`owner_user_id` varchar(36) NOT NULL,
	`is_published` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `restaurants_id` PRIMARY KEY(`id`),
	CONSTRAINT `restaurants_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`subscription_plan` enum('FREE','START','PRO','PRO_PLUS') NOT NULL DEFAULT 'FREE',
	`subscription_status` enum('active','trialing','past_due','cancelled','expired') NOT NULL DEFAULT 'trialing',
	`trial_ends_at` timestamp,
	`current_period_start` timestamp,
	`current_period_end` timestamp,
	`external_customer_id` varchar(128),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_restaurant_id_unique` UNIQUE(`restaurant_id`)
);
--> statement-breakpoint
CREATE TABLE `domains` (
	`id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`hostname` varchar(255) NOT NULL,
	`domain_type` enum('platform_subdomain','custom') NOT NULL DEFAULT 'custom',
	`verified` boolean NOT NULL DEFAULT false,
	`is_primary` boolean NOT NULL DEFAULT false,
	`verification_token` varchar(128),
	`ssl_status` varchar(32) DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `domains_id` PRIMARY KEY(`id`),
	CONSTRAINT `domains_hostname_idx` UNIQUE(`hostname`)
);
--> statement-breakpoint
CREATE TABLE `themes` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`slug` varchar(64) NOT NULL,
	`config` json NOT NULL DEFAULT ('{}'),
	`is_system` boolean NOT NULL DEFAULT true,
	`restaurant_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `themes_id` PRIMARY KEY(`id`),
	CONSTRAINT `themes_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` varchar(36) NOT NULL,
	`menu_id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`slug` varchar(64) NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`image_url` text,
	`image_key` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `category_translations` (
	`id` varchar(36) NOT NULL,
	`category_id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`language_code` varchar(5) NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `category_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `category_translations_unique_idx` UNIQUE(`category_id`,`language_code`)
);
--> statement-breakpoint
CREATE TABLE `menus` (
	`id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`branch_id` varchar(36),
	`name` text NOT NULL,
	`slug` varchar(64) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`is_default` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `menus_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_translations` (
	`id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`language_code` varchar(5) NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`ingredients` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_translations_unique_idx` UNIQUE(`product_id`,`language_code`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(36) NOT NULL,
	`category_id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`price` decimal(12,2) NOT NULL,
	`compare_at_price` decimal(12,2),
	`currency` varchar(3) NOT NULL DEFAULT 'AMD',
	`is_available` boolean NOT NULL DEFAULT true,
	`is_featured` boolean NOT NULL DEFAULT false,
	`ingredients` json NOT NULL DEFAULT ('[]'),
	`calories` int,
	`tags` json NOT NULL DEFAULT ('[]'),
	`allergens` json NOT NULL DEFAULT ('[]'),
	`image_url` text,
	`image_key` text,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_events` (
	`id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`order_status` enum('NEW','ACCEPTED','PREPARING','READY','COMPLETED','REJECTED','CANCELLED') NOT NULL DEFAULT 'NEW',
	`actor_user_id` varchar(36),
	`note` text,
	`metadata` json DEFAULT ('{}'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `order_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`product_id` varchar(36),
	`product_name` text NOT NULL,
	`unit_price` decimal(12,2) NOT NULL,
	`quantity` int NOT NULL,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`branch_id` varchar(36),
	`order_number` int NOT NULL,
	`order_type` enum('TABLE','PICKUP','DELIVERY') NOT NULL DEFAULT 'TABLE',
	`order_status` enum('NEW','ACCEPTED','PREPARING','READY','COMPLETED','REJECTED','CANCELLED') NOT NULL DEFAULT 'NEW',
	`customer_name` text,
	`customer_phone` varchar(32),
	`customer_email` varchar(254),
	`customer_notes` text,
	`table_label` varchar(64),
	`qr_code_id` varchar(36),
	`subtotal` decimal(12,2) NOT NULL,
	`tax` decimal(12,2) NOT NULL DEFAULT '0',
	`total` decimal(12,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'AMD',
	`metadata` json DEFAULT ('{}'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `analytics_events` (
	`id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`analytics_event_type` enum('restaurant_page_view','menu_view','qr_scan','product_view','add_to_cart','order_created','waiter_call','bill_request') NOT NULL,
	`session_id` varchar(64),
	`path` text,
	`product_id` varchar(36),
	`qr_code_id` varchar(36),
	`metadata` json DEFAULT ('{}'),
	`ip_hash` varchar(128),
	`user_agent` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36),
	`user_id` varchar(36),
	`action` varchar(128) NOT NULL,
	`entity_type` varchar(64),
	`entity_id` varchar(36),
	`metadata` json DEFAULT ('{}'),
	`ip_address` varchar(45),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `qr_codes` (
	`id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`permanent_id` varchar(32) NOT NULL,
	`label` text,
	`qr_code_type` enum('restaurant','menu','table','promotion') NOT NULL DEFAULT 'restaurant',
	`target_menu_id` varchar(36),
	`target_branch_id` varchar(36),
	`table_label` varchar(64),
	`metadata` json DEFAULT ('{}'),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `qr_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `qr_codes_permanent_id_idx` UNIQUE(`permanent_id`)
);
--> statement-breakpoint
CREATE TABLE `restaurant_settings` (
	`restaurant_id` varchar(36) NOT NULL,
	`tagline` text,
	`address` text,
	`phone` varchar(32),
	`email` varchar(254),
	`delivery_enabled` boolean NOT NULL DEFAULT false,
	`pickup_enabled` boolean NOT NULL DEFAULT true,
	`table_ordering_enabled` boolean NOT NULL DEFAULT false,
	`waiter_call_enabled` boolean NOT NULL DEFAULT false,
	`opening_hours` json DEFAULT ('[]'),
	`social_links` json DEFAULT ('{}'),
	`seo_title` text,
	`seo_description` text,
	`og_image_url` text,
	`brand_primary_color` varchar(16) DEFAULT '#D95532',
	`brand_font` varchar(32),
	`theme_slug` varchar(32) NOT NULL DEFAULT 'modern',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `restaurant_settings_restaurant_id` PRIMARY KEY(`restaurant_id`)
);
--> statement-breakpoint
CREATE TABLE `restaurant_translations` (
	`id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`language_code` varchar(5) NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`tagline` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `restaurant_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `restaurant_translations_unique_idx` UNIQUE(`restaurant_id`,`language_code`)
);
--> statement-breakpoint
CREATE TABLE `import_jobs` (
	`id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`import_job_type` enum('excel','pdf','photo') NOT NULL,
	`import_job_status` enum('pending','preview_ready','confirmed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`file_asset_id` varchar(36),
	`preview_rows` json DEFAULT ('[]'),
	`error_message` text,
	`created_by_user_id` varchar(36),
	`confirmed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `import_jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `uploaded_assets` (
	`id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`key` text NOT NULL,
	`url` text NOT NULL,
	`mime_type` varchar(128) NOT NULL,
	`size_bytes` int NOT NULL,
	`purpose` varchar(32) NOT NULL,
	`original_filename` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `uploaded_assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `waiter_requests` (
	`id` varchar(36) NOT NULL,
	`restaurant_id` varchar(36) NOT NULL,
	`branch_id` varchar(36),
	`waiter_request_type` enum('CALL_WAITER','REQUEST_BILL') NOT NULL,
	`table_label` varchar(64),
	`status` varchar(32) NOT NULL DEFAULT 'NEW',
	`acknowledged_by_user_id` varchar(36),
	`acknowledged_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `waiter_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `restaurant_designs` (
	`restaurant_id` varchar(36) NOT NULL,
	`theme_id` varchar(32) NOT NULL DEFAULT 'modern',
	`logo_asset_id` varchar(36),
	`cover_asset_id` varchar(36),
	`favicon_asset_id` varchar(36),
	`primary_color` varchar(16),
	`secondary_color` varchar(16),
	`accent_color` varchar(16),
	`background_color` varchar(16),
	`text_color` varchar(16),
	`heading_font` varchar(32),
	`body_font` varchar(32),
	`button_style` varchar(32),
	`card_style` varchar(32),
	`navigation_style` varchar(32),
	`menu_layout` varchar(32),
	`image_style` varchar(32),
	`footer_style` varchar(32),
	`custom_css` text,
	`custom_css_enabled` boolean NOT NULL DEFAULT false,
	`white_label_enabled` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `restaurant_designs_restaurant_id` PRIMARY KEY(`restaurant_id`)
);
--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `branches` ADD CONSTRAINT `branches_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `restaurant_members` ADD CONSTRAINT `restaurant_members_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `restaurant_members` ADD CONSTRAINT `restaurant_members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `restaurants` ADD CONSTRAINT `restaurants_owner_user_id_users_id_fk` FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `domains` ADD CONSTRAINT `domains_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `themes` ADD CONSTRAINT `themes_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categories` ADD CONSTRAINT `categories_menu_id_menus_id_fk` FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categories` ADD CONSTRAINT `categories_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `category_translations` ADD CONSTRAINT `category_translations_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `category_translations` ADD CONSTRAINT `category_translations_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `menus` ADD CONSTRAINT `menus_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `menus` ADD CONSTRAINT `menus_branch_id_branches_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_translations` ADD CONSTRAINT `product_translations_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_translations` ADD CONSTRAINT `product_translations_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_events` ADD CONSTRAINT `order_events_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_events` ADD CONSTRAINT `order_events_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_branch_id_branches_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_qr_code_id_qr_codes_id_fk` FOREIGN KEY (`qr_code_id`) REFERENCES `qr_codes`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `analytics_events` ADD CONSTRAINT `analytics_events_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `qr_codes` ADD CONSTRAINT `qr_codes_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `qr_codes` ADD CONSTRAINT `qr_codes_target_menu_id_menus_id_fk` FOREIGN KEY (`target_menu_id`) REFERENCES `menus`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `qr_codes` ADD CONSTRAINT `qr_codes_target_branch_id_branches_id_fk` FOREIGN KEY (`target_branch_id`) REFERENCES `branches`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `restaurant_settings` ADD CONSTRAINT `restaurant_settings_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `restaurant_translations` ADD CONSTRAINT `restaurant_translations_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `import_jobs` ADD CONSTRAINT `import_jobs_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `import_jobs` ADD CONSTRAINT `import_jobs_file_asset_id_uploaded_assets_id_fk` FOREIGN KEY (`file_asset_id`) REFERENCES `uploaded_assets`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `uploaded_assets` ADD CONSTRAINT `uploaded_assets_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `waiter_requests` ADD CONSTRAINT `waiter_requests_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `waiter_requests` ADD CONSTRAINT `waiter_requests_branch_id_branches_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `restaurant_designs` ADD CONSTRAINT `restaurant_designs_restaurant_id_restaurants_id_fk` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `restaurant_designs` ADD CONSTRAINT `restaurant_designs_logo_asset_id_uploaded_assets_id_fk` FOREIGN KEY (`logo_asset_id`) REFERENCES `uploaded_assets`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `restaurant_designs` ADD CONSTRAINT `restaurant_designs_cover_asset_id_uploaded_assets_id_fk` FOREIGN KEY (`cover_asset_id`) REFERENCES `uploaded_assets`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `restaurant_designs` ADD CONSTRAINT `restaurant_designs_favicon_asset_id_uploaded_assets_id_fk` FOREIGN KEY (`favicon_asset_id`) REFERENCES `uploaded_assets`(`id`) ON DELETE set null ON UPDATE no action;