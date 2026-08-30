import { NextResponse } from "next/server";
import { getRestaurantBySlug, getSubscription } from "@/services/restaurant.service";
import { getRestaurantSettings } from "@/services/team.service";
import { isPushAvailableForRestaurant } from "@/services/pwa.service";
import { upsertPushSubscription } from "@/services/push.service";
import { isPushConfigured, getVapidPublicKey } from "@/lib/push/vapid";
import { parseBody, pushSubscribeSchema } from "@/lib/validation/schemas";
import {
  applySecurityHeaders,
  jsonError,
  withRateLimit,
} from "@/lib/security/middleware-helpers";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant || !restaurant.isPublished) {
    return jsonError("Not found", 404);
  }

  const subscription = await getSubscription(restaurant.id);
  const plan = subscription?.plan ?? "FREE";
  const settings = await getRestaurantSettings(restaurant.id);

  if (!isPushAvailableForRestaurant({ plan, settings }) || !isPushConfigured()) {
    return jsonError("Push notifications not available", 403);
  }

  return applySecurityHeaders(
    NextResponse.json({ publicKey: getVapidPublicKey() }),
  );
}

export async function POST(request: Request, context: RouteContext) {
  const rate = await withRateLimit(
    request as unknown as import("next/server").NextRequest,
    "push-subscribe",
    30,
    60_000,
  );
  if (!rate.allowed) return jsonError("Too many requests", 429);

  const { slug } = await context.params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant || !restaurant.isPublished) {
    return jsonError("Not found", 404);
  }

  const subscription = await getSubscription(restaurant.id);
  const plan = subscription?.plan ?? "FREE";
  const settings = await getRestaurantSettings(restaurant.id);

  if (!isPushAvailableForRestaurant({ plan, settings })) {
    return jsonError("Push notifications require PRO", 403);
  }
  if (!isPushConfigured()) {
    return jsonError("Push notifications are not configured", 503);
  }

  const body = await request.json().catch(() => null);
  const parsed = parseBody(pushSubscribeSchema, body);
  if (!parsed.success) return jsonError(parsed.error, 400);

  const userAgent = request.headers.get("user-agent");
  const id = await upsertPushSubscription({
    restaurantId: restaurant.id,
    subscription: parsed.data.subscription,
    userAgent,
  });

  return applySecurityHeaders(NextResponse.json({ id }));
}
