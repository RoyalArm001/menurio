import { eq, and, desc, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { updateReturning } from "@/db/write-helpers";
import {
  orders,
  orderItems,
  orderEvents,
  products,
  productTranslations,
  branches,
  qrCodes,
  restaurants,
} from "@/db/schema";
import { assertTenantScope } from "@/lib/tenant/context";
import { hasCapability, assertCapability } from "@/lib/entitlements";
import type { SubscriptionPlan } from "@/lib/entitlements";
import { getRestaurantSettings } from "@/services/team.service";
import { writeAuditLog } from "@/lib/audit/log";
import type { z } from "zod";
import type { createOrderSchema } from "@/lib/validation/schemas";
import { randomUUID } from "node:crypto";

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderStatus =
  | "NEW"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

export async function createOrder(
  restaurantId: string,
  plan: SubscriptionPlan,
  input: CreateOrderInput,
) {
  if (!hasCapability(plan, "ORDERING") && !hasCapability(plan, "TABLE_ORDERING")) {
    throw new Error("Ordering is not enabled for this plan");
  }

  const orderType = input.orderType ?? "TABLE";

  if (orderType === "TABLE") {
    assertCapability(plan, "TABLE_ORDERING");
  } else {
    assertCapability(plan, "ORDERING");
  }

  const settings = await getRestaurantSettings(restaurantId);
  if (orderType === "DELIVERY" && !settings?.deliveryEnabled) {
    throw new Error("Delivery is not enabled for this restaurant");
  }
  if (orderType === "PICKUP" && settings && !settings.pickupEnabled) {
    throw new Error("Pickup is not enabled for this restaurant");
  }

  const db = getDb();

  if (input.branchId) {
    const [branch] = await db
      .select({ id: branches.id })
      .from(branches)
      .where(
        and(
          eq(branches.id, input.branchId),
          eq(branches.restaurantId, restaurantId),
        ),
      )
      .limit(1);
    if (!branch) throw new Error("Branch not found");
  }

  if (input.qrCodeId) {
    const [qrCode] = await db
      .select({ id: qrCodes.id })
      .from(qrCodes)
      .where(
        and(
          eq(qrCodes.id, input.qrCodeId),
          eq(qrCodes.restaurantId, restaurantId),
          eq(qrCodes.isActive, true),
        ),
      )
      .limit(1);
    if (!qrCode) throw new Error("QR code not found");
  }

  const lineItems: Array<{
    productId: string;
    productName: string;
    unitPrice: string;
    quantity: number;
    notes?: string;
  }> = [];

  let subtotal = 0;

  for (const item of input.items) {
    const [product] = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.id, item.productId),
          eq(products.restaurantId, restaurantId),
          eq(products.isAvailable, true),
        ),
      )
      .limit(1);

    if (!product) {
      throw new Error(`Product ${item.productId} not found or unavailable`);
    }

    const [translation] = await db
      .select()
      .from(productTranslations)
      .where(eq(productTranslations.productId, product.id))
      .limit(1);

    const unitPrice = parseFloat(product.price);
    subtotal += unitPrice * item.quantity;

    lineItems.push({
      productId: product.id,
      productName: translation?.name ?? "Product",
      unitPrice: product.price,
      quantity: item.quantity,
      notes: item.notes,
    });
  }

  const tax = 0;
  const total = subtotal + tax;

  return db.transaction(async (tx) => {
    // Lock the restaurant row so order-number allocation is serialized per tenant.
    const [tenant] = await tx
      .select({ id: restaurants.id })
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId))
      .for("update")
      .limit(1);
    if (!tenant) throw new Error("Restaurant not found");

    const [{ nextNumber }] = await tx
      .select({
        nextNumber: sql<number>`coalesce(max(${orders.orderNumber}), 0) + 1`,
      })
      .from(orders)
      .where(eq(orders.restaurantId, restaurantId));

    const orderId = randomUUID();
    await tx.insert(orders).values({
      id: orderId,
      restaurantId,
      branchId: input.branchId,
      orderNumber: nextNumber,
      orderType,
      status: "NEW",
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      customerNotes: input.customerNotes,
      tableLabel: input.tableLabel,
      qrCodeId: input.qrCodeId,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    });

    await tx.insert(orderItems).values(
      lineItems.map((li) => ({
        id: randomUUID(),
        orderId,
        restaurantId,
        productId: li.productId,
        productName: li.productName,
        unitPrice: li.unitPrice,
        quantity: li.quantity,
        notes: li.notes,
      })),
    );

    await tx.insert(orderEvents).values({
      id: randomUUID(),
      orderId,
      restaurantId,
      status: "NEW",
      note: "Order created",
    });

    const [order] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);
    if (!order) throw new Error("Order creation failed");
    return order;
  });
}

export async function updateOrderStatus(
  restaurantId: string,
  orderId: string,
  status: OrderStatus,
  actorUserId: string,
  note?: string,
) {
  const db = getDb();

  const [existing] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!existing) throw new Error("Order not found");
  assertTenantScope(existing.restaurantId, restaurantId);

  const updated = await updateReturning(
    orders,
    orderId,
    { status, updatedAt: new Date() },
  );

  await db.insert(orderEvents).values({
    orderId,
    restaurantId,
    status,
    actorUserId,
    note,
  });

  await writeAuditLog({
    restaurantId,
    userId: actorUserId,
    action: "order.status_updated",
    entityType: "order",
    entityId: orderId,
    metadata: { status, note },
  });

  return updated;
}

export async function listOrders(restaurantId: string, limit = 50) {
  const db = getDb();
  return db
    .select()
    .from(orders)
    .where(eq(orders.restaurantId, restaurantId))
    .orderBy(desc(orders.createdAt))
    .limit(limit);
}

export async function getOrderWithItems(restaurantId: string, orderId: string) {
  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.restaurantId, restaurantId)))
    .limit(1);

  if (!order) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  const events = await db
    .select()
    .from(orderEvents)
    .where(eq(orderEvents.orderId, orderId))
    .orderBy(desc(orderEvents.createdAt));

  return { order, items, events };
}
