"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  UtensilsCrossed,
  ShoppingBag,
  BarChart3,
  QrCode,
  Palette,
  Globe,
  GitBranch,
  Users,
  CreditCard,
  Settings,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { Wordmark } from "@/components/brand/wordmark";
import { logoutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/format";
import { useRestaurant } from "@/contexts/restaurant-context";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/restaurant", label: "Restaurant", icon: Store },
  { href: "/dashboard/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/qr", label: "QR Codes", icon: QrCode },
  { href: "/dashboard/themes", label: "Themes", icon: Palette },
  { href: "/dashboard/domains", label: "Domains", icon: Globe },
  { href: "/dashboard/branches", label: "Branches", icon: GitBranch },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({
  mobileOpen,
  onClose,
  isPlatformAdmin,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
  isPlatformAdmin?: boolean;
}) {
  const pathname = usePathname();
  const { activeRestaurant, restaurants, setActiveRestaurantId, loading } =
    useRestaurant();

  const content = (
    <>
      <div className="flex items-center justify-between border-b border-line px-5 py-5">
        <Wordmark href="/dashboard" compact />
        {onClose ? (
          <button type="button" onClick={onClose} className="md:hidden" aria-label="Close menu">
            <X className="size-5" />
          </button>
        ) : null}
      </div>
      <div className="border-b border-line px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
          Restaurant
        </p>
        <p className="mt-1 font-semibold text-ink">
          {loading ? "Loading…" : activeRestaurant?.name ?? "No restaurant"}
        </p>
        {restaurants.length > 1 ? (
          <select
            className="mt-2 w-full rounded-xl border border-line bg-surface px-2 py-1 text-xs"
            value={activeRestaurant?.id ?? ""}
            onChange={(e) => setActiveRestaurantId(e.target.value)}
          >
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        ) : null}
        {activeRestaurant ? (
          <Link
            href={`/r/${activeRestaurant.slug}`}
            className="mt-2 inline-block text-xs font-semibold text-brand"
          >
            View live site →
          </Link>
        ) : null}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {isPlatformAdmin ? (
          <div className="mb-3 border-b border-line pb-2">
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center gap-3 rounded-2xl bg-amber-500/10 px-3 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-500/20 dark:text-amber-300"
            >
              <ShieldAlert className="size-4 shrink-0 text-amber-600" />
              Platform Admin
            </Link>
          </div>
        ) : null}
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === href
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-brand/10 text-brand-deep"
                  : "text-muted hover:bg-cream hover:text-ink",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface md:flex">
        {content}
      </aside>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close sidebar"
          />
          <aside className="relative flex h-full w-[min(85vw,18rem)] flex-col bg-surface shadow-float">
            {content}
          </aside>
        </div>
      ) : null}
    </>
  );
}

export function DashboardShell({
  children,
  userName,
  isPlatformAdmin,
}: {
  children: React.ReactNode;
  userName?: string;
  isPlatformAdmin?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-paper">
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isPlatformAdmin={isPlatformAdmin}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-line bg-surface/80 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-line md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex items-center gap-3">
            <p className="hidden text-sm text-muted md:block">
              {userName ? `Signed in as ${userName}` : "Dashboard"}
            </p>
            {isPlatformAdmin ? (
              <Link
                href="/admin"
                className="hidden items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-500/20 dark:text-amber-300 sm:inline-flex"
              >
                <ShieldAlert className="size-3.5 text-amber-600" />
                Platform Admin
              </Link>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted hover:text-ink"
              >
                Sign out
              </button>
            </form>
            <Link
              href="/onboarding"
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
            >
              + New restaurant
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
