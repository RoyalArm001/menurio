import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPlatformAdmin } from "@/lib/auth/platform-admin";
import { setRestaurantPlanDirect } from "@/services/subscription.service";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";
import type { SubscriptionPlan } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

const VALID_PLANS: SubscriptionPlan[] = ["FREE", "START", "PRO", "PRO_PLUS"];

export async function POST(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);

  const ok = await isPlatformAdmin(session.user.id);
  if (!ok) return jsonError("Forbidden", 403);

  const { id: restaurantId } = await context.params;
  const body = await request.json().catch(() => null);
  const plan = String(body?.plan ?? "").toUpperCase() as SubscriptionPlan;

  if (!VALID_PLANS.includes(plan)) {
    return jsonError("Invalid plan specified", 400);
  }

  try {
    const result = await setRestaurantPlanDirect(
      restaurantId,
      plan,
      session.user.id,
    );
    return applySecurityHeaders(
      NextResponse.json({
        message: `Restaurant plan updated to ${plan}`,
        ...result,
      }),
    );
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : "Failed to update plan", 400);
  }
}
