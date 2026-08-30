import { NextResponse } from "next/server";
import { getRestaurantBySlug, getSubscription } from "@/services/restaurant.service";
import { createWaiterRequest } from "@/services/waiter.service";
import {
  applySecurityHeaders,
  jsonError,
  withRateLimit,
} from "@/lib/security/middleware-helpers";
import { z } from "zod";

const waiterSchema = z.object({
  type: z.enum(["CALL_WAITER", "REQUEST_BILL"]),
  tableLabel: z.string().max(50).optional(),
});

type RouteContext = { params: Promise<{ slug: string }> };

export async function POST(request: Request, context: RouteContext) {
  const rate = await withRateLimit(
    request as unknown as import("next/server").NextRequest,
    "public-waiter",
    10,
    60_000,
  );
  if (!rate.allowed) return jsonError("Too many requests", 429);

  const { slug } = await context.params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant || !restaurant.isPublished) {
    return jsonError("Not found", 404);
  }

  const body = await request.json().catch(() => null);
  const parsed = waiterSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.message, 400);

  const subscription = await getSubscription(restaurant.id);
  const plan = subscription?.plan ?? "FREE";

  try {
    const req = await createWaiterRequest(
      restaurant.id,
      plan,
      parsed.data,
      new Headers(request.headers),
    );
    return applySecurityHeaders(
      NextResponse.json({ request: req }, { status: 201 }),
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Request failed";
    return jsonError(message, 400);
  }
}
