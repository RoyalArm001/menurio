import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import { verifyDomain } from "@/services/domain.service";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";

type RouteContext = { params: Promise<{ id: string; domainId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { id, domainId } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "restaurant:update",
  );
  if ("error" in access) return access.error;

  try {
    const domain = await verifyDomain(domainId, id);
    return applySecurityHeaders(NextResponse.json({ domain }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Verification failed";
    return jsonError(message, 400);
  }
}
