"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

type AdminData = {
  stats: { restaurants: number; users: number; orders: number };
  recentRestaurants: Array<{ id?: string; name: string; slug: string; createdAt: string }>;
  recentAudit: Array<{ action: string; createdAt: string }>;
  designs?: Array<{
    restaurantId: string;
    themeId: string;
    whiteLabelEnabled: boolean;
    customCssEnabled: boolean;
  }>;
  customDomains?: Array<{ restaurantId: string; hostname: string; verified: boolean }>;
  subscriptions?: Array<{ restaurantId: string; plan: string; status: string }>;
};

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError("Failed to load admin data"));
  }, []);

  return (
    <div className="site-container py-10">
      <div className="mb-8 flex items-center justify-between">
        <Wordmark href="/admin" compact />
        <Link href="/dashboard" className="text-sm font-semibold text-brand">
          ← Back to dashboard
        </Link>
      </div>
      <h1 className="display-font text-3xl font-semibold">Platform Admin</h1>
      <p className="mt-2 text-muted">Cross-tenant overview (no secrets exposed).</p>

      {error ? <p className="mt-6 text-red-600">{error}</p> : null}

      {data ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Restaurants", data.stats.restaurants],
              ["Users", data.stats.users],
              ["Orders", data.stats.orders],
            ].map(([label, value]) => (
              <div
                key={label as string}
                className="rounded-[24px] border border-line bg-surface p-6 shadow-soft"
              >
                <p className="text-sm text-muted">{label}</p>
                <p className="mt-2 text-3xl font-bold">{value}</p>
              </div>
            ))}
          </div>
          <section className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[24px] border border-line bg-surface p-6">
              <h2 className="font-semibold">Recent restaurants</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {data.recentRestaurants.map((r) => (
                  <li key={r.slug} className="flex justify-between">
                    <span>{r.name}</span>
                    <span className="text-muted">{r.slug}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[24px] border border-line bg-surface p-6">
              <h2 className="font-semibold">Audit log</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {data.recentAudit.map((a, i) => (
                  <li key={i}>{a.action}</li>
                ))}
              </ul>
            </div>
          </section>
          <section className="mt-10 rounded-[24px] border border-line bg-surface p-6">
            <h2 className="font-semibold">Tenant design & entitlements</h2>
            <p className="mt-1 text-sm text-muted">
              Theme, white-label, custom domain and plan — no storage credentials.
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {(data.designs ?? []).map((design) => {
                const sub = data.subscriptions?.find((s) => s.restaurantId === design.restaurantId);
                const domain = data.customDomains?.find((d) => d.restaurantId === design.restaurantId);
                const restaurant = data.recentRestaurants.find((r) => r.id === design.restaurantId);
                return (
                  <li key={design.restaurantId} className="flex flex-wrap justify-between gap-2 border-b border-line py-2">
                    <span>{restaurant?.name ?? design.restaurantId}</span>
                    <span className="text-muted">
                      {design.themeId} · {sub?.plan ?? "FREE"} ·
                      {design.whiteLabelEnabled ? " white-label" : " branded"} ·
                      {domain ? ` ${domain.hostname}` : " no custom domain"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      ) : null}
    </div>
  );
}
