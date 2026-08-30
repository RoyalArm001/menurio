"use client";

import { useEffect, useState } from "react";
import { AnalyticsCard } from "@/components/cards/pricing-card";
import { Card, CardHeader } from "@/components/ui/card";
import { useRestaurant } from "@/contexts/restaurant-context";
import { api } from "@/lib/api/client";
import { formatPrice } from "@/lib/format";
import { EmptyState } from "@/components/ui/states";

type Analytics = {
  pageViews: number;
  menuViews: number;
  qrScans: number;
  productViews: number;
  addToCart: number;
  orders: number;
  popularProducts: Array<{ name: string; orders: number; revenue: string }>;
};

export default function AnalyticsClient() {
  const { activeRestaurant, loading } = useRestaurant();
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    if (!activeRestaurant) return;
    api
      .getAnalytics(activeRestaurant.id)
      .then((r) => setData(r.analytics as Analytics))
      .catch(() => setData(null));
  }, [activeRestaurant]);

  if (loading) return <p className="text-muted">Loading analytics…</p>;
  if (!activeRestaurant) {
    return (
      <EmptyState
        title="No restaurant"
        description="Create a restaurant to view analytics."
      />
    );
  }

  const stats = data
    ? [
        {
          label: "Page views",
          value: String(data.pageViews),
          change: "30d",
          series: [data.pageViews],
        },
        {
          label: "Menu views",
          value: String(data.menuViews),
          change: "30d",
          series: [data.menuViews],
        },
        {
          label: "QR scans",
          value: String(data.qrScans),
          change: "30d",
          series: [data.qrScans],
        },
        {
          label: "Orders",
          value: String(data.orders),
          change: "30d",
          series: [data.orders],
        },
      ]
    : [];

  const conversion =
    data && data.menuViews > 0
      ? `${Math.round((data.orders / data.menuViews) * 100)}%`
      : "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-font text-3xl font-semibold tracking-tight">
          Analytics
        </h1>
        <p className="mt-2 text-muted">
          First-party analytics — last 30 days.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <AnalyticsCard key={s.label} {...s} />
        ))}
      </div>
      <Card>
        <CardHeader title="Conversion" description="Orders / menu views" />
        <p className="text-3xl font-bold">{conversion}</p>
        <p className="mt-2 text-sm text-muted">
          {data?.addToCart ?? 0} add-to-cart events · {data?.productViews ?? 0}{" "}
          product views
        </p>
      </Card>
      <Card>
        <CardHeader title="Top products by revenue" />
        <ul className="space-y-3">
          {(data?.popularProducts ?? []).map((p) => (
            <li
              key={p.name}
              className="flex justify-between rounded-2xl bg-cream/70 px-4 py-3"
            >
              <span className="font-medium">{p.name}</span>
              <span className="text-muted">
                {formatPrice(Number(p.revenue))} · {p.orders} sold
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
