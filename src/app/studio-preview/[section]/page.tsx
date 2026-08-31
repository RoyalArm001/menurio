import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  BarChart3,
  BellRing,
  Building2,
  CheckCircle2,
  Clock3,
  CreditCard,
  Eye,
  Globe2,
  Languages,
  MapPin,
  QrCode,
  ScanLine,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Store,
  TrendingUp,
  UserRound,
  Users,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { cx } from "@/components/ui/button";
import {
  isStudioSectionSlug,
  studioSectionSlugs,
  type StudioSectionSlug,
} from "@/components/dashboard/dashboard-data";

type StatusTone = "neutral" | "green" | "amber" | "brand" | "blue";

type SectionConfig = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  action: { label: string; href: string };
  spotlight: { label: string; value: string; description: string };
  stats: Array<{
    label: string;
    value: string;
    detail: string;
    icon: LucideIcon;
  }>;
  listTitle: string;
  listDescription: string;
  rows: Array<{
    title: string;
    description: string;
    meta: string;
    status: string;
    tone: StatusTone;
  }>;
  checklistTitle: string;
  checklist: Array<{ label: string; detail: string; complete: boolean }>;
  resources: Array<{ label: string; description: string; href: string }>;
};

const sectionContent: Record<StudioSectionSlug, SectionConfig> = {
  restaurant: {
    eyebrow: "Restaurant profile",
    title: "Avena Yerevan",
    description: "Keep every guest-facing detail accurate across your website and digital menu.",
    icon: Store,
    action: { label: "View public website", href: "/r/demo-restaurant" },
    spotlight: {
      label: "Profile completeness",
      value: "92%",
      description: "Add a reservations link to complete your restaurant profile.",
    },
    stats: [
      { label: "Public status", value: "Published", detail: "Last updated 24 min ago", icon: Eye },
      { label: "Languages", value: "3 active", detail: "Armenian, English, Russian", icon: Languages },
      { label: "Guest options", value: "2 enabled", detail: "Delivery and pickup", icon: ShoppingBag },
    ],
    listTitle: "Guest information",
    listDescription: "The details shown on the Avena public website",
    rows: [
      { title: "Identity and story", description: "Avena Yerevan · Armenian Mediterranean kitchen", meta: "Logo, cover and introduction", status: "Complete", tone: "green" },
      { title: "Location", description: "4 Tumanyan Street, Yerevan", meta: "Map pin and directions enabled", status: "Live", tone: "blue" },
      { title: "Opening hours", description: "Mon–Sun · 09:00–00:00", meta: "Currently shown as open", status: "Open", tone: "green" },
      { title: "Contact and social", description: "+374 10 555 025 · Instagram · Facebook", meta: "Reservations link not added", status: "Review", tone: "amber" },
    ],
    checklistTitle: "Publishing checklist",
    checklist: [
      { label: "Restaurant details", detail: "Name, address and contact", complete: true },
      { label: "Opening hours", detail: "Seven days configured", complete: true },
      { label: "Reservations link", detail: "Optional guest conversion", complete: false },
    ],
    resources: [
      { label: "Edit the menu", description: "Products, prices and translations", href: "/studio-preview/menu" },
      { label: "Adjust the theme", description: "Brand, type and menu style", href: "/studio-preview/themes" },
    ],
  },
  orders: {
    eyebrow: "Order operations",
    title: "Orders",
    description: "A calm service view for incoming, preparing and completed guest orders.",
    icon: ShoppingBag,
    action: { label: "Open guest menu", href: "/r/demo-restaurant/menu" },
    spotlight: {
      label: "Today’s order value",
      value: "284,600 ֏",
      description: "26 completed orders with an average preparation time of 18 minutes.",
    },
    stats: [
      { label: "New", value: "6", detail: "2 arrived in the last 5 minutes", icon: BellRing },
      { label: "Preparing", value: "3", detail: "Oldest order is 14 minutes", icon: Clock3 },
      { label: "Average order", value: "10,946 ֏", detail: "+8.4% from last Saturday", icon: TrendingUp },
    ],
    listTitle: "Live order queue",
    listDescription: "Representative orders for this visual prototype",
    rows: [
      { title: "#1048 · Table 8", description: "2 × Lamb Manti, Market Burrata, Sparkling water", meta: "18,400 ֏ · placed 2 min ago", status: "New", tone: "brand" },
      { title: "#1047 · Pickup", description: "Charcoal Trout, Apricot Pavlova", meta: "12,900 ֏ · due at 19:35", status: "Preparing", tone: "amber" },
      { title: "#1046 · Table 3", description: "Roasted Cauliflower, 2 × Lamb Manti", meta: "15,100 ֏ · placed 11 min ago", status: "Preparing", tone: "amber" },
      { title: "#1045 · Delivery", description: "Market Burrata, Herb flatbread, 2 drinks", meta: "11,700 ֏ · courier assigned", status: "Ready", tone: "green" },
    ],
    checklistTitle: "Service readiness",
    checklist: [
      { label: "Ordering hours", detail: "09:00–23:30 today", complete: true },
      { label: "Pickup", detail: "20 minute estimate", complete: true },
      { label: "Delivery zones", detail: "Backend integration pending", complete: false },
    ],
    resources: [
      { label: "Review availability", description: "Keep sold-out items accurate", href: "/studio-preview/menu" },
      { label: "See order analytics", description: "Traffic and product performance", href: "/studio-preview/analytics" },
    ],
  },
  analytics: {
    eyebrow: "Restaurant growth",
    title: "Analytics",
    description: "Understand how guests discover, browse and order from your restaurant.",
    icon: BarChart3,
    action: { label: "View public website", href: "/r/demo-restaurant" },
    spotlight: {
      label: "Guest interactions · last 30 days",
      value: "18,444",
      description: "Website, menu and QR engagement is up 16.8% over the previous period.",
    },
    stats: [
      { label: "Website views", value: "8,492", detail: "+18.2% vs. previous 30 days", icon: Eye },
      { label: "Menu views", value: "6,148", detail: "72.4% of website visitors", icon: Utensils },
      { label: "QR scans", value: "3,804", detail: "+24.1% vs. previous 30 days", icon: ScanLine },
    ],
    listTitle: "Top guest journeys",
    listDescription: "The strongest discovery and conversion paths",
    rows: [
      { title: "Instagram → Restaurant home", description: "2,184 sessions · 74% mobile", meta: "Average visit 2m 18s", status: "+22%", tone: "green" },
      { title: "Main dining QR → Menu", description: "1,764 sessions · 3.8 items viewed", meta: "12.6% started an order", status: "+31%", tone: "green" },
      { title: "Google Search → Menu", description: "1,294 sessions · Armenian most used", meta: "Top query: dinner in Yerevan", status: "+14%", tone: "blue" },
      { title: "Direct → Contact", description: "846 sessions · 214 phone taps", meta: "Peak activity 18:00–20:00", status: "Stable", tone: "neutral" },
    ],
    checklistTitle: "Tracking health",
    checklist: [
      { label: "Website events", detail: "Views and contact taps", complete: true },
      { label: "Menu engagement", detail: "Search and product views", complete: true },
      { label: "Order attribution", detail: "Backend integration pending", complete: false },
    ],
    resources: [
      { label: "Open QR workspace", description: "Compare scan locations", href: "/studio-preview/qr" },
      { label: "Review popular dishes", description: "Update featured products", href: "/studio-preview/menu" },
    ],
  },
  qr: {
    eyebrow: "Guest access",
    title: "QR codes",
    description: "Permanent, branded codes for tables, rooms, counters and printed materials.",
    icon: QrCode,
    action: { label: "Test menu destination", href: "/r/demo-restaurant/menu" },
    spotlight: {
      label: "Scans · last 30 days",
      value: "3,804",
      description: "All active codes resolve to the latest published menu without reprinting.",
    },
    stats: [
      { label: "Active codes", value: "4", detail: "Across two guest areas", icon: QrCode },
      { label: "Scans today", value: "148", detail: "Main dining room leads", icon: ScanLine },
      { label: "Mobile opens", value: "97.8%", detail: "Median load time 0.8s", icon: Smartphone },
    ],
    listTitle: "QR destinations",
    listDescription: "Permanent links remain stable after slug or domain changes",
    rows: [
      { title: "Main dining room", description: "12 table cards · Armenian default", meta: "1,764 scans this month", status: "Live", tone: "green" },
      { title: "Terrace", description: "8 table cards · Armenian default", meta: "1,048 scans this month", status: "Live", tone: "green" },
      { title: "Takeaway counter", description: "Counter stand · Menu and pickup", meta: "742 scans this month", status: "Live", tone: "green" },
      { title: "Hotel reception", description: "Room-service menu concept", meta: "250 scans this month", status: "Draft", tone: "neutral" },
    ],
    checklistTitle: "Print readiness",
    checklist: [
      { label: "Logo contrast", detail: "Passes scan safety check", complete: true },
      { label: "Quiet zone", detail: "Print-safe spacing enabled", complete: true },
      { label: "Hotel reception", detail: "Publish before download", complete: false },
    ],
    resources: [
      { label: "Preview the mobile menu", description: "Check the scan destination", href: "/r/demo-restaurant/menu" },
      { label: "Match the restaurant theme", description: "Logo and brand colors", href: "/studio-preview/themes" },
    ],
  },
  domains: {
    eyebrow: "Web presence",
    title: "Domains",
    description: "Manage the platform address now and prepare a custom branded domain for launch.",
    icon: Globe2,
    action: { label: "View current website", href: "/r/demo-restaurant" },
    spotlight: {
      label: "Current public address",
      value: "menurio.store/r/demo-restaurant",
      description: "Published with HTTPS and connected to the latest Avena website release.",
    },
    stats: [
      { label: "Platform domain", value: "Connected", detail: "HTTPS active", icon: ShieldCheck },
      { label: "Custom domain", value: "PRO+", detail: "Available with plan upgrade", icon: Globe2 },
      { label: "Last publish", value: "24 min", detail: "Website and menu online", icon: Clock3 },
    ],
    listTitle: "Domain setup",
    listDescription: "Status of current and planned restaurant addresses",
    rows: [
      { title: "menurio.store/r/demo-restaurant", description: "Primary Menurio address", meta: "SSL active · redirects enabled", status: "Connected", tone: "green" },
      { title: "avena.am", description: "Planned apex custom domain", meta: "DNS instructions available on PRO+", status: "Planned", tone: "amber" },
      { title: "menu.avena.am", description: "Optional menu subdomain", meta: "Can point directly to the digital menu", status: "Optional", tone: "neutral" },
    ],
    checklistTitle: "Domain readiness",
    checklist: [
      { label: "Website published", detail: "Platform URL available", complete: true },
      { label: "HTTPS certificate", detail: "Managed automatically", complete: true },
      { label: "Custom DNS records", detail: "Requires PRO+ and ownership", complete: false },
    ],
    resources: [
      { label: "Compare plans", description: "See custom-domain availability", href: "/marketing-preview/pricing" },
      { label: "Polish the public theme", description: "Prepare before domain launch", href: "/studio-preview/themes" },
    ],
  },
  branches: {
    eyebrow: "Locations",
    title: "Branches",
    description: "Give every location its own hours, service options, menu and guest touchpoints.",
    icon: Building2,
    action: { label: "View flagship profile", href: "/r/demo-restaurant" },
    spotlight: {
      label: "Active network",
      value: "2 locations",
      description: "Avena Yerevan is published; Dzor by Avena is being prepared for launch.",
    },
    stats: [
      { label: "Published", value: "1", detail: "Avena Yerevan", icon: Store },
      { label: "In setup", value: "1", detail: "Dzor by Avena", icon: Building2 },
      { label: "Shared products", value: "28", detail: "Availability set per branch", icon: Utensils },
    ],
    listTitle: "Restaurant locations",
    listDescription: "Operational details for each branch",
    rows: [
      { title: "Avena Yerevan", description: "4 Tumanyan Street, Yerevan", meta: "Open today 09:00–00:00 · 4 active QR codes", status: "Published", tone: "green" },
      { title: "Dzor by Avena", description: "Tsaghkadzor · exact address pending", meta: "Menu translated · opening hours incomplete", status: "Setup", tone: "amber" },
    ],
    checklistTitle: "Next branch launch",
    checklist: [
      { label: "Branch identity", detail: "Name and concept added", complete: true },
      { label: "Menu assignment", detail: "28 shared products", complete: true },
      { label: "Address and hours", detail: "Required before publish", complete: false },
    ],
    resources: [
      { label: "Review restaurant profile", description: "Guest-facing details and hours", href: "/studio-preview/restaurant" },
      { label: "Manage menu availability", description: "Products shared by branch", href: "/studio-preview/menu" },
    ],
  },
  team: {
    eyebrow: "People and access",
    title: "Team",
    description: "A clear view of the people who operate Avena and the roles assigned to them.",
    icon: Users,
    action: { label: "Open workspace settings", href: "/studio-preview/settings" },
    spotlight: {
      label: "Workspace members",
      value: "6 people",
      description: "Four active team members, one manager and one pending invitation.",
    },
    stats: [
      { label: "Owners", value: "1", detail: "Full workspace access", icon: ShieldCheck },
      { label: "Managers", value: "1", detail: "Restaurant and order access", icon: UserRound },
      { label: "Staff", value: "4", detail: "Two role profiles", icon: Users },
    ],
    listTitle: "Members and roles",
    listDescription: "Representative access assignments for the prototype",
    rows: [
      { title: "Aram Sargsyan", description: "aram@avena.am", meta: "Owner · all branches", status: "Active", tone: "green" },
      { title: "Mariam Petrosyan", description: "mariam@avena.am", meta: "Manager · Avena Yerevan", status: "Active", tone: "green" },
      { title: "Narek Hakobyan", description: "narek@avena.am", meta: "Kitchen · menu availability", status: "Active", tone: "green" },
      { title: "Lilit Grigoryan", description: "lilit@avena.am", meta: "Front of house · orders", status: "Invited", tone: "amber" },
    ],
    checklistTitle: "Access hygiene",
    checklist: [
      { label: "Owner assigned", detail: "Workspace accountability", complete: true },
      { label: "Manager role", detail: "Restricted operational access", complete: true },
      { label: "Pending invitation", detail: "Expires in five days", complete: false },
    ],
    resources: [
      { label: "Review branch access", description: "See active restaurant locations", href: "/studio-preview/branches" },
      { label: "Workspace preferences", description: "Language and notifications", href: "/studio-preview/settings" },
    ],
  },
  subscription: {
    eyebrow: "Plan and usage",
    title: "Subscription",
    description: "See the current free period, workspace usage and the features available on paid plans.",
    icon: CreditCard,
    action: { label: "Compare all plans", href: "/marketing-preview/pricing" },
    spotlight: {
      label: "Current plan",
      value: "FREE · 12 months",
      description: "347 days remain in the launch offer. No payment method is attached in this prototype.",
    },
    stats: [
      { label: "Restaurants", value: "1 of 1", detail: "One draft branch previewed", icon: Store },
      { label: "Languages", value: "3 active", detail: "Plan allowance displayed", icon: Languages },
      { label: "Storage", value: "184 MB", detail: "Images shown as mock assets", icon: CreditCard },
    ],
    listTitle: "Plan capabilities",
    listDescription: "A transparent preview of what is active and what requires an upgrade",
    rows: [
      { title: "Restaurant website and QR menu", description: "Public pages, menu and permanent QR destination", meta: "Included in the current free period", status: "Included", tone: "green" },
      { title: "Multilingual menu", description: "Armenian, English and Russian", meta: "Three languages active in the prototype", status: "Included", tone: "green" },
      { title: "Orders and analytics", description: "Operational and growth workspace previews", meta: "Plan availability shown on pricing", status: "Preview", tone: "blue" },
      { title: "Custom domain", description: "Connect an apex domain or subdomain", meta: "Available on PRO+", status: "PRO+", tone: "brand" },
    ],
    checklistTitle: "Account status",
    checklist: [
      { label: "Free period active", detail: "347 days remaining", complete: true },
      { label: "Usage within limits", detail: "No immediate action needed", complete: true },
      { label: "Billing method", detail: "Backend integration pending", complete: false },
    ],
    resources: [
      { label: "Read the pricing comparison", description: "FREE, START, PRO and PRO+", href: "/marketing-preview/pricing" },
      { label: "Continue restaurant setup", description: "Review profile completeness", href: "/studio-preview/restaurant" },
    ],
  },
  settings: {
    eyebrow: "Workspace preferences",
    title: "Settings",
    description: "Review locale, communication and publishing preferences for the owner workspace.",
    icon: Settings,
    action: { label: "View restaurant profile", href: "/studio-preview/restaurant" },
    spotlight: {
      label: "Workspace status",
      value: "Ready to publish",
      description: "Core preferences are configured; backend persistence will be connected separately.",
    },
    stats: [
      { label: "Default language", value: "Armenian", detail: "English and Russian enabled", icon: Languages },
      { label: "Time zone", value: "Yerevan", detail: "GMT+4 · Asia/Yerevan", icon: Clock3 },
      { label: "Notifications", value: "3 channels", detail: "Orders, publishing, reports", icon: BellRing },
    ],
    listTitle: "Preference summary",
    listDescription: "Current values represented in the visual prototype",
    rows: [
      { title: "Regional settings", description: "Armenian · AMD · Asia/Yerevan", meta: "Numbers and dates follow local formats", status: "Configured", tone: "green" },
      { title: "Order notifications", description: "New order and delayed-order alerts", meta: "Dashboard and email selected", status: "Enabled", tone: "green" },
      { title: "Weekly performance report", description: "Summary delivered every Monday", meta: "Owner and manager recipients", status: "Enabled", tone: "blue" },
      { title: "Data export", description: "Menu and analytics export", meta: "Backend export workflow pending", status: "Planned", tone: "neutral" },
    ],
    checklistTitle: "Workspace basics",
    checklist: [
      { label: "Locale", detail: "Currency and time zone", complete: true },
      { label: "Notifications", detail: "Operational alerts selected", complete: true },
      { label: "Data export", detail: "Backend workflow pending", complete: false },
    ],
    resources: [
      { label: "Restaurant information", description: "Address, hours and social links", href: "/studio-preview/restaurant" },
      { label: "Team and access", description: "Members and assigned roles", href: "/studio-preview/team" },
    ],
  },
};

const statusClasses: Record<StatusTone, string> = {
  neutral: "bg-cream text-muted",
  green: "bg-success/10 text-success",
  amber: "bg-amber-500/12 text-amber-700 dark:text-amber-300",
  brand: "bg-brand/12 text-brand",
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
};

type StudioSectionPageProps = {
  params: Promise<{ section: string }>;
};

export function generateStaticParams() {
  return studioSectionSlugs.map((section) => ({ section }));
}

export async function generateMetadata({ params }: StudioSectionPageProps): Promise<Metadata> {
  const { section } = await params;
  if (!isStudioSectionSlug(section)) return { title: "Studio Preview" };

  return {
    title: `${sectionContent[section].title} · Studio Preview`,
    description: sectionContent[section].description,
    robots: { index: false, follow: false },
  };
}

export default async function StudioSectionPage({ params }: StudioSectionPageProps) {
  const { section } = await params;
  if (!isStudioSectionSlug(section)) notFound();

  const content = sectionContent[section];
  const PageIcon = content.icon;

  return (
    <div className="text-ink">
      <header className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between lg:pb-7">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.17em] text-muted">
            <span className="grid size-7 place-items-center rounded-lg bg-brand/10 text-brand">
              <PageIcon className="size-3.5" strokeWidth={1.9} />
            </span>
            {content.eyebrow}
          </div>
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.04em] sm:text-[34px]">
            {content.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-[15px]">
            {content.description}
          </p>
        </div>
        <Link
          href={content.action.href}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-brand px-4 text-sm font-semibold text-white shadow-[0_8px_22px_color-mix(in_srgb,var(--brand)_20%,transparent)] transition hover:-translate-y-0.5 hover:bg-brand-deep sm:self-auto"
        >
          {content.action.label}
          <ArrowUpRight className="size-4" />
        </Link>
      </header>

      <section className="mt-6 grid gap-3 sm:grid-cols-3" aria-label={`${content.title} summary`}>
        {content.stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label} className="rounded-[20px] border border-line bg-surface p-4 shadow-[0_10px_35px_rgba(20,20,18,.035)] sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.11em] text-muted">{stat.label}</p>
                  <p className="mt-3 text-xl font-semibold tracking-[-0.035em] sm:text-2xl">{stat.value}</p>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-cream text-brand">
                  <Icon className="size-[18px]" strokeWidth={1.8} />
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-muted">{stat.detail}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.65fr)]">
        <div className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_12px_40px_rgba(20,20,18,.035)]">
          <div className="border-b border-line px-5 py-5 sm:px-6">
            <h2 className="text-base font-semibold tracking-[-0.02em]">{content.listTitle}</h2>
            <p className="mt-1 text-xs leading-5 text-muted">{content.listDescription}</p>
          </div>
          <div className="divide-y divide-line">
            {content.rows.map((row, index) => (
              <article key={row.title} className="flex flex-col gap-3 px-5 py-4 transition hover:bg-cream/45 sm:flex-row sm:items-center sm:px-6">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-cream text-xs font-bold text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold tracking-[-0.01em]">{row.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted">{row.description}</p>
                  <p className="mt-1 text-[10px] leading-4 text-muted/75">{row.meta}</p>
                </div>
                <span className={cx("inline-flex w-fit shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold", statusClasses[row.tone])}>
                  {row.status}
                </span>
              </article>
            ))}
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <article className="relative overflow-hidden rounded-[22px] border border-white/10 bg-night p-5 text-white shadow-[0_18px_48px_rgba(0,0,0,.13)] sm:p-6">
            <span className="absolute -right-10 -top-12 size-36 rounded-full border border-white/8" />
            <span className="absolute right-3 top-2 size-20 rounded-full border border-white/8" />
            <p className="relative text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">{content.spotlight.label}</p>
            <p className="relative mt-4 break-words text-[clamp(1.45rem,3vw,2rem)] font-semibold leading-tight tracking-[-0.045em]">{content.spotlight.value}</p>
            <p className="relative mt-3 text-xs leading-5 text-white/58">{content.spotlight.description}</p>
          </article>

          <article className="rounded-[22px] border border-line bg-surface p-5 shadow-[0_12px_40px_rgba(20,20,18,.035)] sm:p-6">
            <h2 className="text-sm font-semibold tracking-[-0.02em]">{content.checklistTitle}</h2>
            <div className="mt-4 space-y-4">
              {content.checklist.map((item) => (
                <div key={item.label} className="flex gap-3">
                  {item.complete ? (
                    <CheckCircle2 className="mt-0.5 size-[18px] shrink-0 text-success" />
                  ) : (
                    <span className="mt-0.5 size-[18px] shrink-0 rounded-full border border-line bg-cream" />
                  )}
                  <div>
                    <p className="text-xs font-semibold">{item.label}</p>
                    <p className="mt-1 text-[10px] leading-4 text-muted">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[22px] border border-line bg-surface p-3 shadow-[0_12px_40px_rgba(20,20,18,.035)]">
            <p className="px-2 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Related workspace</p>
            {content.resources.map((resource) => (
              <Link
                key={resource.label}
                href={resource.href}
                className="group flex items-center gap-3 rounded-2xl p-3 transition hover:bg-cream"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold">{resource.label}</span>
                  <span className="mt-1 block text-[10px] leading-4 text-muted">{resource.description}</span>
                </span>
              </Link>
            ))}
          </article>
        </aside>
      </section>

      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-line bg-cream/55 px-4 py-3 text-xs leading-5 text-muted">
        <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
        This is a realistic visual preview for Avena Yerevan. Data persistence and privileged operations remain intentionally outside this public prototype.
      </div>
    </div>
  );
}
