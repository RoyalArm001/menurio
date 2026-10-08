import { eq, desc, and } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { getDb } from "@/db";
import {
  planRequests,
  subscriptions,
  restaurants,
  users,
} from "@/db/schema";
import type { SubscriptionPlan } from "@/lib/entitlements";
import { writeAuditLog } from "@/lib/audit/log";

export async function getRestaurantSubscription(restaurantId: string) {
  const db = getDb();
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.restaurantId, restaurantId))
    .limit(1);
  return sub ?? null;
}

export async function getRestaurantPendingPlanRequest(restaurantId: string) {
  const db = getDb();
  const [req] = await db
    .select()
    .from(planRequests)
    .where(
      and(
        eq(planRequests.restaurantId, restaurantId),
        eq(planRequests.status, "PENDING"),
      ),
    )
    .orderBy(desc(planRequests.createdAt))
    .limit(1);
  return req ?? null;
}

export async function createPlanRequest(input: {
  restaurantId: string;
  userId: string;
  requestedPlan: SubscriptionPlan;
  contactPhone?: string;
  notes?: string;
}) {
  const db = getDb();
  const sub = await getRestaurantSubscription(input.restaurantId);
  const currentPlan = sub?.plan ?? "FREE";
  const now = new Date();

  // Check if there is already a pending request for this restaurant
  const existingPending = await getRestaurantPendingPlanRequest(input.restaurantId);

  if (existingPending) {
    // Update existing pending request
    await db
      .update(planRequests)
      .set({
        requestedPlan: input.requestedPlan,
        currentPlan,
        contactPhone: input.contactPhone ?? existingPending.contactPhone,
        notes: input.notes ?? existingPending.notes,
        updatedAt: now,
      })
      .where(eq(planRequests.id, existingPending.id));

    await writeAuditLog({
      restaurantId: input.restaurantId,
      userId: input.userId,
      action: "plan.request_updated",
      entityType: "plan_request",
      entityId: existingPending.id,
      metadata: {
        requestedPlan: input.requestedPlan,
        currentPlan,
      },
    });

    const [updated] = await db
      .select()
      .from(planRequests)
      .where(eq(planRequests.id, existingPending.id))
      .limit(1);
    return updated!;
  }

  const id = randomUUID();
  await db.insert(planRequests).values({
    id,
    restaurantId: input.restaurantId,
    userId: input.userId,
    requestedPlan: input.requestedPlan,
    currentPlan,
    status: "PENDING",
    contactPhone: input.contactPhone ?? null,
    notes: input.notes ?? null,
    createdAt: now,
    updatedAt: now,
  });

  await writeAuditLog({
    restaurantId: input.restaurantId,
    userId: input.userId,
    action: "plan.requested",
    entityType: "plan_request",
    entityId: id,
    metadata: {
      requestedPlan: input.requestedPlan,
      currentPlan,
    },
  });

  const [created] = await db
    .select()
    .from(planRequests)
    .where(eq(planRequests.id, id))
    .limit(1);
  return created!;
}

export async function listAllPlanRequests() {
  const db = getDb();
  const rows = await db
    .select({
      id: planRequests.id,
      restaurantId: planRequests.restaurantId,
      restaurantName: restaurants.name,
      restaurantSlug: restaurants.slug,
      userId: planRequests.userId,
      userEmail: users.email,
      userName: users.name,
      requestedPlan: planRequests.requestedPlan,
      currentPlan: planRequests.currentPlan,
      status: planRequests.status,
      contactPhone: planRequests.contactPhone,
      notes: planRequests.notes,
      reviewedByUserId: planRequests.reviewedByUserId,
      reviewedAt: planRequests.reviewedAt,
      createdAt: planRequests.createdAt,
      updatedAt: planRequests.updatedAt,
    })
    .from(planRequests)
    .innerJoin(restaurants, eq(planRequests.restaurantId, restaurants.id))
    .innerJoin(users, eq(planRequests.userId, users.id))
    .orderBy(desc(planRequests.createdAt));

  return rows;
}

export async function approvePlanRequest(requestId: string, adminUserId: string) {
  const db = getDb();

  const [req] = await db
    .select()
    .from(planRequests)
    .where(eq(planRequests.id, requestId))
    .limit(1);

  if (!req) {
    throw new Error("Plan request not found");
  }

  if (req.status !== "PENDING") {
    throw new Error(`Request already ${req.status}`);
  }

  const now = new Date();

  await db.transaction(async (tx) => {
    // 1. Update subscription plan
    await tx
      .update(subscriptions)
      .set({
        plan: req.requestedPlan,
        status: "active",
        currentPeriodStart: now,
        updatedAt: now,
      })
      .where(eq(subscriptions.restaurantId, req.restaurantId));

    // 2. Mark request as APPROVED
    await tx
      .update(planRequests)
      .set({
        status: "APPROVED",
        reviewedByUserId: adminUserId,
        reviewedAt: now,
        updatedAt: now,
      })
      .where(eq(planRequests.id, requestId));
  });

  await writeAuditLog({
    restaurantId: req.restaurantId,
    userId: adminUserId,
    action: "admin.plan.approved",
    entityType: "plan_request",
    entityId: requestId,
    metadata: {
      newPlan: req.requestedPlan,
      previousPlan: req.currentPlan,
    },
  });

  return { success: true, plan: req.requestedPlan };
}

export async function rejectPlanRequest(requestId: string, adminUserId: string) {
  const db = getDb();

  const [req] = await db
    .select()
    .from(planRequests)
    .where(eq(planRequests.id, requestId))
    .limit(1);

  if (!req) {
    throw new Error("Plan request not found");
  }

  const now = new Date();
  await db
    .update(planRequests)
    .set({
      status: "REJECTED",
      reviewedByUserId: adminUserId,
      reviewedAt: now,
      updatedAt: now,
    })
    .where(eq(planRequests.id, requestId));

  await writeAuditLog({
    restaurantId: req.restaurantId,
    userId: adminUserId,
    action: "admin.plan.rejected",
    entityType: "plan_request",
    entityId: requestId,
    metadata: {
      requestedPlan: req.requestedPlan,
    },
  });

  return { success: true };
}

export async function setRestaurantPlanDirect(
  restaurantId: string,
  newPlan: SubscriptionPlan,
  adminUserId: string,
) {
  const db = getDb();
  const now = new Date();

  await db
    .update(subscriptions)
    .set({
      plan: newPlan,
      status: "active",
      currentPeriodStart: now,
      updatedAt: now,
    })
    .where(eq(subscriptions.restaurantId, restaurantId));

  await writeAuditLog({
    restaurantId,
    userId: adminUserId,
    action: "admin.restaurant.plan_updated",
    entityType: "restaurant",
    entityId: restaurantId,
    metadata: {
      newPlan,
    },
  });

  return { success: true, plan: newPlan };
}
