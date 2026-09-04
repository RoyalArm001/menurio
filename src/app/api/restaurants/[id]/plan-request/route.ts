import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import {
  createPlanRequest,
  getRestaurantPendingPlanRequest,
} from "@/services/subscription.service";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";
import type { SubscriptionPlan } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

const VALID_PLANS: SubscriptionPlan[] = ["FREE", "START", "PRO", "PRO_PLUS"];

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "restaurant:read",
  );
  if ("error" in access) return access.error;

  const pending = await getRestaurantPendingPlanRequest(id);
  return applySecurityHeaders(NextResponse.json({ pendingRequest: pending }));
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "restaurant:update",
  );
  if ("error" in access) return access.error;

  const body = await request.json().catch(() => null);
  const requestedPlan = String(body?.requestedPlan ?? "").toUpperCase() as SubscriptionPlan;
  const contactPhone = typeof body?.contactPhone === "string" ? body.contactPhone.trim() : undefined;
  const notes = typeof body?.notes === "string" ? body.notes.trim() : undefined;

  if (!VALID_PLANS.includes(requestedPlan)) {
    return jsonError("Invalid plan requested", 400);
  }

  const result = await createPlanRequest({
    restaurantId: id,
    userId: authResult.userId,
    requestedPlan,
    contactPhone,
    notes,
  });

  return applySecurityHeaders(
    NextResponse.json({
      success: true,
      request: result,
      message: "Plan upgrade request submitted successfully",
    }),
  );
}
