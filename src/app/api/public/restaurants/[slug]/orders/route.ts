import { NextResponse } from "next/server";
import { getRestaurantBySlug, getSubscription } from "@/services/restaurant.service";
import { createOrder } from "@/services/order.service";
import { trackEvent } from "@/services/analytics.service";
import { parseBody, createOrderSchema } from "@/lib/validation/schemas";
import {
  applySecurityHeaders,
  jsonError,
  withRateLimit,
} from "@/lib/security/middleware-helpers";

type RouteContext = { params: Promise<{ slug: string }> };

export async function POST(request: Request, context: RouteContext) {
  const rate = await withRateLimit(
    request as unknown as import("next/server").NextRequest,
    "public-order",
    20,
    60_000,
  );
  if (!rate.allowed) return jsonError("Too many requests", 429);

  const { slug } = await context.params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant || !restaurant.isPublished) {
    return jsonError("Not found", 404);
  }

  const body = await request.json().catch(() => null);
  const parsed = parseBody(createOrderSchema, body);
  if (!parsed.success) return jsonError(parsed.error, 400);

  const subscription = await getSubscription(restaurant.id);
  const plan = subscription?.plan ?? "FREE";

  try {
    const order = await createOrder(restaurant.id, plan, parsed.data);
    await trackEvent(
      restaurant.id,
      { eventType: "order_created", metadata: { orderId: order.id } },
      new Headers(request.headers),
    );
    return applySecurityHeaders(
      NextResponse.json({ order }, { status: 201 }),
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Order failed";
    return jsonError(message, 400);
  }
}
