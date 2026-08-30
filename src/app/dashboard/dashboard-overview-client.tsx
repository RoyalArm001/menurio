"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  orders: number;
  popularProducts: Array<{ name: string; orders: number; revenue: string }>;
};

export default function DashboardOverviewClient() {
  const router = useRouter();
  const { activeRestaurant, loading: ctxLoading } = useRestaurant();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    if (!activeRestaurant) return;
    api
      .getAnalytics(activeRestaurant.id)
      .then((d) => setAnalytics(d.analytics as Analytics))
      .catch(() => setAnalytics(null));
  }, [activeRestaurant]);

  if (ctxLoading) return <p className="text-muted">Loading…</p>;

  if (!activeRestaurant) {
    return (
      <EmptyState
        title="Welcome to Menurio"
        description="Create your first restaurant to get started."
        actionLabel="Create restaurant"
        onAction={() => router.push("/onboarding")}
      />
    );
  }

  const stats = analytics
    ? [
        {
          label: "Page views",
          value: String(analytics.pageViews),
          change: "30d",
          series: [analytics.pageViews],
        },
        {
          label: "Menu views",
          value: String(analytics.menuViews),
          change: "30d",
          series: [analytics.menuViews],
        },
        {
          label: "QR scans",
          value: String(analytics.qrScans),
          change: "30d",
          series: [analytics.qrScans],
        },
        {
          label: "Orders",
          value: String(analytics.orders),
          change: "30d",
          series: [analytics.orders],
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="display-font text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Overview
        </h1>
        <p className="mt-2 text-muted">
          Welcome back. Here is how {activeRestaurant.name}&apos;s digital presence
          is performing.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <AnalyticsCard key={stat.label} {...stat} />
        ))}
      </div>

      <Card>
        <CardHeader title="Popular products" description="Last 30 days" />
        <ul className="space-y-3">
          {(analytics?.popularProducts ?? []).length === 0 ? (
            <li className="text-sm text-muted">No order data yet.</li>
          ) : (
            analytics!.popularProducts.map((p, i) => (
              <li
                key={p.name}
                className="flex items-center justify-between rounded-2xl bg-cream/70 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                    {i + 1}
                  </span>
                  <span className="font-medium text-ink">{p.name}</span>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold">
                    {formatPrice(Number(p.revenue))}
                  </p>
                  <p className="text-muted">{p.orders} orders</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </Card>

      <Card className="bg-brand/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-ink">
              Ready to publish changes?
            </h3>
            <p className="mt-1 text-sm text-muted">
              Preview your restaurant site or continue editing the menu.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard/menu"
              className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold"
            >
              Edit menu
            </Link>
            <Link
              href={`/r/${activeRestaurant.slug}`}
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
            >
              View live site
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
