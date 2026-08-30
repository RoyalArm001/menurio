import { eq, and, desc, gte, sql, count } from "drizzle-orm";
import { getDb } from "@/db";
import {
  analyticsEvents,
  orders,
  orderItems,
} from "@/db/schema";

export async function getDashboardAnalytics(restaurantId: string, days = 30) {
  const db = getDb();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const events = await db
    .select({
      eventType: analyticsEvents.eventType,
      total: count(),
    })
    .from(analyticsEvents)
    .where(
      and(
        eq(analyticsEvents.restaurantId, restaurantId),
        gte(analyticsEvents.createdAt, since),
      ),
    )
    .groupBy(analyticsEvents.eventType);

  const eventMap = Object.fromEntries(
    events.map((e) => [e.eventType, Number(e.total)]),
  );

  const [orderStats] = await db
    .select({ total: count() })
    .from(orders)
    .where(
      and(
        eq(orders.restaurantId, restaurantId),
        gte(orders.createdAt, since),
      ),
    );

  const popular = await db
    .select({
      productId: orderItems.productId,
      productName: orderItems.productName,
      qty: sql<number>`sum(${orderItems.quantity})`,
      revenue: sql<string>`sum(${orderItems.unitPrice} * ${orderItems.quantity})`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(
      and(
        eq(orders.restaurantId, restaurantId),
        gte(orders.createdAt, since),
      ),
    )
    .groupBy(orderItems.productId, orderItems.productName)
    .orderBy(desc(sql`sum(${orderItems.quantity})`))
    .limit(5);

  return {
    pageViews: eventMap.restaurant_page_view ?? 0,
    menuViews: eventMap.menu_view ?? 0,
    qrScans: eventMap.qr_scan ?? 0,
    productViews: eventMap.product_view ?? 0,
    addToCart: eventMap.add_to_cart ?? 0,
    orders: Number(orderStats?.total ?? 0),
    popularProducts: popular.map((p) => ({
      name: p.productName,
      orders: Number(p.qty),
      revenue: p.revenue,
    })),
  };
}

export async function trackProductView(
  restaurantId: string,
  productId: string,
  headers?: Headers,
) {
  const { trackEvent } = await import("@/services/analytics.service");
  await trackEvent(
    restaurantId,
    { eventType: "product_view", productId },
    headers,
  );
}

export async function trackAddToCart(
  restaurantId: string,
  productId: string,
  headers?: Headers,
) {
  const { trackEvent } = await import("@/services/analytics.service");
  await trackEvent(
    restaurantId,
    { eventType: "add_to_cart", productId },
    headers,
  );
}
