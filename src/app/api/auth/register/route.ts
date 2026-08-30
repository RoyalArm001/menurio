import { NextResponse } from "next/server";
import { RegistrationError, registerUserWithRestaurant } from "@/services/registration.service";
import { parseBody, registerSchema } from "@/lib/validation/schemas";
import {
  applySecurityHeaders,
  jsonError,
  withRateLimit,
} from "@/lib/security/middleware-helpers";

export async function POST(request: Request) {
  const rate = await withRateLimit(
    request as unknown as import("next/server").NextRequest,
    "auth-register",
    5,
    60_000,
  );
  if (!rate.allowed) return jsonError("Too many requests", 429);

  const body = await request.json().catch(() => null);
  const parsed = parseBody(registerSchema, body);
  if (!parsed.success) return jsonError(parsed.error, 400);

  try {
    const result = await registerUserWithRestaurant(parsed.data);
    return applySecurityHeaders(
      NextResponse.json({
        ok: true,
        userId: result.user.id,
        restaurantId: result.restaurant.id,
        slug: result.restaurant.slug,
      }),
    );
  } catch (err) {
    if (err instanceof RegistrationError) {
      const status = err.code === "EMAIL_TAKEN" ? 409 : 400;
      return jsonError("Unable to create account", status);
    }
    return jsonError("Registration failed", 500);
  }
}
