import { eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { insertReturning, updateReturning } from "@/db/write-helpers";
import {
  restaurantMembers,
  users,
  restaurantSettings,
  restaurantTranslations,
} from "@/db/schema";
import { writeAuditLog } from "@/lib/audit/log";
import { assertCapability, assertLanguageCount } from "@/lib/entitlements";
import type { SubscriptionPlan } from "@/lib/entitlements";

export async function getRestaurantSettings(restaurantId: string) {
  const db = getDb();
  const [settings] = await db
    .select()
    .from(restaurantSettings)
    .where(eq(restaurantSettings.restaurantId, restaurantId))
    .limit(1);
  return settings ?? null;
}

export async function upsertRestaurantSettings(
  restaurantId: string,
  userId: string,
  data: Partial<typeof restaurantSettings.$inferInsert>,
) {
  const db = getDb();
  const [existing] = await db
    .select()
    .from(restaurantSettings)
    .where(eq(restaurantSettings.restaurantId, restaurantId))
    .limit(1);

  if (existing) {
    await db
      .update(restaurantSettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(restaurantSettings.restaurantId, restaurantId));

    const [updated] = await db
      .select()
      .from(restaurantSettings)
      .where(eq(restaurantSettings.restaurantId, restaurantId))
      .limit(1);
    await writeAuditLog({
      restaurantId,
      userId,
      action: "restaurant.settings_updated",
      entityType: "restaurant_settings",
      entityId: restaurantId,
    });
    return updated!;
  }

  await db.insert(restaurantSettings).values({ restaurantId, ...data });

  const [created] = await db
    .select()
    .from(restaurantSettings)
    .where(eq(restaurantSettings.restaurantId, restaurantId))
    .limit(1);
  return created!;
}

export async function listRestaurantTranslations(restaurantId: string) {
  const db = getDb();
  return db
    .select()
    .from(restaurantTranslations)
    .where(eq(restaurantTranslations.restaurantId, restaurantId));
}

export async function upsertRestaurantTranslation(
  restaurantId: string,
  plan: SubscriptionPlan,
  input: {
    languageCode: string;
    name: string;
    description?: string;
    tagline?: string;
  },
) {
  const existing = await listRestaurantTranslations(restaurantId);
  const codes = new Set(existing.map((t) => t.languageCode));
  codes.add(input.languageCode);
  assertLanguageCount(plan, codes.size);

  const existingRow = existing.find(
    (t) => t.languageCode === input.languageCode,
  );

  if (existingRow) {
    return updateReturning(
      restaurantTranslations,
      existingRow.id,
      {
        name: input.name,
        description: input.description,
        tagline: input.tagline,
        updatedAt: new Date(),
      },
    );
  }

  return insertReturning(
    restaurantTranslations,
    { restaurantId, ...input },
  );
}

export async function listMembers(restaurantId: string) {
  const db = getDb();
  return db
    .select({
      id: restaurantMembers.id,
      role: restaurantMembers.role,
      userId: restaurantMembers.userId,
      name: users.name,
      email: users.email,
      acceptedAt: restaurantMembers.acceptedAt,
    })
    .from(restaurantMembers)
    .innerJoin(users, eq(restaurantMembers.userId, users.id))
    .where(eq(restaurantMembers.restaurantId, restaurantId));
}

export async function addMemberByEmail(
  restaurantId: string,
  actorUserId: string,
  email: string,
  role: "ADMIN" | "MANAGER" | "EDITOR" | "ORDER_OPERATOR",
  plan: SubscriptionPlan,
) {
  assertCapability(plan, "MULTI_USER");
  const db = getDb();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    throw new Error("User not found — they must register first");
  }

  const [existingMember] = await db
    .select()
    .from(restaurantMembers)
    .where(
      and(
        eq(restaurantMembers.restaurantId, restaurantId),
        eq(restaurantMembers.userId, user.id),
      ),
    )
    .limit(1);

  if (existingMember) throw new Error("User is already a member");

  const member = await insertReturning(
    restaurantMembers,
    {
      restaurantId,
      userId: user.id,
      role,
      invitedAt: new Date(),
      acceptedAt: new Date(),
    },
  );

  await writeAuditLog({
    restaurantId,
    userId: actorUserId,
    action: "team.member_added",
    entityType: "restaurant_member",
    entityId: member.id,
    metadata: { email, role },
  });

  return member;
}

export async function updateMemberRole(
  restaurantId: string,
  actorUserId: string,
  memberId: string,
  role: "ADMIN" | "MANAGER" | "EDITOR" | "ORDER_OPERATOR",
) {
  const db = getDb();
  await db
    .update(restaurantMembers)
    .set({ role, updatedAt: new Date() })
    .where(
      and(
        eq(restaurantMembers.id, memberId),
        eq(restaurantMembers.restaurantId, restaurantId),
      ),
    );

  const [updated] = await db
    .select()
    .from(restaurantMembers)
    .where(
      and(
        eq(restaurantMembers.id, memberId),
        eq(restaurantMembers.restaurantId, restaurantId),
      ),
    )
    .limit(1);

  if (!updated) throw new Error("Member not found");
  if (updated.role === "OWNER") throw new Error("Cannot change owner role");

  await writeAuditLog({
    restaurantId,
    userId: actorUserId,
    action: "team.role_changed",
    entityType: "restaurant_member",
    entityId: memberId,
    metadata: { role },
  });

  return updated;
}

export async function removeMember(
  restaurantId: string,
  actorUserId: string,
  memberId: string,
) {
  const db = getDb();
  const [existing] = await db
    .select()
    .from(restaurantMembers)
    .where(
      and(
        eq(restaurantMembers.id, memberId),
        eq(restaurantMembers.restaurantId, restaurantId),
      ),
    )
    .limit(1);

  if (!existing) throw new Error("Member not found");
  if (existing.role === "OWNER") throw new Error("Cannot remove owner");

  await db.delete(restaurantMembers).where(eq(restaurantMembers.id, memberId));

  await writeAuditLog({
    restaurantId,
    userId: actorUserId,
    action: "team.member_removed",
    entityType: "restaurant_member",
    entityId: memberId,
  });
}
