import { auth } from "@/lib/auth";
import { requireMembership } from "@/lib/tenant/context";
import { assertPermission, type Permission } from "@/lib/auth/permissions";
import { jsonError } from "@/lib/security/middleware-helpers";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: jsonError("Unauthorized", 401) } as const;
  }
  return { session, userId: session.user.id } as const;
}

export async function requireRestaurantAccess(
  userId: string,
  restaurantId: string,
  permission: Permission,
) {
  try {
    const ctx = await requireMembership(userId, restaurantId);
    assertPermission(ctx.role, permission);
    return { ctx } as const;
  } catch {
    return { error: jsonError("Forbidden", 403) } as const;
  }
}
