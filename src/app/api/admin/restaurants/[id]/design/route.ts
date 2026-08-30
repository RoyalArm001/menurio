import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPlatformAdmin } from "@/lib/auth/platform-admin";
import { getDesignAdminView } from "@/services/design.service";
import { jsonError, applySecurityHeaders } from "@/lib/security/middleware-helpers";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);
  if (!(await isPlatformAdmin(session.user.id))) {
    return jsonError("Forbidden", 403);
  }

  const { id } = await context.params;
  const view = await getDesignAdminView(id);
  return applySecurityHeaders(NextResponse.json({ inspection: view }));
}
