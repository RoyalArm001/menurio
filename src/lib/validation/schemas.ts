import { z } from "zod";

function canonicalLanguageTag(value: string): string | null {
  try {
    return Intl.getCanonicalLocales(value)[0] ?? null;
  } catch {
    return null;
  }
}

function isIsoCurrencyCode(value: string): boolean {
  try {
    new Intl.NumberFormat("en", { style: "currency", currency: value });
    return true;
  } catch {
    return false;
  }
}

function isIanaTimeZone(value: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export const slugSchema = z
  .string()
  .min(2)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

export const languageCodeSchema = z
  .string()
  .trim()
  .min(2)
  .max(35)
  .refine((value) => canonicalLanguageTag(value) !== null, "Invalid BCP 47 language tag")
  .transform((value) => canonicalLanguageTag(value) ?? value);

const currencySchema = z
  .string()
  .trim()
  .length(3)
  .transform((value) => value.toUpperCase())
  .refine(isIsoCurrencyCode, "Invalid ISO 4217 currency code");

const timeZoneSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .refine(isIanaTimeZone, "Invalid IANA time zone");

export const createRestaurantSchema = z.object({
  name: z.string().min(2).max(120),
  slug: slugSchema.optional(),
  description: z.string().max(2000).optional(),
  defaultLanguage: languageCodeSchema.default("en"),
  supportedLanguages: z.array(languageCodeSchema).min(1).optional(),
  currency: currencySchema.default("AMD"),
  timezone: timeZoneSchema.default("Asia/Yerevan"),
  address: z.string().max(500).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().max(254).optional(),
  instagram: z.string().max(100).optional(),
  brandPrimaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
});

export const updateRestaurantSchema = createRestaurantSchema.partial().extend({
  isPublished: z.boolean().optional(),
  logoUrl: z.string().url().nullable().optional(),
  coverImageUrl: z.string().url().nullable().optional(),
  supportedLanguages: z.array(languageCodeSchema).optional(),
});

export const createMenuSchema = z.object({
  name: z.string().min(1).max(120),
  slug: slugSchema.optional(),
  branchId: z.string().uuid().optional(),
  isDefault: z.boolean().optional(),
});

export const createCategorySchema = z.object({
  menuId: z.string().uuid(),
  slug: slugSchema.optional(),
  sortOrder: z.number().int().min(0).optional(),
  translations: z
    .array(
      z.object({
        languageCode: languageCodeSchema,
        name: z.string().min(1).max(200),
        description: z.string().max(2000).optional(),
      }),
    )
    .min(1),
});

export const createProductSchema = z.object({
  categoryId: z.string().uuid(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  compareAtPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional(),
  currency: currencySchema.optional(),
  isAvailable: z.boolean().optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  allergens: z.array(z.string().max(50)).max(20).optional(),
  sortOrder: z.number().int().min(0).optional(),
  translations: z
    .array(
      z.object({
        languageCode: languageCodeSchema,
        name: z.string().min(1).max(200),
        description: z.string().max(5000).optional(),
      }),
    )
    .min(1),
});

export const createOrderSchema = z.object({
  branchId: z.string().uuid().optional(),
  orderType: z.enum(["TABLE", "PICKUP", "DELIVERY"]).default("TABLE"),
  customerName: z.string().max(120).optional(),
  customerPhone: z.string().max(30).optional(),
  customerEmail: z.string().email().optional(),
  customerNotes: z.string().max(1000).optional(),
  tableLabel: z.string().max(50).optional(),
  qrCodeId: z.string().uuid().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1).max(99),
        notes: z.string().max(500).optional(),
      }),
    )
    .min(1),
});

export const updateProductSchema = createProductSchema.partial().extend({
  categoryId: z.string().uuid().optional(),
  isFeatured: z.boolean().optional(),
  ingredients: z.array(z.string()).optional(),
  calories: z.number().int().min(0).optional(),
  imageUrl: z.string().url().optional().nullable(),
  imageKey: z.string().optional().nullable(),
});

export const updateSettingsSchema = z.object({
  tagline: z.string().max(200).optional(),
  address: z.string().max(500).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional(),
  deliveryEnabled: z.boolean().optional(),
  pickupEnabled: z.boolean().optional(),
  tableOrderingEnabled: z.boolean().optional(),
  waiterCallEnabled: z.boolean().optional(),
  openingHours: z
    .array(z.object({ days: z.string(), time: z.string() }))
    .optional(),
  socialLinks: z
    .object({
      instagram: z.string().optional(),
      facebook: z.string().optional(),
    })
    .optional(),
  seoTitle: z.string().max(120).optional(),
  seoDescription: z.string().max(300).optional(),
  ogImageUrl: z.string().url().optional().nullable(),
  brandPrimaryColor: z.string().optional(),
  themeSlug: z.string().optional(),
  pwaEnabled: z.boolean().optional(),
  pwaDisplayName: z.string().max(120).optional().nullable(),
  pwaIconUrl: z.string().url().optional().nullable(),
  pushNotificationsEnabled: z.boolean().optional(),
});

export const pushSubscribeSchema = z.object({
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string().min(1),
      auth: z.string().min(1),
    }),
  }),
});

export const createNotificationCampaignSchema = z.object({
  title: z.string().min(1).max(120),
  message: z.string().min(1).max(500),
  imageUrl: z.string().url().optional().nullable(),
  targetUrl: z.string().max(500).optional(),
  sendNow: z.boolean().optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
});

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/)
  .nullable();

export const updateDesignSchema = z
  .object({
    themeId: z.enum(["modern", "elegant", "minimal", "dark-premium"]),
    logoAssetId: z.string().uuid().nullable(),
    coverAssetId: z.string().uuid().nullable(),
    faviconAssetId: z.string().uuid().nullable(),
    primaryColor: hexColor,
    secondaryColor: hexColor,
    accentColor: hexColor,
    backgroundColor: hexColor,
    textColor: hexColor,
    headingFont: z.enum(["display", "sans", "serif"]).nullable(),
    bodyFont: z.enum(["display", "sans", "serif"]).nullable(),
    buttonStyle: z.enum(["rounded", "pill", "square"]).nullable(),
    cardStyle: z.enum(["elevated", "flat", "outlined", "compact"]).nullable(),
    navigationStyle: z.enum(["sticky", "solid", "transparent", "minimal"]).nullable(),
    menuLayout: z.enum(["cards", "list", "grid", "editorial"]).nullable(),
    imageStyle: z.enum(["cover", "rounded", "contain", "square"]).nullable(),
    footerStyle: z.enum(["simple", "branded", "minimal"]).nullable(),
    customCss: z.string().max(8000).nullable(),
    customCssEnabled: z.boolean(),
    whiteLabelEnabled: z.boolean(),
  })
  .partial();

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "NEW",
    "ACCEPTED",
    "PREPARING",
    "READY",
    "COMPLETED",
    "REJECTED",
    "CANCELLED",
  ]),
  note: z.string().max(500).optional(),
});

export const analyticsEventSchema = z.object({
  eventType: z.enum([
    "restaurant_page_view",
    "menu_view",
    "qr_scan",
    "product_view",
    "add_to_cart",
    "order_created",
    "waiter_call",
    "bill_request",
  ]),
  sessionId: z.string().max(64).optional(),
  path: z.string().max(500).optional(),
  productId: z.string().uuid().optional(),
  qrCodeId: z.string().uuid().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const presignedUploadSchema = z.object({
  restaurantId: z.string().uuid(),
  filename: z.string().min(1).max(255),
  contentType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/x-icon",
    "image/vnd.microsoft.icon",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "application/pdf",
  ]),
  purpose: z.enum([
    "product",
    "category",
    "logo",
    "cover",
    "gallery",
    "favicon",
    "design",
    "import",
  ]),
  sizeBytes: z.number().int().positive().max(20 * 1024 * 1024),
});

export const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
  restaurantName: z.string().min(2).max(120),
});

export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
});

export const updateSeoSettingsSchema = z.object({
  indexable: z.boolean().optional(),
  defaultOgImage: z.string().url().optional().nullable(),
  analyticsMeasurementId: z
    .string()
    .regex(/^G-[A-Z0-9-]{4,30}$/i, "Invalid Google Analytics measurement ID")
    .optional()
    .nullable(),
  googleSiteVerification: z.string().max(128).optional().nullable(),
  translations: z
    .array(
      z.object({
        languageCode: languageCodeSchema,
        title: z.string().max(120).optional().nullable(),
        description: z.string().max(300).optional().nullable(),
        ogTitle: z.string().max(120).optional().nullable(),
        ogDescription: z.string().max(300).optional().nullable(),
        ogImage: z.string().url().optional().nullable(),
      }),
    )
    .optional(),
});

export function parseBody<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues.map((i) => i.message).join("; "),
    };
  }
  return { success: true, data: result.data };
}
