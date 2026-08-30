import { NextResponse } from "next/server";
import { parseBody, analyticsEventSchema } from "@/lib/validation/schemas";
import { trackEvent } from "@/services/analytics.service";
import { getRestaurantById } from "@/services/restaurant.service";
import {
  applySecurityHeaders,
  jsonError,
  withRateLimit,
} from "@/lib/security/middleware-helpers";

export async function POST(request: Request) {
  const rate = await withRateLimit(
    request as unknown as import("next/server").NextRequest,
    "analytics",
    100,
    60_000,
  );
  if (!rate.allowed) return jsonError("Too many requests", 429);

  const body = await request.json().catch(() => null);
  const parsed = parseBody(analyticsEventSchema, body);
  if (!parsed.success) return jsonError(parsed.error, 400);

  const restaurantId = body.restaurantId as string | undefined;
  if (!restaurantId) return jsonError("restaurantId required", 400);

  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) return jsonError("Not found", 404);

  try {
    await trackEvent(restaurantId, parsed.data, new Headers(request.headers));
  } catch {
    return jsonError("Invalid analytics event", 400);
  }
  return applySecurityHeaders(NextResponse.json({ ok: true }));
}
