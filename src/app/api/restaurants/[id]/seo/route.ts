import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import { getSubscription } from "@/services/restaurant.service";
import {
  getRestaurantSeoSettings,
  getRestaurantSeoTranslations,
  upsertRestaurantSeo,
} from "@/services/seo.service";
import { canEditCustomSeo } from "@/lib/entitlements/seo";
import { parseBody, updateSeoSettingsSchema } from "@/lib/validation/schemas";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";

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
  const [settings, translations] = await Promise.all([
    getRestaurantSeoSettings(id),
    getRestaurantSeoTranslations(id),
  ]);

  return applySecurityHeaders(
    NextResponse.json({ plan, settings, translations, canEdit: canEditCustomSeo(plan) }),
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

  const subscription = await getSubscription(id);
  const plan = subscription?.plan ?? "FREE";
  if (!canEditCustomSeo(plan)) {
    return jsonError("Custom SEO requires PRO", 403);
  }

  const body = await request.json().catch(() => null);
  const parsed = parseBody(updateSeoSettingsSchema, body);
  if (!parsed.success) return jsonError(parsed.error, 400);

  try {
    const settings = await upsertRestaurantSeo(id, plan, parsed.data);
    return applySecurityHeaders(NextResponse.json({ settings }));
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : "Save failed", 400);
  }
}
