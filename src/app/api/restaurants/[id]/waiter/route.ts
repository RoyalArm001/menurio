import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import {
  listWaiterRequests,
  acknowledgeWaiterRequest,
} from "@/services/waiter.service";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "order:read",
  );
  if ("error" in access) return access.error;

  const requests = await listWaiterRequests(id);
  return applySecurityHeaders(NextResponse.json({ requests }));
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "order:update",
  );
  if ("error" in access) return access.error;

  const body = await request.json().catch(() => null);
  if (!body.requestId) return jsonError("requestId required", 400);

  try {
    const updated = await acknowledgeWaiterRequest(
      id,
      body.requestId,
      authResult.userId,
    );
    return applySecurityHeaders(NextResponse.json({ request: updated }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return jsonError(message, 400);
  }
}
