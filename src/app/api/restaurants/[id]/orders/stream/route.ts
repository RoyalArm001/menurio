import { requireAuth, requireRestaurantAccess } from "@/lib/api/guards";
import { listOrders } from "@/services/order.service";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const access = await requireRestaurantAccess(
    authResult.userId,
    id,
    "order:read",
  );
  if ("error" in access) return access.error;

  const { searchParams } = new URL(request.url);
  const since = searchParams.get("since");

  const encoder = new TextEncoder();
  let lastCheck = since ? new Date(since) : new Date();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      send("connected", { restaurantId: id, at: new Date().toISOString() });

      let active = true;
      request.signal.addEventListener("abort", () => {
        active = false;
        controller.close();
      });

      while (active) {
        try {
          const orders = await listOrders(id, 20);
          const fresh = orders.filter((o) => o.createdAt > lastCheck);
          if (fresh.length > 0) {
            send("orders", { orders: fresh });
            lastCheck = new Date();
          } else {
            send("heartbeat", { at: new Date().toISOString() });
          }
        } catch {
          send("error", { message: "poll failed" });
        }

        await new Promise((r) => setTimeout(r, 4000));
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
