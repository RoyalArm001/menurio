"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useRestaurant } from "@/contexts/restaurant-context";
import { api, ApiError } from "@/lib/api/client";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/states";
import { StatusPill } from "@/components/ui/table";

type OrderRow = {
  id: string;
  orderNumber: number;
  orderType: string;
  tableLabel: string | null;
  total: string;
  status: string;
  createdAt: string;
  customerName: string | null;
};

type WaiterRow = {
  id: string;
  type: string;
  tableLabel: string | null;
  status: string;
  createdAt: string;
};

const statusActions: Record<string, string[]> = {
  NEW: ["ACCEPTED", "REJECTED"],
  ACCEPTED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY"],
  READY: ["COMPLETED"],
};

export default function OrdersClient() {
  const router = useRouter();
  const { activeRestaurant, loading: ctxLoading } = useRestaurant();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [waiterRequests, setWaiterRequests] = useState<WaiterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();

  const loadOrders = useCallback(async () => {
    if (!activeRestaurant) return;
    try {
      const [orderData, waiterData] = await Promise.all([
        api.listOrders(activeRestaurant.id),
        api.listWaiterRequests(activeRestaurant.id),
      ]);
      setOrders(orderData.orders as OrderRow[]);
      setWaiterRequests(waiterData.requests as WaiterRow[]);
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  }, [activeRestaurant, push]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch orders on restaurant change
    void loadOrders();
  }, [activeRestaurant?.id]);

  useEffect(() => {
    if (!activeRestaurant) return;
    const es = new EventSource(
      `/api/restaurants/${activeRestaurant.id}/orders/stream`,
    );
    es.onmessage = () => {
      void loadOrders();
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, [activeRestaurant, loadOrders]);

  async function updateStatus(orderId: string, status: string) {
    if (!activeRestaurant) return;
    try {
      await api.updateOrderStatus(activeRestaurant.id, orderId, status);
      push(`Order marked ${status}`, "success");
      await loadOrders();
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Update failed", "error");
    }
  }

  async function acknowledgeWaiter(requestId: string) {
    if (!activeRestaurant) return;
    try {
      await api.acknowledgeWaiter(activeRestaurant.id, requestId);
      push("Request acknowledged", "success");
      await loadOrders();
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Failed", "error");
    }
  }

  if (ctxLoading || loading) {
    return <p className="text-muted">Loading orders…</p>;
  }

  if (!activeRestaurant) {
    return (
      <EmptyState
        title="No restaurant"
        description="Create a restaurant to manage orders."
        actionLabel="Create restaurant"
        onAction={() => router.push("/onboarding")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-font text-3xl font-semibold tracking-tight">
          Orders
        </h1>
        <p className="mt-2 text-muted">
          Live order queue — updates automatically via server events.
        </p>
      </div>
      <Card padding="none">
        <div className="p-5 sm:p-6">
          <CardHeader title="Active orders" description="Newest first" />
        </div>
        {orders.length === 0 ? (
          <div className="px-6 pb-6">
            <EmptyState
              title="No orders yet"
              description="Orders appear here when customers place them from your menu."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-line text-left text-muted">
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Type / Table</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-line/70">
                    <td className="px-5 py-3 font-medium">#{o.orderNumber}</td>
                    <td className="px-5 py-3">
                      {o.orderType}
                      {o.tableLabel ? ` · Table ${o.tableLabel}` : ""}
                    </td>
                    <td className="px-5 py-3">{o.customerName ?? "—"}</td>
                    <td className="px-5 py-3">{formatPrice(Number(o.total))}</td>
                    <td className="px-5 py-3">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(statusActions[o.status] ?? []).map((s) => (
                          <Button
                            key={s}
                            size="sm"
                            variant="secondary"
                            onClick={() => updateStatus(o.id, s)}
                          >
                            {s}
                          </Button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card padding="none">
        <div className="p-5 sm:p-6">
          <CardHeader title="Waiter requests" description="Table service calls" />
        </div>
        {waiterRequests.length === 0 ? (
          <div className="px-6 pb-6 text-sm text-muted">No pending requests.</div>
        ) : (
          <ul className="divide-y divide-line/70 px-5 pb-5">
            {waiterRequests.map((w) => (
              <li key={w.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{w.type.replace("_", " ")}</p>
                  <p className="text-sm text-muted">
                    {w.tableLabel ? `Table ${w.tableLabel}` : "—"} ·{" "}
                    {new Date(w.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <Button size="sm" onClick={() => acknowledgeWaiter(w.id)}>
                  Acknowledge
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
