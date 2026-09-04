import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPlatformAdmin } from "@/lib/auth/platform-admin";
import { deleteUserAndData, findUserById } from "@/services/user.service";
import { writeAuditLog } from "@/lib/audit/log";
import { jsonError, applySecurityHeaders } from "@/lib/security/middleware-helpers";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);

  const ok = await isPlatformAdmin(session.user.id);
  if (!ok) return jsonError("Forbidden", 403);

  const { id: targetUserId } = await context.params;

  if (targetUserId === session.user.id) {
    return jsonError("Cannot delete your own admin account", 400);
  }

  const existing = await findUserById(targetUserId);
  if (!existing) {
    return jsonError("User not found", 404);
  }

  await deleteUserAndData(targetUserId);

  await writeAuditLog({
    userId: session.user.id,
    action: "admin.user.deleted",
    entityType: "user",
    entityId: targetUserId,
    metadata: {
      deletedUserEmail: existing.email,
      deletedUserName: existing.name,
    },
  });

  return applySecurityHeaders(
    NextResponse.json({
      success: true,
      message: `User ${existing.email} and all associated data deleted successfully`,
    }),
  );
}
