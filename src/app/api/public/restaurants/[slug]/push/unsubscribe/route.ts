import { NextResponse } from "next/server";
import { getRestaurantBySlug } from "@/services/restaurant.service";
import { deactivatePushSubscription } from "@/services/push.service";
import { parseBody, pushSubscribeSchema } from "@/lib/validation/schemas";
import {
  applySecurityHeaders,
  jsonError,
  withRateLimit,
} from "@/lib/security/middleware-helpers";

type RouteContext = { params: Promise<{ slug: string }> };

export async function POST(request: Request, context: RouteContext) {
  const rate = await withRateLimit(
    request as unknown as import("next/server").NextRequest,
    "push-unsubscribe",
    30,
    60_000,
  );
  if (!rate.allowed) return jsonError("Too many requests", 429);

  const { slug } = await context.params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant || !restaurant.isPublished) {
    return jsonError("Not found", 404);
  }

  const body = await request.json().catch(() => null);
  const parsed = parseBody(pushSubscribeSchema, body);
  if (!parsed.success) return jsonError(parsed.error, 400);

  await deactivatePushSubscription(
    restaurant.id,
    parsed.data.subscription.endpoint,
  );
  return applySecurityHeaders(NextResponse.json({ ok: true }));
}
