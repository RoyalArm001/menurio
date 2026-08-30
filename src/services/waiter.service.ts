import { eq, and, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { insertReturning } from "@/db/write-helpers";
import { waiterRequests } from "@/db/schema";
import { assertCapability } from "@/lib/entitlements";
import type { SubscriptionPlan } from "@/lib/entitlements";
import { trackEvent } from "@/services/analytics.service";

export async function createWaiterRequest(
  restaurantId: string,
  plan: SubscriptionPlan,
  input: {
    type: "CALL_WAITER" | "REQUEST_BILL";
    tableLabel?: string;
    branchId?: string;
  },
  headers?: Headers,
) {
  assertCapability(plan, "WAITER_CALL");

  const request = await insertReturning(
    waiterRequests,
    {
      restaurantId,
      branchId: input.branchId,
      type: input.type,
      tableLabel: input.tableLabel,
    },
  );

  await trackEvent(
    restaurantId,
    {
      eventType:
        input.type === "CALL_WAITER" ? "waiter_call" : "bill_request",
      metadata: { tableLabel: input.tableLabel, requestId: request.id },
    },
    headers,
  );

  return request;
}

export async function listWaiterRequests(
  restaurantId: string,
  status = "NEW",
) {
  const db = getDb();
  return db
    .select()
    .from(waiterRequests)
    .where(
      and(
        eq(waiterRequests.restaurantId, restaurantId),
        eq(waiterRequests.status, status),
      ),
    )
    .orderBy(desc(waiterRequests.createdAt));
}

export async function acknowledgeWaiterRequest(
  restaurantId: string,
  requestId: string,
  userId: string,
) {
  const db = getDb();
  await db
    .update(waiterRequests)
    .set({
      status: "ACKNOWLEDGED",
      acknowledgedByUserId: userId,
      acknowledgedAt: new Date(),
    })
    .where(
      and(
        eq(waiterRequests.id, requestId),
        eq(waiterRequests.restaurantId, restaurantId),
      ),
    );

  const [updated] = await db
    .select()
    .from(waiterRequests)
    .where(
      and(
        eq(waiterRequests.id, requestId),
        eq(waiterRequests.restaurantId, restaurantId),
      ),
    )
    .limit(1);

  if (!updated) throw new Error("Request not found");
  return updated;
}
