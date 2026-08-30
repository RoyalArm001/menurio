import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import { getSubscription, getRestaurantById } from "@/services/restaurant.service";
import {
  createNotificationCampaign,
  listNotificationCampaigns,
} from "@/services/notification.service";
import { getRestaurantSettings } from "@/services/team.service";
import { EntitlementError, canUsePush } from "@/lib/entitlements";
import { parseBody, createNotificationCampaignSchema } from "@/lib/validation/schemas";
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
  if (!canUsePush(plan)) {
    return jsonError("Push notifications require PRO", 403);
  }

  try {
    const campaigns = await listNotificationCampaigns(id, plan);
    return applySecurityHeaders(NextResponse.json({ campaigns }));
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : "Failed", 403);
  }
}

export async function POST(request: Request, context: RouteContext) {
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
  const parsed = parseBody(createNotificationCampaignSchema, body);
  if (!parsed.success) return jsonError(parsed.error, 400);

  const subscription = await getSubscription(id);
  const plan = subscription?.plan ?? "FREE";
  const restaurant = await getRestaurantById(id);
  if (!restaurant) return jsonError("Not found", 404);

  const settings = await getRestaurantSettings(id);

  try {
    const scheduledAt = parsed.data.scheduledAt
      ? new Date(parsed.data.scheduledAt)
      : null;
    const campaign = await createNotificationCampaign({
      restaurantId: id,
      userId: authResult.userId,
      plan,
      slug: restaurant.slug,
      restaurantName: restaurant.name,
      logoUrl: restaurant.logoUrl,
      pwaIconUrl: settings?.pwaIconUrl,
      title: parsed.data.title,
      message: parsed.data.message,
      imageUrl: parsed.data.imageUrl,
      targetUrl: parsed.data.targetUrl,
      sendNow: parsed.data.sendNow ?? !scheduledAt,
      scheduledAt,
    });
    return applySecurityHeaders(NextResponse.json({ campaign }));
  } catch (err) {
    if (err instanceof EntitlementError) {
      return jsonError(err.message, 403);
    }
    return jsonError(err instanceof Error ? err.message : "Create failed", 400);
  }
}
