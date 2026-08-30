-- WebStile initial schema migration
-- Run via: npm run db:migrate

CREATE TYPE "public"."member_role" AS ENUM('OWNER', 'ADMIN', 'MANAGER', 'EDITOR', 'ORDER_OPERATOR');
CREATE TYPE "public"."subscription_plan" AS ENUM('FREE', 'START', 'PRO', 'PRO_PLUS');
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'trialing', 'past_due', 'cancelled');
CREATE TYPE "public"."domain_type" AS ENUM('platform_subdomain', 'custom');
CREATE TYPE "public"."order_status" AS ENUM('NEW', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'REJECTED', 'CANCELLED');
CREATE TYPE "public"."qr_code_type" AS ENUM('restaurant', 'menu', 'table');
CREATE TYPE "public"."analytics_event_type" AS ENUM('restaurant_page_view', 'menu_view', 'qr_scan', 'product_view', 'add_to_cart', 'order_created');

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text,
  "email" text NOT NULL UNIQUE,
  "email_verified" timestamp,
  "image" text,
  "password_hash" text,
  "mfa_enabled" boolean DEFAULT false NOT NULL,
  "mfa_secret_encrypted" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "accounts" (
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "type" text NOT NULL,
  "provider" text NOT NULL,
  "provider_account_id" text NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text,
  PRIMARY KEY("provider", "provider_account_id")
);

CREATE TABLE "sessions" (
  "session_token" text PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "expires" timestamp NOT NULL
);

CREATE TABLE "verification_tokens" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp NOT NULL,
  PRIMARY KEY("identifier", "token")
);

CREATE TABLE "restaurants" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "logo_url" text,
  "cover_image_url" text,
  "default_language" text DEFAULT 'en' NOT NULL,
  "supported_languages" jsonb DEFAULT '["en"]'::jsonb NOT NULL,
  "timezone" text DEFAULT 'Asia/Yerevan' NOT NULL,
  "currency" text DEFAULT 'AMD' NOT NULL,
  "settings" jsonb DEFAULT '{}'::jsonb,
  "theme_id" uuid,
  "owner_user_id" uuid NOT NULL REFERENCES "users"("id"),
  "is_published" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "restaurants_slug_idx" ON "restaurants" ("slug");

CREATE TABLE "branches" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "restaurant_id" uuid NOT NULL REFERENCES "restaurants"("id") ON DELETE cascade,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "address" text,
  "phone" text,
  "email" text,
  "is_default" boolean DEFAULT false NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "settings" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "restaurant_members" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "restaurant_id" uuid NOT NULL REFERENCES "restaurants"("id") ON DELETE cascade,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "role" "member_role" NOT NULL,
  "invited_at" timestamp,
  "accepted_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "restaurant_members_unique_idx" ON "restaurant_members" ("restaurant_id", "user_id");

CREATE TABLE "subscriptions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "restaurant_id" uuid NOT NULL UNIQUE REFERENCES "restaurants"("id") ON DELETE cascade,
  "plan" "subscription_plan" DEFAULT 'FREE' NOT NULL,
  "status" "subscription_status" DEFAULT 'active' NOT NULL,
  "current_period_start" timestamp,
  "current_period_end" timestamp,
  "external_customer_id" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "themes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "config" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "is_system" boolean DEFAULT true NOT NULL,
  "restaurant_id" uuid REFERENCES "restaurants"("id") ON DELETE cascade,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "domains" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "restaurant_id" uuid NOT NULL REFERENCES "restaurants"("id") ON DELETE cascade,
  "hostname" text NOT NULL,
  "type" "domain_type" DEFAULT 'custom' NOT NULL,
  "verified" boolean DEFAULT false NOT NULL,
  "is_primary" boolean DEFAULT false NOT NULL,
  "verification_token" text,
  "ssl_status" text DEFAULT 'pending',
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "domains_hostname_idx" ON "domains" ("hostname");

CREATE TABLE "menus" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "restaurant_id" uuid NOT NULL REFERENCES "restaurants"("id") ON DELETE cascade,
  "branch_id" uuid REFERENCES "branches"("id") ON DELETE set null,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "is_default" boolean DEFAULT false NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "categories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "menu_id" uuid NOT NULL REFERENCES "menus"("id") ON DELETE cascade,
  "restaurant_id" uuid NOT NULL REFERENCES "restaurants"("id") ON DELETE cascade,
  "slug" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "image_url" text,
  "image_key" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "products" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "category_id" uuid NOT NULL REFERENCES "categories"("id") ON DELETE cascade,
  "restaurant_id" uuid NOT NULL REFERENCES "restaurants"("id") ON DELETE cascade,
  "price" numeric(12, 2) NOT NULL,
  "compare_at_price" numeric(12, 2),
  "currency" text DEFAULT 'AMD' NOT NULL,
  "is_available" boolean DEFAULT true NOT NULL,
  "tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "allergens" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "image_url" text,
  "image_key" text,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "product_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE cascade,
  "restaurant_id" uuid NOT NULL REFERENCES "restaurants"("id") ON DELETE cascade,
  "language_code" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "product_translations_unique_idx" ON "product_translations" ("product_id", "language_code");

CREATE TABLE "category_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "category_id" uuid NOT NULL REFERENCES "categories"("id") ON DELETE cascade,
  "restaurant_id" uuid NOT NULL REFERENCES "restaurants"("id") ON DELETE cascade,
  "language_code" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "category_translations_unique_idx" ON "category_translations" ("category_id", "language_code");

CREATE TABLE "qr_codes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "restaurant_id" uuid NOT NULL REFERENCES "restaurants"("id") ON DELETE cascade,
  "permanent_id" text NOT NULL,
  "label" text,
  "type" "qr_code_type" DEFAULT 'restaurant' NOT NULL,
  "target_menu_id" uuid REFERENCES "menus"("id") ON DELETE set null,
  "target_branch_id" uuid REFERENCES "branches"("id") ON DELETE set null,
  "table_label" text,
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "qr_codes_permanent_id_idx" ON "qr_codes" ("permanent_id");

CREATE TABLE "orders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "restaurant_id" uuid NOT NULL REFERENCES "restaurants"("id") ON DELETE cascade,
  "branch_id" uuid REFERENCES "branches"("id") ON DELETE set null,
  "order_number" integer NOT NULL,
  "status" "order_status" DEFAULT 'NEW' NOT NULL,
  "customer_name" text,
  "customer_phone" text,
  "customer_email" text,
  "customer_notes" text,
  "table_label" text,
  "qr_code_id" uuid REFERENCES "qr_codes"("id") ON DELETE set null,
  "subtotal" numeric(12, 2) NOT NULL,
  "tax" numeric(12, 2) DEFAULT '0' NOT NULL,
  "total" numeric(12, 2) NOT NULL,
  "currency" text DEFAULT 'AMD' NOT NULL,
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "order_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_id" uuid NOT NULL REFERENCES "orders"("id") ON DELETE cascade,
  "restaurant_id" uuid NOT NULL REFERENCES "restaurants"("id") ON DELETE cascade,
  "product_id" uuid REFERENCES "products"("id") ON DELETE set null,
  "product_name" text NOT NULL,
  "unit_price" numeric(12, 2) NOT NULL,
  "quantity" integer NOT NULL,
  "notes" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "order_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_id" uuid NOT NULL REFERENCES "orders"("id") ON DELETE cascade,
  "restaurant_id" uuid NOT NULL REFERENCES "restaurants"("id") ON DELETE cascade,
  "status" "order_status" NOT NULL,
  "actor_user_id" uuid,
  "note" text,
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "analytics_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "restaurant_id" uuid NOT NULL REFERENCES "restaurants"("id") ON DELETE cascade,
  "event_type" "analytics_event_type" NOT NULL,
  "session_id" text,
  "path" text,
  "product_id" uuid,
  "qr_code_id" uuid,
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "ip_hash" text,
  "user_agent" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "audit_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "restaurant_id" uuid REFERENCES "restaurants"("id") ON DELETE set null,
  "user_id" uuid REFERENCES "users"("id") ON DELETE set null,
  "action" text NOT NULL,
  "entity_type" text,
  "entity_id" uuid,
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "ip_address" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Tenant isolation indexes
CREATE INDEX "idx_products_restaurant" ON "products" ("restaurant_id");
CREATE INDEX "idx_categories_restaurant" ON "categories" ("restaurant_id");
CREATE INDEX "idx_orders_restaurant" ON "orders" ("restaurant_id");
CREATE INDEX "idx_analytics_restaurant" ON "analytics_events" ("restaurant_id");
CREATE INDEX "idx_audit_restaurant" ON "audit_logs" ("restaurant_id");
