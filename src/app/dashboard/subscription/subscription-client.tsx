"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLAN_PRICING } from "@/lib/entitlements";
import type { SubscriptionPlan } from "@/lib/entitlements";
import { useRestaurant } from "@/contexts/restaurant-context";
import { api } from "@/lib/api/client";
import { EmptyState } from "@/components/ui/states";

type Subscription = {
  plan: SubscriptionPlan;
  status: string;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
};

export default function SubscriptionClient() {
  const { activeRestaurant, loading: ctxLoading } = useRestaurant();
  const [sub, setSub] = useState<Subscription | null>(null);

  useEffect(() => {
    if (!activeRestaurant) return;
    api.getRestaurant(activeRestaurant.id).then((d) => {
      setSub(d.subscription as Subscription);
    });
  }, [activeRestaurant]);

  if (ctxLoading) return <p className="text-muted">Loading…</p>;
  if (!activeRestaurant || !sub) {
    return <EmptyState title="No subscription data" description="Create a restaurant first." />;
  }

  const pricing = PLAN_PRICING[sub.plan];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-font text-3xl font-semibold tracking-tight">Subscription</h1>
        <p className="mt-2 text-muted">Internal billing state — payment provider not connected yet.</p>
      </div>
      <Card>
        <CardHeader
          title={`Current plan: ${sub.plan.replace("_", "+")}`}
          action={
            <Badge variant={sub.status === "active" || sub.status === "trialing" ? "brand" : "warning"}>
              {sub.status}
            </Badge>
          }
        />
        <p className="text-3xl font-bold text-ink">{pricing.label}</p>
        {sub.trialEndsAt ? (
          <p className="mt-2 text-sm text-muted">
            Trial ends {new Date(sub.trialEndsAt).toLocaleDateString()}
          </p>
        ) : null}
        <Link href="/pricing">
          <Button className="mt-6">Compare plans</Button>
        </Link>
      </Card>
      <p className="text-sm text-muted">
        Plan changes and payment processing will integrate with a future payment provider.
      </p>
    </div>
  );
}
