import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import {
  getRestaurantById,
  updateRestaurant,
  getSubscription,
} from "@/services/restaurant.service";
import { getEntitlements } from "@/lib/entitlements";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";
import { parseBody, updateRestaurantSchema } from "@/lib/validation/schemas";

type RouteContext = { params: Promise<{ id: string }> };

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

  const restaurant = await getRestaurantById(id);
  if (!restaurant) return jsonError("Not found", 404);

  const subscription = await getSubscription(id);

  return applySecurityHeaders(
    NextResponse.json({
      restaurant,
      subscription,
      entitlements: subscription
        ? getEntitlements(subscription.plan)
        : getEntitlements("FREE"),
    }),
  );
}

export async function PATCH(request: Request, context: RouteContext) {
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
  const parsed = parseBody(updateRestaurantSchema, body);
  if (!parsed.success) return jsonError(parsed.error, 400);

  const subscription = await getSubscription(id);
  const plan = subscription?.plan ?? "FREE";
  const updated = await updateRestaurant(id, parsed.data, plan);
  return applySecurityHeaders(NextResponse.json({ restaurant: updated }));
}
