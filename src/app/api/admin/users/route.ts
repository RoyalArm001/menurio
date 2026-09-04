import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPlatformAdmin } from "@/lib/auth/platform-admin";
import { listAllUsersWithRestaurants } from "@/services/user.service";
import { jsonError, applySecurityHeaders } from "@/lib/security/middleware-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);

  const ok = await isPlatformAdmin(session.user.id);
  if (!ok) return jsonError("Forbidden", 403);

  const usersList = await listAllUsersWithRestaurants();
  return applySecurityHeaders(NextResponse.json({ users: usersList }));
}
