-- Tenant-specific restaurant branding and design configuration

CREATE TABLE IF NOT EXISTS "restaurant_designs" (
  "restaurant_id" uuid PRIMARY KEY REFERENCES "restaurants"("id") ON DELETE cascade,
  "theme_id" text DEFAULT 'modern' NOT NULL,
  "logo_asset_id" uuid REFERENCES "uploaded_assets"("id") ON DELETE set null,
  "cover_asset_id" uuid REFERENCES "uploaded_assets"("id") ON DELETE set null,
  "favicon_asset_id" uuid REFERENCES "uploaded_assets"("id") ON DELETE set null,
  "primary_color" text,
  "secondary_color" text,
  "accent_color" text,
  "background_color" text,
  "text_color" text,
  "heading_font" text,
  "body_font" text,
  "button_style" text,
  "card_style" text,
  "navigation_style" text,
  "menu_layout" text,
  "image_style" text,
  "footer_style" text,
  "custom_css" text,
  "custom_css_enabled" boolean DEFAULT false NOT NULL,
  "white_label_enabled" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

INSERT INTO "restaurant_designs" (
  "restaurant_id",
  "theme_id",
  "primary_color",
  "created_at",
  "updated_at"
)
SELECT
  r."id",
  COALESCE(s."theme_slug", 'modern'),
  s."brand_primary_color",
  now(),
  now()
FROM "restaurants" r
LEFT JOIN "restaurant_settings" s ON s."restaurant_id" = r."id"
ON CONFLICT ("restaurant_id") DO NOTHING;
