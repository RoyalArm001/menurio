import { and, eq } from "drizzle-orm";
import webpush from "web-push";
import { getDb } from "@/db";
import { pushSubscriptions } from "@/db/schema/notifications";
import { getVapidPrivateKey, getVapidPublicKey, getVapidSubject, isPushConfigured } from "@/lib/push/vapid";
import { randomUUID } from "node:crypto";

let vapidConfigured = false;

function ensureVapid() {
  if (vapidConfigured) return;
  const publicKey = getVapidPublicKey();
  const privateKey = getVapidPrivateKey();
  if (!publicKey || !privateKey) {
    throw new Error("Push notifications are not configured (missing VAPID keys)");
  }
  webpush.setVapidDetails(getVapidSubject(), publicKey, privateKey);
  vapidConfigured = true;
}

export type PushSubscriptionPayload = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export async function upsertPushSubscription(input: {
  restaurantId: string;
  subscription: PushSubscriptionPayload;
  userAgent?: string | null;
}) {
  const db = getDb();
  const now = new Date();
  const [existing] = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, input.subscription.endpoint))
    .limit(1);

  if (existing) {
    if (existing.restaurantId !== input.restaurantId) {
      throw new Error("Subscription belongs to another restaurant");
    }
    await db
      .update(pushSubscriptions)
      .set({
        p256dh: input.subscription.keys.p256dh,
        auth: input.subscription.keys.auth,
        userAgent: input.userAgent ?? existing.userAgent,
        active: true,
        updatedAt: now,
      })
      .where(eq(pushSubscriptions.id, existing.id));
    return existing.id;
  }

  const id = randomUUID();
  await db.insert(pushSubscriptions).values({
    id,
    restaurantId: input.restaurantId,
    endpoint: input.subscription.endpoint,
    p256dh: input.subscription.keys.p256dh,
    auth: input.subscription.keys.auth,
    userAgent: input.userAgent ?? null,
    active: true,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function deactivatePushSubscription(
  restaurantId: string,
  endpoint: string,
) {
  const db = getDb();
  await db
    .update(pushSubscriptions)
    .set({ active: false, updatedAt: new Date() })
    .where(
      and(
        eq(pushSubscriptions.restaurantId, restaurantId),
        eq(pushSubscriptions.endpoint, endpoint),
      ),
    );
}

export async function deletePushSubscription(endpoint: string) {
  const db = getDb();
  await db
    .delete(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint));
}

export async function listActivePushSubscriptions(restaurantId: string) {
  const db = getDb();
  return db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.restaurantId, restaurantId))
    .then((rows) => rows.filter((r) => r.active));
}

export type PushMessagePayload = {
  title: string;
  body: string;
  icon: string;
  image?: string | null;
  url: string;
};

export async function sendPushToSubscription(
  subscription: typeof pushSubscriptions.$inferSelect,
  payload: PushMessagePayload,
): Promise<{ ok: true } | { ok: false; error: string; deactivate: boolean }> {
  if (!isPushConfigured()) {
    return { ok: false, error: "Push not configured", deactivate: false };
  }

  ensureVapid();

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      JSON.stringify(payload),
    );
    return { ok: true };
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode;
    const message = err instanceof Error ? err.message : "Push failed";
    const deactivate = status === 404 || status === 410;
    return { ok: false, error: message, deactivate };
  }
}

export const PUSH_BATCH_SIZE = 50;

export async function sendPushBatch(
  subscriptions: Array<typeof pushSubscriptions.$inferSelect>,
  payload: PushMessagePayload,
  onResult?: (subscriptionId: string, result: { ok: boolean; error?: string }) => Promise<void>,
) {
  for (let i = 0; i < subscriptions.length; i += PUSH_BATCH_SIZE) {
    const batch = subscriptions.slice(i, i + PUSH_BATCH_SIZE);
    await Promise.all(
      batch.map(async (sub) => {
        const result = await sendPushToSubscription(sub, payload);
        if (!result.ok && result.deactivate) {
          await deactivatePushSubscription(sub.restaurantId, sub.endpoint);
        }
        if (onResult) {
          await onResult(sub.id, {
            ok: result.ok,
            error: result.ok ? undefined : result.error,
          });
        }
      }),
    );
  }
}
