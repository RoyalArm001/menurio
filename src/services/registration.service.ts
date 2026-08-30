import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type { MySql2Database } from "drizzle-orm/mysql2";
import { getDb } from "@/db";
import * as schema from "@/db/schema";
import {
  restaurants,
  branches,
  restaurantMembers,
  subscriptions,
  qrCodes,
  menus,
  restaurantSettings,
  restaurantTranslations,
  restaurantSeoSettings,
} from "@/db/schema";
import { users } from "@/db/schema/users";
import { generateUniqueSlug } from "@/lib/utils/slug";
import { nanoid } from "nanoid";
import { hashPassword, validatePasswordStrength } from "@/lib/auth/password";
import { normalizeEmail, findUserByEmail } from "@/services/user.service";
import type { CreateRestaurantInput } from "@/services/restaurant.service";
import { ensureRestaurantDesign } from "@/services/design.service";
import { writeAuditLog } from "@/lib/audit/log";

export class RegistrationError extends Error {
  constructor(
    public readonly code: "EMAIL_TAKEN" | "INVALID_INPUT" | "SLUG_TAKEN",
    message: string,
  ) {
    super(message);
    this.name = "RegistrationError";
  }
}

type DbClient = MySql2Database<typeof schema>;

async function insertRestaurantBundle(
  tx: DbClient,
  userId: string,
  input: CreateRestaurantInput,
) {
  const slug = input.slug
    ? input.slug
    : await generateUniqueSlug(input.name);

  const [existing] = await tx
    .select({ id: restaurants.id })
    .from(restaurants)
    .where(eq(restaurants.slug, slug))
    .limit(1);

  if (existing) {
    throw new RegistrationError("SLUG_TAKEN", "Slug already taken");
  }

  const supportedLanguages =
    input.supportedLanguages?.length
      ? input.supportedLanguages
      : [input.defaultLanguage ?? "en"];

  const restaurantId = randomUUID();
  const now = new Date();

  await tx.insert(restaurants).values({
    id: restaurantId,
    name: input.name,
    slug,
    description: input.description ?? null,
    defaultLanguage: input.defaultLanguage ?? "en",
    supportedLanguages,
    currency: input.currency ?? "AMD",
    timezone: input.timezone ?? "Asia/Yerevan",
    ownerUserId: userId,
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  });

  const [restaurant] = await tx
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, restaurantId))
    .limit(1);

  await tx.insert(restaurantMembers).values({
    restaurantId,
    userId,
    role: "OWNER",
    acceptedAt: now,
  });

  await tx.insert(subscriptions).values({
    restaurantId,
    plan: "FREE",
    status: "trialing",
    trialEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    currentPeriodStart: now,
  });

  const branchId = randomUUID();
  await tx.insert(branches).values({
    id: branchId,
    restaurantId,
    slug: "main",
    name: "Main",
    isDefault: true,
    address: input.address ?? null,
    phone: input.phone ?? null,
    email: input.email ?? null,
    createdAt: now,
    updatedAt: now,
  });

  await tx.insert(menus).values({
    id: randomUUID(),
    restaurantId,
    branchId,
    name: "Main Menu",
    slug: "main-menu",
    isDefault: true,
    createdAt: now,
    updatedAt: now,
  });

  await tx.insert(restaurantSettings).values({
    restaurantId,
    address: input.address ?? null,
    phone: input.phone ?? null,
    email: input.email ?? null,
    socialLinks: input.instagram ? { instagram: input.instagram } : {},
    brandPrimaryColor: input.brandPrimaryColor ?? "#D95532",
    themeSlug: "modern",
    pickupEnabled: true,
  });

  await tx.insert(restaurantTranslations).values({
    id: randomUUID(),
    restaurantId,
    languageCode: input.defaultLanguage ?? "en",
    name: input.name,
    description: input.description ?? null,
  });

  await tx.insert(restaurantSeoSettings).values({
    restaurantId,
    indexable: true,
  });

  const permanentId = nanoid(21);
  await tx.insert(qrCodes).values({
    id: randomUUID(),
    restaurantId,
    permanentId,
    type: "restaurant",
    label: "Main QR",
    createdAt: now,
    updatedAt: now,
  });

  return { restaurant: restaurant!, qrPermanentId: permanentId };
}

export async function registerUserWithRestaurant(input: {
  name: string;
  email: string;
  password: string;
  restaurantName: string;
}) {
  const name = input.name.trim();
  const restaurantName = input.restaurantName.trim();
  const email = normalizeEmail(input.email);

  if (!name || !restaurantName || !email) {
    throw new RegistrationError("INVALID_INPUT", "All fields are required");
  }

  const passwordError = validatePasswordStrength(input.password);
  if (passwordError) {
    throw new RegistrationError("INVALID_INPUT", passwordError);
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new RegistrationError("EMAIL_TAKEN", "An account with this email already exists");
  }

  const passwordHash = await hashPassword(input.password);
  const db = getDb();

  const result = await db.transaction(async (tx) => {
    const userId = randomUUID();
    const now = new Date();

    await tx.insert(users).values({
      id: userId,
      name,
      email,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    });

    const [user] = await tx
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) throw new Error("User insert failed");

    const bundle = await insertRestaurantBundle(tx, userId, {
      name: restaurantName,
      defaultLanguage: "en",
      supportedLanguages: ["en"],
      currency: "AMD",
      timezone: "Asia/Yerevan",
    });

    return { user, restaurant: bundle.restaurant, qrPermanentId: bundle.qrPermanentId };
  });

  await ensureRestaurantDesign(result.restaurant.id);

  await writeAuditLog({
    restaurantId: result.restaurant.id,
    userId: result.user.id,
    action: "user.registered",
    entityType: "user",
    entityId: result.user.id,
  });

  await writeAuditLog({
    restaurantId: result.restaurant.id,
    userId: result.user.id,
    action: "restaurant.created",
    entityType: "restaurant",
    entityId: result.restaurant.id,
  });

  return result;
}

export async function createRestaurantInTransaction(
  tx: DbClient,
  userId: string,
  input: CreateRestaurantInput,
) {
  return insertRestaurantBundle(tx, userId, input);
}
