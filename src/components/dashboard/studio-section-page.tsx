"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  CreditCard,
  Globe2,
  Languages,
  MapPin,
  MoreHorizontal,
  QrCode,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cx } from "@/components/ui/button";
import type { StudioSectionSlug } from "./dashboard-data";
import {
  DashboardButton,
  PageHeader,
  Panel,
  PrototypeNotice,
  SectionTitle,
  StatusPill,
} from "./dashboard-ui";

type SectionMetric = {
  label: string;
  value: string;
  detail: string;
};

type SectionRow = {
  title: string;
  description: string;
  value: string;
  tone: "green" | "amber" | "brand" | "blue" | "neutral";
};

type SectionConfig = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel: string;
  actionResult: string;
  panelTitle: string;
  panelDescription: string;
  metrics: SectionMetric[];
  rows: SectionRow[];
  score: number;
  scoreLabel: string;
  insight: string;
  next: Array<{ label: string; href: string }>;
};

const sectionConfig: Record<StudioSectionSlug, SectionConfig> = {
  restaurant: {
    eyebrow: "Restaurant profile",
    title: "Restaurant",
    description: "Keep every public detail consistent, welcoming and ready for guests.",
    icon: Store,
    actionLabel: "Review profile",
    actionResult: "Restaurant profile reviewed",
    panelTitle: "Public profile",
    panelDescription: "The information guests see across your website and menu",
    metrics: [
      { label: "Profile complete", value: "92%", detail: "+8% this week" },
      { label: "Weekly hours", value: "7 / 7", detail: "No gaps" },
      { label: "Guest channels", value: "3", detail: "Phone · social · map" },
    ],
    rows: [
      { title: "Brand and story", description: "Logo, cover, restaurant description", value: "Complete", tone: "green" },
      { title: "Contact details", description: "+374 10 58 18 18 · 12 Abovyan Street", value: "Verified", tone: "blue" },
      { title: "Hours and services", description: "Dine in, pickup and delivery", value: "Open now", tone: "green" },
      { title: "Social presence", description: "Instagram and Facebook connected", value: "2 channels", tone: "neutral" },
    ],
    score: 92,
    scoreLabel: "Profile strength",
    insight: "Add a booking link to complete your restaurant profile and give guests one more way to convert.",
    next: [{ label: "Customize theme", href: "/studio-preview/themes" }, { label: "Manage domains", href: "/studio-preview/domains" }],
  },
  orders: {
    eyebrow: "Live operations",
    title: "Orders",
    description: "A focused service queue for pickup, delivery and table orders.",
    icon: ShoppingBag,
    actionLabel: "Acknowledge new orders",
    actionResult: "6 new orders acknowledged",
    panelTitle: "Active order queue",
    panelDescription: "Newest orders are prioritized by service time",
    metrics: [
      { label: "New orders", value: "6", detail: "Needs attention" },
      { label: "Average prep", value: "18 min", detail: "2 min faster" },
      { label: "Today’s value", value: "84,200 ֏", detail: "+12% vs Friday" },
    ],
    rows: [
      { title: "Order #1048 · Table 8", description: "3 items · placed 2 minutes ago", value: "18,400 ֏", tone: "brand" },
      { title: "Order #1047 · Pickup", description: "4 items · requested for 19:15", value: "26,100 ֏", tone: "amber" },
      { title: "Order #1046 · Delivery", description: "2 items · Abovyan Street", value: "12,800 ֏", tone: "blue" },
      { title: "Order #1045 · Table 3", description: "Ready to serve · 12 minutes", value: "21,600 ֏", tone: "green" },
    ],
    score: 88,
    scoreLabel: "Service pace",
    insight: "Pickup orders are being prepared four minutes faster than last week. Dinner demand peaks near 19:30.",
    next: [{ label: "View analytics", href: "/studio-preview/analytics" }, { label: "Update availability", href: "/studio-preview/menu" }],
  },
  analytics: {
    eyebrow: "Guest intelligence",
    title: "Analytics",
    description: "See how guests discover, browse and order from your restaurant.",
    icon: BarChart3,
    actionLabel: "Save report view",
    actionResult: "30-day report view saved",
    panelTitle: "Channel performance",
    panelDescription: "The paths bringing guests to Avena this month",
    metrics: [
      { label: "Unique guests", value: "8,492", detail: "+18.2%" },
      { label: "Menu conversion", value: "4.6%", detail: "+0.8 points" },
      { label: "Returning guests", value: "28%", detail: "+4% this month" },
    ],
    rows: [
      { title: "Google Search", description: "Organic restaurant and dish discovery", value: "3,284 visits", tone: "green" },
      { title: "QR menu", description: "Main dining room and terrace", value: "2,906 visits", tone: "brand" },
      { title: "Instagram", description: "Profile and story links", value: "1,428 visits", tone: "blue" },
      { title: "Direct", description: "Typed or bookmarked visits", value: "874 visits", tone: "neutral" },
    ],
    score: 76,
    scoreLabel: "Growth momentum",
    insight: "Guests arriving through QR codes view 2.4 more products per session than guests from social media.",
    next: [{ label: "Improve QR placement", href: "/studio-preview/qr" }, { label: "Edit featured dishes", href: "/studio-preview/menu" }],
  },
  qr: {
    eyebrow: "Permanent guest links",
    title: "QR Codes",
    description: "Create durable QR experiences for tables, rooms, counters and campaigns.",
    icon: QrCode,
    actionLabel: "Generate preview QR",
    actionResult: "Preview QR generated locally",
    panelTitle: "Active QR codes",
    panelDescription: "Every code keeps working through domain and slug changes",
    metrics: [
      { label: "Total scans", value: "3,804", detail: "+24.1%" },
      { label: "Active codes", value: "3", detail: "All healthy" },
      { label: "Order conversion", value: "7.5%", detail: "+1.2 points" },
    ],
    rows: [
      { title: "Main dining room", description: "Permanent menu QR · 148 scans today", value: "Live", tone: "green" },
      { title: "Terrace tables", description: "Table menu · 92 scans today", value: "Live", tone: "green" },
      { title: "Takeaway counter", description: "Pickup menu · 41 scans today", value: "Live", tone: "green" },
      { title: "Summer campaign", description: "Promotion QR · scheduled", value: "Draft", tone: "amber" },
    ],
    score: 94,
    scoreLabel: "Code health",
    insight: "The main dining room code has the strongest engagement between 18:00 and 21:00.",
    next: [{ label: "See menu experience", href: "/studio-preview/menu" }, { label: "Review analytics", href: "/studio-preview/analytics" }],
  },
  domains: {
    eyebrow: "Your address online",
    title: "Domains",
    description: "Manage the web addresses guests use to discover your restaurant.",
    icon: Globe2,
    actionLabel: "Run connection check",
    actionResult: "All domain records checked",
    panelTitle: "Domain connections",
    panelDescription: "Current publishing and certificate status",
    metrics: [
      { label: "Primary domain", value: "menurio.store", detail: "Platform address" },
      { label: "SSL status", value: "Active", detail: "Auto-renewing" },
      { label: "Checks passed", value: "4 / 4", detail: "Just now" },
    ],
    rows: [
      { title: "menurio.store/r/avena", description: "Primary platform URL", value: "Connected", tone: "green" },
      { title: "avena.am", description: "Custom apex domain", value: "DNS pending", tone: "amber" },
      { title: "menu.avena.am", description: "Dedicated menu subdomain", value: "Ready to connect", tone: "blue" },
    ],
    score: 74,
    scoreLabel: "Domain readiness",
    insight: "One DNS record remains before avena.am can become the primary restaurant address.",
    next: [{ label: "Open restaurant profile", href: "/studio-preview/restaurant" }, { label: "Compare plans", href: "/studio-preview/subscription" }],
  },
  branches: {
    eyebrow: "Locations",
    title: "Branches",
    description: "Keep every location aligned while preserving local hours and service details.",
    icon: Building2,
    actionLabel: "Refresh branch status",
    actionResult: "Branch status refreshed",
    panelTitle: "Location overview",
    panelDescription: "Operational status across the Avena group",
    metrics: [
      { label: "Locations", value: "2", detail: "Both active" },
      { label: "Team members", value: "11", detail: "Across branches" },
      { label: "Menus aligned", value: "96%", detail: "2 local items" },
    ],
    rows: [
      { title: "Avena Yerevan", description: "12 Abovyan Street · Main branch", value: "Open", tone: "green" },
      { title: "Dzor by Avena", description: "Dilijan · Seasonal location", value: "Open", tone: "green" },
      { title: "Lake Sevan pop-up", description: "Concept branch · target spring 2027", value: "Planning", tone: "blue" },
    ],
    score: 96,
    scoreLabel: "Branch alignment",
    insight: "Two dishes differ between Yerevan and Dilijan. Everything else is synchronized.",
    next: [{ label: "Manage team", href: "/studio-preview/team" }, { label: "See branch analytics", href: "/studio-preview/analytics" }],
  },
  team: {
    eyebrow: "People and access",
    title: "Team",
    description: "Give each teammate the right workspace for their responsibilities.",
    icon: Users,
    actionLabel: "Prepare invitation",
    actionResult: "Invitation draft prepared",
    panelTitle: "Team directory",
    panelDescription: "Roles and recent dashboard activity",
    metrics: [
      { label: "Members", value: "11", detail: "2 branches" },
      { label: "Active today", value: "7", detail: "Last 8 hours" },
      { label: "Pending invites", value: "2", detail: "Awaiting response" },
    ],
    rows: [
      { title: "Aram Sargsyan", description: "Owner · all locations", value: "Online", tone: "green" },
      { title: "Mariam Hakobyan", description: "Manager · Avena Yerevan", value: "12 min ago", tone: "blue" },
      { title: "Narek Petrosyan", description: "Menu editor · all locations", value: "1 hr ago", tone: "neutral" },
      { title: "Lilit Avetisyan", description: "Order manager · Dzor", value: "Invited", tone: "amber" },
    ],
    score: 82,
    scoreLabel: "Access hygiene",
    insight: "All active members use role-based access. Two invitations expire in three days.",
    next: [{ label: "Review branches", href: "/studio-preview/branches" }, { label: "Open settings", href: "/studio-preview/settings" }],
  },
  subscription: {
    eyebrow: "Plan and usage",
    title: "Subscription",
    description: "Understand your current workspace limits and the features available as you grow.",
    icon: CreditCard,
    actionLabel: "Compare plans",
    actionResult: "Plan comparison opened in preview",
    panelTitle: "Current plan usage",
    panelDescription: "Your first 12 months are free",
    metrics: [
      { label: "Current plan", value: "FREE", detail: "347 days left" },
      { label: "Products", value: "19 / 40", detail: "48% used" },
      { label: "Languages", value: "1 / 1", detail: "English active" },
    ],
    rows: [
      { title: "Restaurant website", description: "Published with Menurio platform URL", value: "Included", tone: "green" },
      { title: "Digital and QR menu", description: "Permanent QR destination", value: "Included", tone: "green" },
      { title: "Custom domain", description: "Available with an eligible plan", value: "Explore", tone: "blue" },
      { title: "Advanced analytics", description: "Deeper guest and order insights", value: "Explore", tone: "blue" },
    ],
    score: 48,
    scoreLabel: "Product allowance",
    insight: "You can add 21 more products on the current prototype plan before reaching the allowance.",
    next: [{ label: "Manage products", href: "/studio-preview/menu" }, { label: "Review domains", href: "/studio-preview/domains" }],
  },
  settings: {
    eyebrow: "Workspace preferences",
    title: "Settings",
    description: "Set the defaults that keep your restaurant workspace consistent.",
    icon: Settings,
    actionLabel: "Save preferences",
    actionResult: "Preview preferences saved",
    panelTitle: "Restaurant defaults",
    panelDescription: "Shared settings for menus, orders and reporting",
    metrics: [
      { label: "Default language", value: "English", detail: "Armenian ready" },
      { label: "Currency", value: "AMD", detail: "֏ display" },
      { label: "Time zone", value: "Yerevan", detail: "UTC +4" },
    ],
    rows: [
      { title: "Languages", description: "English primary · Armenian and Russian drafts", value: "3 configured", tone: "blue" },
      { title: "Order preferences", description: "Pickup and delivery · 20 minute lead time", value: "Active", tone: "green" },
      { title: "Notifications", description: "New orders, publishing and weekly summary", value: "3 enabled", tone: "green" },
      { title: "Regional format", description: "Asia/Yerevan · Armenian dram", value: "Configured", tone: "neutral" },
    ],
    score: 90,
    scoreLabel: "Setup complete",
    insight: "Add Armenian product translations to give local guests a fully native menu experience.",
    next: [{ label: "Translate menu", href: "/studio-preview/menu" }, { label: "Review team", href: "/studio-preview/team" }],
  },
};

const sectionDecor: Record<StudioSectionSlug, { icon: LucideIcon; label: string }> = {
  restaurant: { icon: MapPin, label: "Guest details" },
  orders: { icon: Clock3, label: "Service queue" },
  analytics: { icon: TrendingUp, label: "Growth insight" },
  qr: { icon: QrCode, label: "Permanent links" },
  domains: { icon: ShieldCheck, label: "Secure connection" },
  branches: { icon: Building2, label: "Location health" },
  team: { icon: UserPlus, label: "Role-based access" },
  subscription: { icon: Sparkles, label: "12 months free" },
  settings: { icon: Languages, label: "Workspace defaults" },
};

export function StudioSectionPage({ section }: { section: StudioSectionSlug }) {
  const config = sectionConfig[section];
  const PageIcon = config.icon;
  const DecorIcon = sectionDecor[section].icon;
  const [actionComplete, setActionComplete] = useState(false);
  const [reviewedRows, setReviewedRows] = useState<string[]>([]);

  function reviewRow(title: string) {
    setReviewedRows((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);
  }

  return (
    <div>
      <PageHeader
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
        actions={
          <>
            {actionComplete ? <StatusPill tone="green"><Check className="size-3" /> {config.actionResult}</StatusPill> : null}
            <DashboardButton variant={actionComplete ? "light" : "brand"} onClick={() => setActionComplete((complete) => !complete)}>
              {actionComplete ? <Check className="size-4 text-[#287a54]" /> : <PageIcon className="size-4" />}
              {actionComplete ? "Done in preview" : config.actionLabel}
            </DashboardButton>
          </>
        }
      />

      <section className="mt-6 grid gap-3 sm:grid-cols-3" aria-label={`${config.title} summary`}>
        {config.metrics.map((metric, index) => (
          <Panel key={metric.label} className="relative overflow-hidden p-5">
            <span className={cx("absolute right-0 top-0 h-full w-1", index === 0 ? "bg-[#96691f]" : index === 1 ? "bg-[#66715c]" : "bg-[#d6a354]")} />
            <p className="text-xs font-semibold text-[#77766f]">{metric.label}</p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="text-2xl font-semibold tracking-[-0.045em] text-[#292926] sm:text-[28px]">{metric.value}</p>
              <StatusPill tone={index === 0 ? "green" : "neutral"}>{metric.detail}</StatusPill>
            </div>
          </Panel>
        ))}
      </section>

      <PrototypeNotice />

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,.55fr)]">
        <Panel className="overflow-hidden">
          <div className="p-5 sm:p-6">
            <SectionTitle title={config.panelTitle} description={config.panelDescription} action={<button type="button" aria-label="More options" className="rounded-lg p-1.5 text-[#92918b] hover:bg-[#f1f1ed]"><MoreHorizontal className="size-5" /></button>} />
          </div>
          <div className="border-t border-[#e8e8e3]">
            {config.rows.map((row) => {
              const reviewed = reviewedRows.includes(row.title);
              return (
                <button key={row.title} type="button" onClick={() => reviewRow(row.title)} className="group flex w-full items-center gap-3 border-b border-[#ecece7] px-5 py-4 text-left transition last:border-0 hover:bg-[#fafaf7] sm:px-6">
                  <span className={cx("grid size-9 shrink-0 place-items-center rounded-xl", reviewed ? "bg-[#e7f3ea] text-[#287a54]" : "bg-[#f0f0ec] text-[#77766f]")}>{reviewed ? <CircleCheck className="size-4" /> : <Activity className="size-4" />}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-[#3d3d38] sm:text-sm">{row.title}</span><span className="mt-1 block truncate text-[10px] text-[#92918b] sm:text-[11px]">{row.description}</span></span>
                  <StatusPill tone={reviewed ? "green" : row.tone}>{reviewed ? "Reviewed" : row.value}</StatusPill>
                  <ChevronRight className="hidden size-4 shrink-0 text-[#bbb9b3] transition group-hover:translate-x-0.5 group-hover:text-[#77766f] sm:block" />
                </button>
              );
            })}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel className="overflow-hidden p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4"><span className="grid size-10 place-items-center rounded-2xl bg-[#f4e5df] text-[#b8492a]"><DecorIcon className="size-4" /></span><StatusPill tone="brand">{sectionDecor[section].label}</StatusPill></div>
            <div className="mt-6 flex items-center gap-5">
              <div className="relative grid size-20 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(#287a54 0 ${config.score}%, #ecece7 ${config.score}% 100%)` }}><div className="grid size-[66px] place-items-center rounded-full bg-white text-lg font-bold tracking-[-0.04em]">{config.score}%</div></div>
              <div><p className="text-sm font-semibold text-[#41413c]">{config.scoreLabel}</p><p className="mt-1 text-[11px] leading-5 text-[#898882]">Based on the current mock workspace.</p></div>
            </div>
            <div className="mt-5 rounded-2xl bg-[#f4f4f0] p-4"><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#77766f]"><Sparkles className="size-3.5 text-[#c77f27]" /> Menurio insight</p><p className="mt-2 text-xs leading-5 text-[#62615b]">{config.insight}</p></div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <SectionTitle title="Next best actions" description="Keep your workspace moving" />
            <div className="mt-4 space-y-2">
              {config.next.map((item) => <Link key={item.href} href={item.href} className="flex items-center justify-between rounded-xl border border-[#e4e4de] px-3.5 py-3 text-xs font-semibold text-[#55554f] transition hover:border-[#c7c7c0] hover:bg-[#fafaf7]">{item.label}<ArrowRight className="size-3.5" /></Link>)}
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}
