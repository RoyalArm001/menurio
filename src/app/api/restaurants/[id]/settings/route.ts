import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import {
  getRestaurantSettings,
  upsertRestaurantSettings,
} from "@/services/team.service";
import { getSubscription } from "@/services/restaurant.service";
import { hasCapability } from "@/lib/entitlements";
import { canEditCustomSeo } from "@/lib/entitlements/seo";
import { parseBody, updateSettingsSchema } from "@/lib/validation/schemas";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";

type RouteContext = { params: Promise<{ id: string }> };

function filterSettingsByPlan(
  data: Record<string, unknown>,
  plan: import("@/lib/entitlements").SubscriptionPlan,
) {
  const patch = { ...data };
  if (!hasCapability(plan, "PWA_INSTALL")) {
    delete patch.pwaEnabled;
    delete patch.pwaDisplayName;
    delete patch.pwaIconUrl;
  }
  if (!hasCapability(plan, "PUSH_NOTIFICATIONS")) {
    delete patch.pushNotificationsEnabled;
  }
  if (!canEditCustomSeo(plan)) {
    delete patch.seoTitle;
    delete patch.seoDescription;
    delete patch.ogImageUrl;
  }
  return patch;
}

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

  const settings = await getRestaurantSettings(id);
  return applySecurityHeaders(NextResponse.json({ settings }));
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
  const parsed = parseBody(updateSettingsSchema, body);
  if (!parsed.success) return jsonError(parsed.error, 400);

  const subscription = await getSubscription(id);
  const plan = subscription?.plan ?? "FREE";
  const patch = filterSettingsByPlan(parsed.data, plan);

  const settings = await upsertRestaurantSettings(
    id,
    authResult.userId,
    patch,
  );
  return applySecurityHeaders(NextResponse.json({ settings }));
}
