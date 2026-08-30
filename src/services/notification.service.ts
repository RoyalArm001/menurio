import { and, desc, eq, isNotNull, isNull, lt, lte, or, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { getDb } from "@/db";
import {
  notificationCampaigns,
  notificationDeliveries,
  pushSubscriptions,
} from "@/db/schema/notifications";
import { restaurants } from "@/db/schema/restaurants";
import { restaurantSettings } from "@/db/schema/settings";
import {
  assertCapability,
  canSchedulePush,
  canUsePush,
  canUsePushCampaignHistory,
  type SubscriptionPlan,
} from "@/lib/entitlements";
import { validateNotificationTargetUrl } from "@/lib/pwa/validate-target-url";
import { resolveNotificationIcon } from "@/services/pwa.service";
import { deactivatePushSubscription, sendPushToSubscription } from "@/services/push.service";
import { getPlatformBaseUrl } from "@/lib/utils/public-urls";

export type CreateCampaignInput = {
  restaurantId: string;
  userId: string;
  plan: SubscriptionPlan;
  slug: string;
  restaurantName: string;
  logoUrl?: string | null;
  pwaIconUrl?: string | null;
  title: string;
  message: string;
  imageUrl?: string | null;
  targetUrl?: string;
  sendNow?: boolean;
  scheduledAt?: Date | null;
};

const MAX_DELIVERY_ATTEMPTS = 5;
const DELIVERY_LOCK_TIMEOUT_MS = 5 * 60 * 1000;

function sanitizeText(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function absoluteAssetUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${getPlatformBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function createNotificationCampaign(input: CreateCampaignInput) {
  assertCapability(input.plan, "PUSH_NOTIFICATIONS");

  const title = sanitizeText(input.title, 120);
  const message = sanitizeText(input.message, 500);
  if (!title || !message) {
    throw new Error("Title and message are required");
  }

  const target = validateNotificationTargetUrl(
    input.targetUrl ?? "",
    input.slug,
  );
  if (!target.ok) throw new Error(target.error);

  const schedule = input.scheduledAt ?? null;
  if (schedule && input.sendNow) {
    throw new Error("Choose either send now or a scheduled time");
  }
  if (schedule && !canSchedulePush(input.plan)) {
    throw new Error("Scheduled notifications require PRO+");
  }
  if (schedule && schedule.getTime() <= Date.now()) {
    throw new Error("Scheduled time must be in the future");
  }

  const now = new Date();
  const id = randomUUID();
  const status = schedule
      ? "SCHEDULED"
      : "DRAFT";

  const db = getDb();
  await db.insert(notificationCampaigns).values({
    id,
    restaurantId: input.restaurantId,
    createdByUserId: input.userId,
    title,
    message,
    imageUrl: input.imageUrl?.trim() || null,
    targetUrl: target.url,
    status,
    scheduledAt: schedule,
    createdAt: now,
    updatedAt: now,
  });

  if (input.sendNow) {
    await executeCampaignSend({
      campaignId: id,
      restaurantId: input.restaurantId,
      slug: input.slug,
      restaurantName: input.restaurantName,
      logoUrl: input.logoUrl,
      pwaIconUrl: input.pwaIconUrl,
    });
  }

  const [campaign] = await db
    .select()
    .from(notificationCampaigns)
    .where(eq(notificationCampaigns.id, id))
    .limit(1);
  return campaign!;
}

export async function listNotificationCampaigns(
  restaurantId: string,
  plan: SubscriptionPlan,
) {
  if (!canUsePush(plan)) {
    throw new Error("Push notifications require PRO");
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(notificationCampaigns)
    .where(eq(notificationCampaigns.restaurantId, restaurantId))
    .orderBy(desc(notificationCampaigns.createdAt));

  if (!canUsePushCampaignHistory(plan)) {
    return rows.slice(0, 20).map((row) => ({
      ...row,
      message: row.message,
    }));
  }
  return rows;
}

export async function executeCampaignSend(input: {
  campaignId: string;
  restaurantId: string;
  slug: string;
  restaurantName: string;
  logoUrl?: string | null;
  pwaIconUrl?: string | null;
}) {
  const db = getDb();
  const [campaign] = await db
    .select()
    .from(notificationCampaigns)
    .where(
      and(
        eq(notificationCampaigns.id, input.campaignId),
        eq(notificationCampaigns.restaurantId, input.restaurantId),
      ),
    )
    .limit(1);

  if (!campaign) throw new Error("Campaign not found");
  if (campaign.status === "SENT" || campaign.status === "CANCELLED") {
    return campaign;
  }

  const [claim] = await db
    .update(notificationCampaigns)
    .set({ status: "SENDING", updatedAt: new Date() })
    .where(
      and(
        eq(notificationCampaigns.id, campaign.id),
        eq(notificationCampaigns.restaurantId, input.restaurantId),
        or(
          eq(notificationCampaigns.status, "DRAFT"),
          eq(notificationCampaigns.status, "SCHEDULED"),
        ),
      ),
    );

  if (claim.affectedRows !== 1) {
    const [latest] = await db
      .select()
      .from(notificationCampaigns)
      .where(eq(notificationCampaigns.id, campaign.id))
      .limit(1);
    if (latest?.status === "SENT" || latest?.status === "CANCELLED") {
      return latest;
    }
    throw new Error("Campaign is already being sent or cannot be sent");
  }

  const subscriptions = await db
    .select()
    .from(pushSubscriptions)
    .where(
      and(
        eq(pushSubscriptions.restaurantId, input.restaurantId),
        eq(pushSubscriptions.active, true),
      ),
    );

  const now = new Date();
  if (subscriptions.length === 0) {
    await db
      .update(notificationCampaigns)
      .set({ status: "SENT", sentAt: now, updatedAt: now })
      .where(eq(notificationCampaigns.id, campaign.id));
  } else {
    await db
      .insert(notificationDeliveries)
      .values(
        subscriptions.map((subscription) => ({
          id: randomUUID(),
          campaignId: campaign.id,
          subscriptionId: subscription.id,
          status: "PENDING" as const,
          attemptCount: 0,
          nextAttemptAt: now,
          createdAt: now,
        })),
      )
      .onDuplicateKeyUpdate({
        set: { nextAttemptAt: now, lockedAt: null, lockToken: null },
      });
  }

  const [updated] = await db
    .select()
    .from(notificationCampaigns)
    .where(eq(notificationCampaigns.id, campaign.id))
    .limit(1);
  return updated!;
}

async function finalizeCampaign(campaignId: string): Promise<void> {
  const db = getDb();
  const deliveries = await db
    .select({ status: notificationDeliveries.status, nextAttemptAt: notificationDeliveries.nextAttemptAt })
    .from(notificationDeliveries)
    .where(eq(notificationDeliveries.campaignId, campaignId));

  if (deliveries.length === 0) return;
  const now = new Date();
  if (deliveries.every((delivery) => delivery.status === "SENT")) {
    await db
      .update(notificationCampaigns)
      .set({ status: "SENT", sentAt: now, updatedAt: now })
      .where(eq(notificationCampaigns.id, campaignId));
    return;
  }

  const hasRetryPending = deliveries.some((delivery) =>
    delivery.status === "PENDING" || delivery.nextAttemptAt !== null,
  );
  if (!hasRetryPending) {
    await db
      .update(notificationCampaigns)
      .set({ status: "FAILED", updatedAt: now })
      .where(eq(notificationCampaigns.id, campaignId));
  }
}

export async function processQueuedNotificationDeliveries(limit = 50): Promise<number> {
  const db = getDb();
  const now = new Date();
  const lockExpiredAt = new Date(now.getTime() - DELIVERY_LOCK_TIMEOUT_MS);
  const candidates = await db
    .select({
      delivery: notificationDeliveries,
      campaign: notificationCampaigns,
      subscription: pushSubscriptions,
      restaurant: restaurants,
      settings: restaurantSettings,
    })
    .from(notificationDeliveries)
    .innerJoin(
      notificationCampaigns,
      eq(notificationDeliveries.campaignId, notificationCampaigns.id),
    )
    .innerJoin(
      pushSubscriptions,
      eq(notificationDeliveries.subscriptionId, pushSubscriptions.id),
    )
    .innerJoin(restaurants, eq(notificationCampaigns.restaurantId, restaurants.id))
    .leftJoin(
      restaurantSettings,
      eq(restaurantSettings.restaurantId, restaurants.id),
    )
    .where(
      and(
        or(
          eq(notificationDeliveries.status, "PENDING"),
          eq(notificationDeliveries.status, "FAILED"),
        ),
        isNotNull(notificationDeliveries.nextAttemptAt),
        lte(notificationDeliveries.nextAttemptAt, now),
        or(
          isNull(notificationDeliveries.lockedAt),
          lt(notificationDeliveries.lockedAt, lockExpiredAt),
        ),
      ),
    )
    .limit(limit);

  let processed = 0;
  for (const candidate of candidates) {
    const lockToken = randomUUID();
    const [claim] = await db
      .update(notificationDeliveries)
      .set({
        lockToken,
        lockedAt: now,
        attemptCount: sql`${notificationDeliveries.attemptCount} + 1`,
      })
      .where(
        and(
          eq(notificationDeliveries.id, candidate.delivery.id),
          or(
            isNull(notificationDeliveries.lockedAt),
            lt(notificationDeliveries.lockedAt, lockExpiredAt),
          ),
          isNotNull(notificationDeliveries.nextAttemptAt),
          lte(notificationDeliveries.nextAttemptAt, now),
        ),
    );
    if (claim.affectedRows !== 1) continue;

    if (!candidate.subscription.active) {
      await db
        .update(notificationDeliveries)
        .set({
          status: "FAILED",
          error: "Push subscription is inactive",
          nextAttemptAt: null,
          lockedAt: null,
          lockToken: null,
        })
        .where(
          and(
            eq(notificationDeliveries.id, candidate.delivery.id),
            eq(notificationDeliveries.lockToken, lockToken),
          ),
        );
      processed += 1;
      await finalizeCampaign(candidate.campaign.id);
      continue;
    }

    const icon = absoluteAssetUrl(
      resolveNotificationIcon({
        restaurantName: candidate.restaurant.name,
        logoUrl: candidate.restaurant.logoUrl,
        pwaIconUrl: candidate.settings?.pwaIconUrl,
      }),
    );
    const image = candidate.campaign.imageUrl
      ? absoluteAssetUrl(candidate.campaign.imageUrl)
      : undefined;
    const url = candidate.campaign.targetUrl.startsWith("http")
      ? candidate.campaign.targetUrl
      : absoluteAssetUrl(candidate.campaign.targetUrl);
    const result = await sendPushToSubscription(candidate.subscription, {
      title: candidate.campaign.title,
      body: candidate.campaign.message,
      icon,
      image,
      url,
    });
    const attemptCount = candidate.delivery.attemptCount + 1;

    if (result.ok) {
      await db
        .update(notificationDeliveries)
        .set({
          status: "SENT",
          sentAt: new Date(),
          error: null,
          nextAttemptAt: null,
          lockedAt: null,
          lockToken: null,
        })
        .where(
          and(
            eq(notificationDeliveries.id, candidate.delivery.id),
            eq(notificationDeliveries.lockToken, lockToken),
          ),
        );
    } else {
      if (result.deactivate) {
        await deactivatePushSubscription(
          candidate.subscription.restaurantId,
          candidate.subscription.endpoint,
        );
      }
      const canRetry = !result.deactivate && attemptCount < MAX_DELIVERY_ATTEMPTS;
      const nextAttemptAt = canRetry
        ? new Date(Date.now() + 2 ** attemptCount * 60_000)
        : null;
      await db
        .update(notificationDeliveries)
        .set({
          status: "FAILED",
          error: result.error,
          nextAttemptAt,
          lockedAt: null,
          lockToken: null,
        })
        .where(
          and(
            eq(notificationDeliveries.id, candidate.delivery.id),
            eq(notificationDeliveries.lockToken, lockToken),
          ),
        );
    }

    processed += 1;
    await finalizeCampaign(candidate.campaign.id);
  }

  return processed;
}

export async function processDueScheduledCampaigns() {
  const db = getDb();
  const now = new Date();
  const due = await db
    .select()
    .from(notificationCampaigns)
    .where(
      and(
        eq(notificationCampaigns.status, "SCHEDULED"),
        lte(notificationCampaigns.scheduledAt, now),
      ),
    );

  let queued = 0;
  for (const campaign of due) {
    try {
      const [restaurant] = await db
        .select()
        .from(restaurants)
        .where(eq(restaurants.id, campaign.restaurantId))
        .limit(1);
      if (!restaurant) continue;

      const [settings] = await db
        .select()
        .from(restaurantSettings)
        .where(eq(restaurantSettings.restaurantId, restaurant.id))
        .limit(1);

      await executeCampaignSend({
        campaignId: campaign.id,
        restaurantId: campaign.restaurantId,
        slug: restaurant.slug,
        restaurantName: restaurant.name,
        logoUrl: restaurant.logoUrl,
        pwaIconUrl: settings?.pwaIconUrl,
      });
      queued += 1;
    } catch (err) {
      await db
        .update(notificationCampaigns)
        .set({
          status: "FAILED",
          updatedAt: new Date(),
        })
        .where(eq(notificationCampaigns.id, campaign.id));
      console.error("Scheduled campaign failed", campaign.id, err);
    }
  }

  const delivered = await processQueuedNotificationDeliveries();
  return { queued, delivered };
}

export async function getCampaignDeliveries(
  restaurantId: string,
  campaignId: string,
  plan: SubscriptionPlan,
) {
  if (!canUsePushCampaignHistory(plan)) {
    throw new Error("Campaign delivery history requires PRO+");
  }

  const db = getDb();
  const [campaign] = await db
    .select()
    .from(notificationCampaigns)
    .where(
      and(
        eq(notificationCampaigns.id, campaignId),
        eq(notificationCampaigns.restaurantId, restaurantId),
      ),
    )
    .limit(1);
  if (!campaign) throw new Error("Campaign not found");

  return db
    .select()
    .from(notificationDeliveries)
    .where(eq(notificationDeliveries.campaignId, campaignId));
}
