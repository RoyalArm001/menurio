import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPlatformAdmin } from "@/lib/auth/platform-admin";
import { rejectPlanRequest } from "@/services/subscription.service";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);

  const ok = await isPlatformAdmin(session.user.id);
  if (!ok) return jsonError("Forbidden", 403);

  const { id: requestId } = await context.params;

  try {
    const result = await rejectPlanRequest(requestId, session.user.id);
    return applySecurityHeaders(
      NextResponse.json({
        message: "Plan request rejected",
        ...result,
      }),
    );
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : "Failed to reject plan", 400);
  }
}
