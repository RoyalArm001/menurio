import { eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import {
  restaurants,
  restaurantMembers,
  subscriptions,
  restaurantSettings,
  restaurantTranslations,
} from "@/db/schema";
import type { createRestaurantSchema } from "@/lib/validation/schemas";
import type { z } from "zod";
import { writeAuditLog } from "@/lib/audit/log";
import { ensureRestaurantDesign } from "@/services/design.service";
import { createRestaurantInTransaction } from "@/services/registration.service";
import { resolveSlugRedirect } from "@/services/seo.service";
import { updateReturning } from "@/db/write-helpers";

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;

export async function createRestaurant(
  userId: string,
  input: CreateRestaurantInput,
  ipAddress?: string | null,
) {
  const db = getDb();

  const { restaurant, qrPermanentId } = await db.transaction(async (tx) =>
    createRestaurantInTransaction(tx, userId, input),
  );

  await ensureRestaurantDesign(restaurant.id);

  await writeAuditLog({
    restaurantId: restaurant.id,
    userId,
    action: "restaurant.created",
    entityType: "restaurant",
    entityId: restaurant.id,
    ipAddress,
  });

  const branch = await getDefaultBranch(restaurant.id);

  return { restaurant, branch, qrPermanentId };
}

export async function getRestaurantBySlug(slug: string) {
  const db = getDb();
  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.slug, slug))
    .limit(1);
  return restaurant ?? null;
}

export async function resolveRestaurantSlug(slug: string) {
  const restaurant = await getRestaurantBySlug(slug);
  if (restaurant) return { restaurant, redirectedFrom: null as string | null };

  const redirect = await resolveSlugRedirect(slug);
  if (!redirect) return { restaurant: null, redirectedFrom: null };

  const target = await getRestaurantBySlug(redirect.toSlug);
  return { restaurant: target, redirectedFrom: slug };
}

export async function getRestaurantById(id: string) {
  const db = getDb();
  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, id))
    .limit(1);
  return restaurant ?? null;
}

export async function listUserRestaurants(userId: string) {
  const db = getDb();
  return db
    .select({
      restaurant: restaurants,
      role: restaurantMembers.role,
    })
    .from(restaurantMembers)
    .innerJoin(restaurants, eq(restaurantMembers.restaurantId, restaurants.id))
    .where(eq(restaurantMembers.userId, userId));
}

export async function updateRestaurant(
  restaurantId: string,
  data: Partial<{
    name: string;
    description: string | null;
    isPublished: boolean;
    defaultLanguage: string;
    supportedLanguages: string[];
    currency: string;
    timezone: string;
    logoUrl: string | null;
    coverImageUrl: string | null;
    themeId: string | null;
    slug: string;
  }>,
  plan?: import("@/lib/entitlements").SubscriptionPlan,
) {
  if (data.slug) {
    const db = getDb();
    const [current] = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId))
      .limit(1);
    if (current && current.slug !== data.slug && plan) {
      const { recordSlugRedirect } = await import("@/services/seo.service");
      try {
        await recordSlugRedirect(restaurantId, current.slug, data.slug, plan);
      } catch {
        /* PRO+ only — ignore on lower plans */
      }
    }
  }

  return updateReturning(restaurants, restaurantId, {
    ...data,
    updatedAt: new Date(),
  });
}

export async function getSubscription(restaurantId: string) {
  const db = getDb();
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.restaurantId, restaurantId))
    .limit(1);
  return sub ?? null;
}

export async function getRestaurantPublicProfile(slug: string) {
  const db = getDb();
  const { restaurant } = await resolveRestaurantSlug(slug);
  if (!restaurant) return null;

  const [settings] = await db
    .select()
    .from(restaurantSettings)
    .where(eq(restaurantSettings.restaurantId, restaurant.id))
    .limit(1);

  const translations = await db
    .select()
    .from(restaurantTranslations)
    .where(eq(restaurantTranslations.restaurantId, restaurant.id));

  const subscription = await getSubscription(restaurant.id);

  return { restaurant, settings, translations, subscription };
}

export async function getDefaultBranch(restaurantId: string) {
  const db = getDb();
  const { branches } = await import("@/db/schema");
  const [branch] = await db
    .select()
    .from(branches)
    .where(
      and(
        eq(branches.restaurantId, restaurantId),
        eq(branches.isDefault, true),
      ),
    )
    .limit(1);
  return branch ?? null;
}
