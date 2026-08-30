import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import { parseBody, updateDesignSchema } from "@/lib/validation/schemas";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";
import { EntitlementError } from "@/lib/entitlements";
import { getEntitlements } from "@/lib/entitlements";
import { AuthorizationError } from "@/lib/auth/permissions";
import { getSubscription } from "@/services/restaurant.service";
import {
  ensureRestaurantDesign,
  resolveTenantDesign,
  updateRestaurantDesign,
} from "@/services/design.service";
import { UnsafeCssError } from "@/lib/security/sanitize-css";

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

  const subscription = await getSubscription(id);
  const plan = subscription?.plan ?? "FREE";
  const [row, resolved] = await Promise.all([
    ensureRestaurantDesign(id),
    resolveTenantDesign(id, plan),
  ]);

  return applySecurityHeaders(
    NextResponse.json({
      design: row,
      resolved,
      plan,
      entitlements: getEntitlements(plan),
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
  const parsed = parseBody(updateDesignSchema, body);
  if (!parsed.success) return jsonError(parsed.error, 400);

  const subscription = await getSubscription(id);
  const plan = subscription?.plan ?? "FREE";

  try {
    const design = await updateRestaurantDesign({
      restaurantId: id,
      actorUserId: authResult.userId,
      actorRestaurantId: access.ctx.restaurantId,
      plan,
      patch: parsed.data,
    });
    const resolved = await resolveTenantDesign(id, plan);
    return applySecurityHeaders(NextResponse.json({ design, resolved }));
  } catch (err) {
    if (err instanceof EntitlementError) {
      return jsonError(err.message, 403);
    }
    if (err instanceof AuthorizationError) {
      return jsonError(err.message, 403);
    }
    if (err instanceof UnsafeCssError) {
      return jsonError(err.message, 400);
    }
    return jsonError(err instanceof Error ? err.message : "Save failed", 400);
  }
}
