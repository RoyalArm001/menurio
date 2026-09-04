import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPlatformAdmin } from "@/lib/auth/platform-admin";
import { deleteRestaurantById, getRestaurantById } from "@/services/restaurant.service";
import { writeAuditLog } from "@/lib/audit/log";
import { jsonError, applySecurityHeaders } from "@/lib/security/middleware-helpers";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);

  const ok = await isPlatformAdmin(session.user.id);
  if (!ok) return jsonError("Forbidden", 403);

  const { id: restaurantId } = await context.params;

  const existing = await getRestaurantById(restaurantId);
  if (!existing) {
    return jsonError("Restaurant not found", 404);
  }

  await deleteRestaurantById(restaurantId);

  await writeAuditLog({
    restaurantId,
    userId: session.user.id,
    action: "admin.restaurant.deleted",
    entityType: "restaurant",
    entityId: restaurantId,
    metadata: {
      deletedRestaurantName: existing.name,
      deletedRestaurantSlug: existing.slug,
    },
  });

  return applySecurityHeaders(
    NextResponse.json({
      success: true,
      message: `Restaurant ${existing.name} deleted successfully`,
    }),
  );
}
