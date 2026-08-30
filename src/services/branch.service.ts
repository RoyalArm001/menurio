import { eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { insertReturning } from "@/db/write-helpers";
import { branches } from "@/db/schema";
import { assertCapability } from "@/lib/entitlements";
import type { SubscriptionPlan } from "@/lib/entitlements";
import { writeAuditLog } from "@/lib/audit/log";
import { slugify } from "@/lib/utils/slug";

export async function listBranches(restaurantId: string) {
  const db = getDb();
  return db
    .select()
    .from(branches)
    .where(eq(branches.restaurantId, restaurantId));
}

export async function createBranch(
  restaurantId: string,
  userId: string,
  plan: SubscriptionPlan,
  input: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  },
) {
  assertCapability(plan, "MULTI_BRANCH");
  const slug = slugify(input.name) || "branch";

  const branch = await insertReturning(branches, {
    restaurantId,
    slug,
    name: input.name,
    address: input.address,
    phone: input.phone,
    email: input.email,
  });

  await writeAuditLog({
    restaurantId,
    userId,
    action: "branch.created",
    entityType: "branch",
    entityId: branch.id,
  });

  return branch;
}

export async function updateBranch(
  restaurantId: string,
  branchId: string,
  userId: string,
  data: Partial<{
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    isActive: boolean;
    settings: Record<string, unknown>;
  }>,
) {
  const db = getDb();
  await db
    .update(branches)
    .set({ ...data, updatedAt: new Date() })
    .where(
      and(eq(branches.id, branchId), eq(branches.restaurantId, restaurantId)),
    );

  const [updated] = await db
    .select()
    .from(branches)
    .where(
      and(eq(branches.id, branchId), eq(branches.restaurantId, restaurantId)),
    )
    .limit(1);

  if (!updated) throw new Error("Branch not found");

  await writeAuditLog({
    restaurantId,
    userId,
    action: "branch.updated",
    entityType: "branch",
    entityId: branchId,
  });

  return updated;
}
