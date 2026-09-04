import { eq, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { createId } from "@/db/write-helpers";
import { hashPassword } from "@/lib/auth/password";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function findUserByEmail(email: string) {
  const db = getDb();
  const normalized = normalizeEmail(email);
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalized))
    .limit(1);
  return user ?? null;
}

export async function findUserById(id: string) {
  const db = getDb();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return user ?? null;
}

export async function createUserWithPassword(input: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  const db = getDb();
  const id = createId();
  const now = new Date();
  await db.insert(users).values({
    id,
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    passwordHash: input.passwordHash,
    createdAt: now,
    updatedAt: now,
  });
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user) throw new Error("Failed to create user");
  return user;
}

export async function setUserPassword(userId: string, plainPassword: string) {
  const db = getDb();
  const passwordHash = await hashPassword(plainPassword);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

export async function listAllUsersWithRestaurants() {
  const db = getDb();
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      isPlatformAdmin: users.isPlatformAdmin,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  if (allUsers.length === 0) return [];

  const { restaurants, restaurantMembers } = await import("@/db/schema");
  const { inArray } = await import("drizzle-orm");

  const userIds = allUsers.map((u) => u.id);

  const memberships = await db
    .select({
      userId: restaurantMembers.userId,
      role: restaurantMembers.role,
      restaurantId: restaurants.id,
      name: restaurants.name,
      slug: restaurants.slug,
      isPublished: restaurants.isPublished,
      ownerUserId: restaurants.ownerUserId,
      createdAt: restaurants.createdAt,
    })
    .from(restaurantMembers)
    .innerJoin(restaurants, eq(restaurantMembers.restaurantId, restaurants.id))
    .where(inArray(restaurantMembers.userId, userIds));

  const restaurantMap = new Map<
    string,
    Array<{
      id: string;
      name: string;
      slug: string;
      role: string;
      isOwner: boolean;
      isPublished: boolean;
      createdAt: Date;
    }>
  >();

  for (const m of memberships) {
    const list = restaurantMap.get(m.userId) ?? [];
    list.push({
      id: m.restaurantId,
      name: m.name,
      slug: m.slug,
      role: m.role,
      isOwner: m.ownerUserId === m.userId,
      isPublished: m.isPublished,
      createdAt: m.createdAt,
    });
    restaurantMap.set(m.userId, list);
  }

  return allUsers.map((user) => ({
    ...user,
    restaurants: restaurantMap.get(user.id) ?? [],
  }));
}

export async function deleteUserAndData(userId: string) {
  const db = getDb();
  const { restaurants, restaurantMembers } = await import("@/db/schema");

  return db.transaction(async (tx) => {
    // 1. Find all restaurants where this user is the owner
    const ownedRestaurants = await tx
      .select({ id: restaurants.id })
      .from(restaurants)
      .where(eq(restaurants.ownerUserId, userId));

    // 2. Delete all owned restaurants (cascades to branches, menus, orders, settings, etc.)
    for (const r of ownedRestaurants) {
      await tx.delete(restaurants).where(eq(restaurants.id, r.id));
    }

    // 3. Delete any remaining restaurant memberships for this user
    await tx.delete(restaurantMembers).where(eq(restaurantMembers.userId, userId));

    // 4. Delete the user
    await tx.delete(users).where(eq(users.id, userId));
    return { success: true };
  });
}

