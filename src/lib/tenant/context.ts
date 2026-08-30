import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { restaurantMembers } from "@/db/schema";
import type { MemberRole } from "@/lib/auth/permissions";
import { AuthorizationError } from "@/lib/auth/permissions";

export interface TenantContext {
  restaurantId: string;
  userId: string;
  role: MemberRole;
}

export async function getMembership(
  userId: string,
  restaurantId: string,
): Promise<TenantContext | null> {
  const [member] = await db
    .select()
    .from(restaurantMembers)
    .where(
      and(
        eq(restaurantMembers.userId, userId),
        eq(restaurantMembers.restaurantId, restaurantId),
      ),
    )
    .limit(1);

  if (!member) return null;

  return {
    restaurantId: member.restaurantId,
    userId: member.userId,
    role: member.role,
  };
}

export async function requireMembership(
  userId: string,
  restaurantId: string,
): Promise<TenantContext> {
  const ctx = await getMembership(userId, restaurantId);
  if (!ctx) {
    throw new AuthorizationError("Not a member of this restaurant");
  }
  return ctx;
}

/** Ensures a resource belongs to the tenant before access */
export function assertTenantScope(
  resourceRestaurantId: string,
  tenantRestaurantId: string,
): void {
  if (resourceRestaurantId !== tenantRestaurantId) {
    throw new AuthorizationError("Tenant isolation violation");
  }
}
