import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/guards";
import { parseBody, createRestaurantSchema } from "@/lib/validation/schemas";
import {
  createRestaurant,
  listUserRestaurants,
} from "@/services/restaurant.service";
import {
  applySecurityHeaders,
  jsonError,
  withRateLimit,
} from "@/lib/security/middleware-helpers";
import { getClientIp } from "@/lib/security/privacy";

export async function GET() {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const restaurants = await listUserRestaurants(authResult.userId);
  return applySecurityHeaders(
    NextResponse.json({ restaurants }),
  );
}

export async function POST(request: Request) {
  const rate = await withRateLimit(
    request as unknown as import("next/server").NextRequest,
    "restaurant-create",
    10,
    60_000,
  );
  if (!rate.allowed) return jsonError("Too many requests", 429);

  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const body = await request.json().catch(() => null);
  const parsed = parseBody(createRestaurantSchema, body);
  if (!parsed.success) return jsonError(parsed.error, 400);

  try {
    const result = await createRestaurant(
      authResult.userId,
      parsed.data,
      getClientIp(new Headers(request.headers)),
    );
    return applySecurityHeaders(NextResponse.json(result, { status: 201 }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create restaurant";
    return jsonError(message, 400);
  }
}
