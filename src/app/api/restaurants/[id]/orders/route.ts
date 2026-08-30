import { NextResponse } from "next/server";
import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import {
  createOrder,
  listOrders,
  updateOrderStatus,
  getOrderWithItems,
} from "@/services/order.service";
import { getSubscription } from "@/services/restaurant.service";
import {
  parseBody,
  createOrderSchema,
  updateOrderStatusSchema,
} from "@/lib/validation/schemas";
import {
  applySecurityHeaders,
  jsonError,
  withRateLimit,
} from "@/lib/security/middleware-helpers";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "order:read",
  );
  if ("error" in access) return access.error;

  const orderList = await listOrders(id);
  return applySecurityHeaders(NextResponse.json({ orders: orderList }));
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const rate = await withRateLimit(
    request as unknown as import("next/server").NextRequest,
    "order-create",
    30,
    60_000,
  );
  if (!rate.allowed) return jsonError("Too many requests", 429);

  const body = await request.json().catch(() => null);
  const parsed = parseBody(createOrderSchema, body);
  if (!parsed.success) return jsonError(parsed.error, 400);

  const subscription = await getSubscription(id);
  const plan = subscription?.plan ?? "FREE";

  try {
    const order = await createOrder(id, plan, parsed.data);
    return applySecurityHeaders(
      NextResponse.json({ order }, { status: 201 }),
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Order failed";
    return jsonError(message, 400);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "order:update",
  );
  if ("error" in access) return access.error;

  const body = await request.json().catch(() => null);
  const parsed = parseBody(updateOrderStatusSchema, body);
  if (!parsed.success) return jsonError(parsed.error, 400);

  if (!body.orderId) return jsonError("orderId required", 400);

  const updated = await updateOrderStatus(
    id,
    body.orderId,
    parsed.data.status,
    authResult.userId,
    parsed.data.note,
  );

  const full = await getOrderWithItems(id, updated.id);
  return applySecurityHeaders(NextResponse.json(full));
}
