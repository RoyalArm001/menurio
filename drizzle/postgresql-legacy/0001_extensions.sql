-- WebStile schema extensions migration 0001

CREATE TYPE "public"."order_type" AS ENUM('TABLE', 'PICKUP', 'DELIVERY');
CREATE TYPE "public"."import_job_type" AS ENUM('excel', 'pdf', 'photo');
CREATE TYPE "public"."import_job_status" AS ENUM('pending', 'preview_ready', 'confirmed', 'failed', 'cancelled');
CREATE TYPE "public"."waiter_request_type" AS ENUM('CALL_WAITER', 'REQUEST_BILL');

ALTER TYPE "public"."subscription_status" ADD VALUE IF NOT EXISTS 'expired';
ALTER TYPE "public"."qr_code_type" ADD VALUE IF NOT EXISTS 'promotion';
ALTER TYPE "public"."analytics_event_type" ADD VALUE IF NOT EXISTS 'waiter_call';
ALTER TYPE "public"."analytics_event_type" ADD VALUE IF NOT EXISTS 'bill_request';

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_platform_admin" boolean DEFAULT false NOT NULL;

ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "trial_ends_at" timestamp;
ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DEFAULT 'trialing';

ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "is_featured" boolean DEFAULT false NOT NULL;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "ingredients" jsonb DEFAULT '[]'::jsonb NOT NULL;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "calories" integer;

ALTER TABLE "product_translations" ADD COLUMN IF NOT EXISTS "ingredients" text;

ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "order_type" "order_type" DEFAULT 'TABLE' NOT NULL;

CREATE TABLE IF NOT EXISTS "restaurant_settings" (
  "restaurant_id" uuid PRIMARY KEY REFERENCES "restaurants"("id") ON DELETE cascade,
  "tagline" text,
  "address" text,
  "phone" text,
  "email" text,
  "delivery_enabled" boolean DEFAULT false NOT NULL,
  "pickup_enabled" boolean DEFAULT true NOT NULL,
  "table_ordering_enabled" boolean DEFAULT false NOT NULL,
  "waiter_call_enabled" boolean DEFAULT false NOT NULL,
  "opening_hours" jsonb DEFAULT '[]'::jsonb,
  "social_links" jsonb DEFAULT '{}'::jsonb,
  "seo_title" text,
  "seo_description" text,
  "og_image_url" text,
  "brand_primary_color" text DEFAULT '#D95532',
  "brand_font" text,
  "theme_slug" text DEFAULT 'modern' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "restaurant_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "restaurant_id" uuid NOT NULL REFERENCES "restaurants"("id") ON DELETE cascade,
  "language_code" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "tagline" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "restaurant_translations_unique_idx" ON "restaurant_translations" ("restaurant_id", "language_code");

CREATE TABLE IF NOT EXISTS "uploaded_assets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "restaurant_id" uuid NOT NULL REFERENCES "restaurants"("id") ON DELETE cascade,
  "key" text NOT NULL,
  "url" text NOT NULL,
  "mime_type" text NOT NULL,
  "size_bytes" integer NOT NULL,
  "purpose" text NOT NULL,
  "original_filename" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "import_jobs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "restaurant_id" uuid NOT NULL REFERENCES "restaurants"("id") ON DELETE cascade,
  "type" "import_job_type" NOT NULL,
  "status" "import_job_status" DEFAULT 'pending' NOT NULL,
  "file_asset_id" uuid REFERENCES "uploaded_assets"("id") ON DELETE set null,
  "preview_rows" jsonb DEFAULT '[]'::jsonb,
  "error_message" text,
  "created_by_user_id" uuid,
  "confirmed_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "waiter_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "restaurant_id" uuid NOT NULL REFERENCES "restaurants"("id") ON DELETE cascade,
  "branch_id" uuid REFERENCES "branches"("id") ON DELETE set null,
  "type" "waiter_request_type" NOT NULL,
  "table_label" text,
  "status" text DEFAULT 'NEW' NOT NULL,
  "acknowledged_by_user_id" uuid,
  "acknowledged_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_waiter_requests_restaurant" ON "waiter_requests" ("restaurant_id");
CREATE INDEX IF NOT EXISTS "idx_import_jobs_restaurant" ON "import_jobs" ("restaurant_id");
CREATE INDEX IF NOT EXISTS "idx_uploaded_assets_restaurant" ON "uploaded_assets" ("restaurant_id");
