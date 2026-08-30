"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Bell,
  Building2,
  Check,
  ChevronDown,
  CircleCheck,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  MenuSquare,
  MoreHorizontal,
  Palette,
  Plus,
  QrCode,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { BrandMark, Wordmark } from "@/components/brand/wordmark";
import { cx } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { dashboardNavigation } from "./dashboard-data";

const mobilePreviewNavigation = [
  { label: "Overview", href: "/studio-preview", icon: LayoutDashboard },
  { label: "Menu", href: "/studio-preview/menu", icon: MenuSquare },
  { label: "Orders", href: "/studio-preview/orders", icon: ShoppingBag },
  { label: "Themes", href: "/studio-preview/themes", icon: Palette },
] as const;

function SidebarContent({ onNavigate, preview = false }: { onNavigate?: () => void; preview?: boolean }) {
  const pathname = usePathname();
  const [restaurantMenuOpen, setRestaurantMenuOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState("Avena Yerevan");

  return (
    <div className="flex h-full flex-col bg-night text-white">
      <div className="flex h-[72px] items-center border-b border-white/[0.08] px-5">
        <Wordmark href="/" light compact />
      </div>

      <div className="relative px-3 pt-4">
        <button
          type="button"
          onClick={preview ? () => setRestaurantMenuOpen((open) => !open) : undefined}
          aria-expanded={preview ? restaurantMenuOpen : undefined}
          className="flex w-full items-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.06] p-2.5 text-left transition hover:bg-white/[0.09]"
          aria-label="Switch restaurant"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand font-serif text-lg font-semibold">
            A
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{selectedRestaurant}</span>
            <span className="mt-0.5 flex items-center gap-1 text-[11px] text-white/45">
              <span className="size-1.5 rounded-full bg-success" /> Published
            </span>
          </span>
          <ChevronDown className="size-4 text-white/45" />
        </button>
        {preview && restaurantMenuOpen ? (
          <div className="absolute left-3 right-3 top-[calc(100%+.5rem)] z-30 rounded-2xl border border-white/10 bg-night p-2 shadow-2xl">
            <p className="px-2 pb-2 pt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">Switch restaurant</p>
            {["Avena Yerevan", "Dzor by Avena"].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setSelectedRestaurant(name);
                  setRestaurantMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left text-xs text-white/75 transition hover:bg-white/[0.07] hover:text-white"
              >
                <span className={cx("grid size-7 place-items-center rounded-lg text-[10px] font-bold", name === "Avena Yerevan" ? "bg-brand" : "bg-olive")}>{name.slice(0, 1)}</span>
                <span className="min-w-0 flex-1 truncate">{name}</span>
                {selectedRestaurant === name ? <Check className="size-3.5 text-success" /> : null}
              </button>
            ))}
            <Link href="/studio-preview/restaurant" onClick={() => { setRestaurantMenuOpen(false); onNavigate?.(); }} className="mt-1 flex items-center gap-2 rounded-xl border-t border-white/[0.08] px-2 pt-3 pb-2 text-xs font-semibold text-brand hover:text-white">
              <Settings className="size-3.5" /> Manage restaurants
            </Link>
          </div>
        ) : null}
      </div>

      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 pb-5 pt-3" aria-label="Dashboard navigation">
        {dashboardNavigation.map((group) => (
          <div key={group.label} className="mt-5 first:mt-1">
            <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/28">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const dashboardSection = item.href.replace(/^\/dashboard\/?/, "");
                const href = preview
                  ? dashboardSection
                    ? `/studio-preview/${dashboardSection}`
                    : "/studio-preview"
                  : item.href;
                const active = href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={href}
                    onClick={onNavigate}
                    className={cx(
                      "group flex h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition",
                      active
                        ? "bg-surface text-ink shadow-sm"
                        : "text-white/62 hover:bg-white/[0.06] hover:text-white",
                    )}
                  >
                    <Icon className={cx("size-[17px]", active ? "text-brand" : "text-white/42 group-hover:text-white/75")} strokeWidth={1.8} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <span className={cx(
                        "grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                        active ? "bg-brand/15 text-brand" : "bg-brand text-white",
                      )}>
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/[0.08] p-3">
        <div className="rounded-2xl bg-white/[0.055] p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/45">Free plan</span>
            <span className="text-[10px] text-white/38">347 days left</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[18%] rounded-full bg-brand" />
          </div>
          <Link href={preview ? "/studio-preview/subscription" : "/dashboard/subscription"} onClick={onNavigate} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-brand">
            Explore plans <ExternalLink className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function DashboardShell({
  children,
  preview = false,
  userName = "Aram",
}: {
  children: ReactNode;
  preview?: boolean;
  userName?: string | null;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePopover, setActivePopover] = useState<"create" | "notifications" | "account" | null>(null);
  const [notifications, setNotifications] = useState([
    { id: "order", title: "New order #1048", meta: "Table 8 · 18,400 ֏", time: "2 min" },
    { id: "publish", title: "Menu published", meta: "English and Armenian", time: "24 min" },
    { id: "scan", title: "QR scan milestone", meta: "Main dining room reached 100 scans", time: "1 hr" },
  ]);
  const headerActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!preview || !activePopover) return;

    function closePopover(event: PointerEvent) {
      if (!headerActionsRef.current?.contains(event.target as Node)) setActivePopover(null);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setActivePopover(null);
    }

    document.addEventListener("pointerdown", closePopover);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closePopover);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [activePopover, preview]);

  function togglePopover(popover: "create" | "notifications" | "account") {
    if (!preview) return;
    setActivePopover((active) => active === popover ? null : popover);
  }

  return (
    <div className="theme-aware studio-shell min-h-screen bg-paper text-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[256px] lg:block xl:w-[272px]">
        <SidebarContent preview={preview} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-[min(88vw,320px)] shadow-2xl">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 z-10 grid size-9 place-items-center rounded-xl bg-white/10 text-white"
            >
              <X className="size-5" />
            </button>
            <SidebarContent preview={preview} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-[256px] xl:pl-[272px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-paper/90 px-4 backdrop-blur-xl sm:px-6 lg:h-[72px] lg:px-7 xl:px-9">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <Link href="/" className="mr-auto lg:hidden" aria-label="Menurio home">
            <BrandMark className="size-8" />
          </Link>

          {preview ? (
            <div className="mr-auto hidden items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand sm:flex">
              <span className="size-1.5 rounded-full bg-brand" /> Public prototype preview
            </div>
          ) : (
            <button type="button" className="mr-auto hidden h-9 w-[230px] items-center gap-2 rounded-xl border border-transparent px-3 text-sm text-muted transition hover:border-line hover:bg-surface md:flex">
              <Search className="size-4" /> Search dashboard
              <span className="ml-auto rounded-md border border-line px-1.5 py-0.5 text-[10px]">⌘ K</span>
            </button>
          )}

          <div ref={headerActionsRef} className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle className="h-9 w-9 rounded-xl" />

            <Link
              href="/r/demo-restaurant"
              className="hidden h-9 items-center gap-2 rounded-xl border border-line bg-surface px-3.5 text-xs font-semibold text-ink transition hover:border-brand/40 sm:inline-flex"
            >
              View website <ExternalLink className="size-3.5" />
            </Link>

            <div className="relative hidden sm:block">
              <button
                type="button"
                aria-label="Create"
                aria-expanded={preview ? activePopover === "create" : undefined}
                onClick={() => togglePopover("create")}
                className={cx("grid size-9 place-items-center rounded-xl border bg-surface text-muted transition hover:border-brand/40 hover:text-ink", activePopover === "create" ? "border-brand/40 bg-cream" : "border-line")}
              >
                <Plus className="size-4" />
              </button>
              {preview && activePopover === "create" ? (
                <div className="absolute right-0 top-[calc(100%+.65rem)] z-50 w-64 rounded-2xl border border-line bg-surface p-2 shadow-float">
                  <div className="px-2 pb-2 pt-1"><p className="text-xs font-semibold text-ink">Create something</p><p className="mt-1 text-[10px] text-muted">Jump into a common workflow</p></div>
                  {[
                    { label: "Add menu product", description: "Create a new dish", href: "/studio-preview/menu", icon: MenuSquare },
                    { label: "Generate QR code", description: "For a table or location", href: "/studio-preview/qr", icon: QrCode },
                    { label: "Add a branch", description: "Set up another location", href: "/studio-preview/branches", icon: Building2 },
                  ].map(({ label, description, href, icon: Icon }) => (
                    <Link key={label} href={href} onClick={() => setActivePopover(null)} className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-cream">
                      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand"><Icon className="size-3.5" /></span>
                      <span><span className="block text-xs font-semibold text-ink">{label}</span><span className="mt-0.5 block text-[9px] text-muted">{description}</span></span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={preview ? activePopover === "notifications" : undefined}
                onClick={() => togglePopover("notifications")}
                className={cx("relative grid size-9 place-items-center rounded-xl border bg-surface text-muted transition hover:border-brand/40 hover:text-ink", activePopover === "notifications" ? "border-brand/40 bg-cream" : "border-line")}
              >
                <Bell className="size-4" />
                {notifications.length ? <span className="absolute right-2 top-2 size-1.5 rounded-full bg-brand ring-2 ring-surface" /> : null}
              </button>
              {preview && activePopover === "notifications" ? (
                <div className="absolute right-0 top-[calc(100%+.65rem)] z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface shadow-float">
                  <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
                    <div><p className="text-xs font-semibold">Notifications</p><p className="mt-0.5 text-[9px] text-muted">{notifications.length ? `${notifications.length} unread updates` : "You’re all caught up"}</p></div>
                    {notifications.length ? <button type="button" onClick={() => setNotifications([])} className="text-[10px] font-semibold text-brand hover:text-brand-deep">Mark all read</button> : null}
                  </div>
                  {notifications.length ? (
                    <div className="divide-y divide-line">
                      {notifications.map((notification) => (
                        <button key={notification.id} type="button" onClick={() => setNotifications((current) => current.filter((item) => item.id !== notification.id))} className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-cream">
                          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand" />
                          <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-ink">{notification.title}</span><span className="mt-1 block truncate text-[10px] text-muted">{notification.meta}</span></span>
                          <span className="shrink-0 text-[9px] text-muted">{notification.time}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid place-items-center px-6 py-8 text-center"><CircleCheck className="size-7 text-success" /><p className="mt-2 text-xs font-semibold">Nothing new</p><p className="mt-1 text-[10px] text-muted">New orders and updates will appear here.</p></div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => togglePopover("account")}
                aria-expanded={preview ? activePopover === "account" : undefined}
                className="flex items-center gap-2 rounded-xl pl-1 pr-1 sm:pr-2"
                aria-label="Open account menu"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-olive/20 text-xs font-bold text-olive">
                  {(userName || "A").slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden text-left md:block">
                  <span className="block max-w-24 truncate text-xs font-semibold">{userName || "Aram"}</span>
                  <span className="mt-0.5 flex items-center gap-1 text-[10px] text-muted"><Check className="size-2.5" /> Owner</span>
                </span>
                <ChevronDown className="hidden size-3.5 text-muted md:block" />
              </button>
              {preview && activePopover === "account" ? (
                <div className="absolute right-0 top-[calc(100%+.65rem)] z-50 w-64 overflow-hidden rounded-2xl border border-line bg-surface shadow-float">
                  <div className="border-b border-line p-4">
                    <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-olive/20 text-sm font-bold text-olive">{(userName || "A").slice(0, 1).toUpperCase()}</span><div><p className="text-xs font-semibold">{userName || "Aram"} Sargsyan</p><p className="mt-0.5 text-[9px] text-muted">Owner · Avena Yerevan</p></div></div>
                  </div>
                  <div className="p-2">
                    <Link href="/studio-preview/settings" onClick={() => setActivePopover(null)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-muted hover:bg-cream hover:text-ink"><UserRound className="size-3.5" /> Account settings</Link>
                    <Link href="/studio-preview/subscription" onClick={() => setActivePopover(null)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-muted hover:bg-cream hover:text-ink"><Sparkles className="size-3.5" /> Plan and usage</Link>
                    <Link href="/" onClick={() => setActivePopover(null)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-muted hover:bg-cream hover:text-ink"><LogOut className="size-3.5" /> Exit prototype</Link>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className={cx("mx-auto w-full max-w-[1540px] px-4 py-6 sm:px-6 sm:py-7 lg:px-7 xl:px-9 xl:py-8", preview && "pb-28 sm:pb-28 lg:pb-8")}>
          {children}
        </main>
      </div>

      {preview ? (
        <nav className="mobile-safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-2 pt-2 shadow-[0_-16px_42px_rgba(0,0,0,.12)] backdrop-blur-xl lg:hidden" aria-label="Mobile dashboard navigation">
          <div className="grid grid-cols-5 gap-1">
            {mobilePreviewNavigation.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition",
                    active ? "bg-brand/15 text-brand" : "text-muted hover:bg-cream hover:text-ink",
                  )}
                >
                  <Icon className="size-[18px]" strokeWidth={1.9} />
                  <span>{label}</span>
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold text-muted transition hover:bg-cream hover:text-ink"
              aria-label="Open all dashboard sections"
            >
              <MoreHorizontal className="size-[18px]" strokeWidth={1.9} />
              <span>More</span>
            </button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
