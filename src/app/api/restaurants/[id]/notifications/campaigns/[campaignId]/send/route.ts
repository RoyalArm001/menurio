import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import {
  getRestaurantById,
  getSubscription,
} from "@/services/restaurant.service";
import { executeCampaignSend } from "@/services/notification.service";
import { getRestaurantSettings } from "@/services/team.service";
import { canUsePush } from "@/lib/entitlements";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";

type RouteContext = {
  params: Promise<{ id: string; campaignId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id, campaignId } = await context.params;
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
  if (!canUsePush(plan)) {
    return jsonError("Push notifications require PRO", 403);
  }

  const restaurant = await getRestaurantById(id);
  if (!restaurant) return jsonError("Not found", 404);
  const settings = await getRestaurantSettings(id);

  try {
    const campaign = await executeCampaignSend({
      campaignId,
      restaurantId: id,
      slug: restaurant.slug,
      restaurantName: restaurant.name,
      logoUrl: restaurant.logoUrl,
      pwaIconUrl: settings?.pwaIconUrl,
    });
    return applySecurityHeaders(NextResponse.json({ campaign }));
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : "Send failed", 400);
  }
}
