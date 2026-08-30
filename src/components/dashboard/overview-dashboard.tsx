"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  ExternalLink,
  Globe2,
  MoreHorizontal,
  QrCode,
  ScanLine,
  TrendingUp,
} from "lucide-react";
import { cx } from "@/components/ui/button";
import {
  dashboardActivity,
  overviewStats,
  overviewTraffic,
  popularProducts,
} from "./dashboard-data";
import {
  DashboardButton,
  PageHeader,
  Panel,
  SectionTitle,
  StatusPill,
} from "./dashboard-ui";

function Sparkline({ values, id }: { values: number[]; id: string }) {
  const width = 128;
  const height = 40;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / span) * 32 - 4;
      return `${x},${y}`;
    })
    .join(" ");
  const area = `0,${height} ${points} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-10 w-28 overflow-visible" role="img" aria-label="Upward trend">
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--brand)" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#spark-${id})`} />
      <polyline points={points} fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrafficChart() {
  const max = Math.max(...overviewTraffic);
  const points = overviewTraffic.map((value, index) => {
    const x = (index / (overviewTraffic.length - 1)) * 700;
    const y = 178 - (value / max) * 142;
    return `${x},${y}`;
  }).join(" ");
  const area = `0,190 ${points} 700,190`;

  return (
    <div className="mt-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-semibold tracking-[-0.045em] text-ink">18,444</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted">
            Total interactions <StatusPill tone="green">+16.8%</StatusPill>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-semibold text-muted">
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-brand" /> This period</span>
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-line" /> Previous</span>
        </div>
      </div>
      <div className="relative h-[220px] w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-7">
          {["12k", "8k", "4k", "0"].map((label) => (
            <div key={label} className="flex items-center gap-3 text-[10px] text-muted/75">
              <span className="w-6">{label}</span>
              <span className="h-px flex-1 bg-line/70" />
            </div>
          ))}
        </div>
        <svg viewBox="0 0 700 210" preserveAspectRatio="none" className="absolute bottom-6 left-9 h-[185px] w-[calc(100%-2.25rem)]" role="img" aria-label="Interactions increased across August">
          <defs>
            <linearGradient id="traffic-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--brand)" stopOpacity="0.24" />
              <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline points="0,157 54,150 108,142 161,144 215,128 269,137 323,121 377,123 431,109 485,117 538,97 592,102 646,87 700,91" fill="none" stroke="var(--line)" strokeWidth="2" strokeDasharray="5 7" vectorEffect="non-scaling-stroke" />
          <polygon points={area} fill="url(#traffic-area)" />
          <polyline points={points} fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <circle cx="700" cy={178 - (overviewTraffic.at(-1)! / max) * 142} r="4" fill="var(--surface)" stroke="var(--brand)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="absolute inset-x-9 bottom-0 flex justify-between text-[10px] text-muted/75">
          <span>Aug 1</span><span>Aug 8</span><span>Aug 15</span><span>Aug 22</span><span>Aug 29</span>
        </div>
      </div>
    </div>
  );
}

export function OverviewDashboard({
  userName = "Aram",
  restaurantName = "Avena Yerevan",
  linkPrefix = "/dashboard",
}: {
  userName?: string | null;
  restaurantName?: string;
  linkPrefix?: "/dashboard" | "/studio-preview";
}) {
  const [range, setRange] = useState("Last 30 days");
  const [published, setPublished] = useState(false);

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title={`Good afternoon, ${(userName || "Aram").split(" ")[0]}`}
        description={`Here’s what’s happening at ${restaurantName} today.`}
        actions={
          <>
            <label className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <select
                aria-label="Reporting period"
                value={range}
                onChange={(event) => setRange(event.target.value)}
                className="h-10 appearance-none rounded-xl border border-line bg-surface pl-9 pr-8 text-xs font-semibold text-ink outline-none transition focus:border-brand"
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </label>
            <DashboardButton variant={published ? "light" : "brand"} onClick={() => setPublished(true)}>
              {published ? <Check className="size-4 text-success" /> : null}
              {published ? "All changes live" : "Publish changes"}
            </DashboardButton>
          </>
        }
      />

      <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Performance summary">
        {overviewStats.map((stat, index) => (
          <Panel key={stat.label} className="group overflow-hidden p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold text-muted">{stat.label}</p>
              <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-[10px] font-bold text-success">
                <TrendingUp className="size-3" /> {stat.change}
              </span>
            </div>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[28px] font-semibold leading-none tracking-[-0.045em] text-ink">{stat.value}</p>
                <p className="mt-2 text-[10px] text-muted/75">{stat.comparison}</p>
              </div>
              <Sparkline values={stat.series} id={`s${index}`} />
            </div>
          </Panel>
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,.72fr)]">
        <Panel className="min-w-0 p-4 sm:p-6">
          <SectionTitle
            title="Guest activity"
            description="Website, menu and QR interactions"
            action={<button type="button" className="rounded-lg p-1.5 text-muted transition hover:bg-cream hover:text-ink" aria-label="More chart options"><MoreHorizontal className="size-5" /></button>}
          />
          <TrafficChart />
        </Panel>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <Panel className="overflow-hidden p-5">
            <SectionTitle title="Your launch score" description="Complete these to stand out" />
            <div className="mt-5 flex items-center gap-5">
              <div className="relative grid size-20 shrink-0 place-items-center rounded-full" style={{ background: "conic-gradient(var(--success) 0 86%, var(--cream) 86% 100%)" }}>
                <div className="grid size-[66px] place-items-center rounded-full bg-surface">
                  <span className="text-lg font-bold tracking-[-0.04em]">86%</span>
                </div>
              </div>
              <div className="min-w-0 flex-1 space-y-2.5">
                {["Restaurant details", "Menu published", "Add custom domain"].map((item, index) => (
                  <div key={item} className="flex items-center gap-2 text-xs">
                    {index < 2 ? <CircleCheck className="size-4 text-success" /> : <span className="size-4 rounded-full border border-line" />}
                    <span className={index < 2 ? "text-ink/80" : "text-muted"}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href={`${linkPrefix}/restaurant`} className="mt-5 flex items-center justify-between rounded-xl bg-cream px-3.5 py-3 text-xs font-semibold text-ink/80 transition hover:bg-line/70">
              Finish your setup <ArrowRight className="size-4" />
            </Link>
          </Panel>

          <Panel className="relative overflow-hidden !border-night !bg-night p-5 text-white">
            <div className="absolute -right-7 -top-7 size-24 rounded-full border border-white/10" />
            <div className="absolute -right-1 -top-1 size-14 rounded-full border border-white/10" />
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-xl bg-white/10"><QrCode className="size-4" /></span>
              <StatusPill tone="green" className="bg-success/20 text-[#8ee0ae]">Live</StatusPill>
            </div>
            <p className="mt-5 text-sm font-semibold">Main dining room</p>
            <p className="mt-1 text-xs leading-5 text-white/48">Your most active QR code today</p>
            <div className="mt-4 flex items-end justify-between">
              <div><span className="text-2xl font-semibold">148</span><span className="ml-1.5 text-[10px] text-white/40">scans</span></div>
              <Link href={`${linkPrefix}/qr`} className="grid size-9 place-items-center rounded-xl bg-white/10 transition hover:bg-white/15" aria-label="Open QR codes"><ChevronRight className="size-4" /></Link>
            </div>
          </Panel>
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]">
        <Panel className="overflow-hidden">
          <div className="p-5 sm:p-6">
            <SectionTitle
              title="Popular products"
              description="Ranked by orders in the selected period"
              action={<Link href={`${linkPrefix}/analytics`} className="text-xs font-semibold text-brand transition hover:text-brand-deep">Full report</Link>}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[580px] text-left">
              <thead className="border-y border-line bg-cream/55 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                <tr><th className="px-6 py-3">Product</th><th className="px-4 py-3">Orders</th><th className="px-4 py-3">Revenue</th><th className="px-6 py-3 text-right">Trend</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {popularProducts.map((product, index) => (
                  <tr key={product.name} className="group transition hover:bg-cream/45">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <Image src={product.image} alt="" width={42} height={42} className="size-10 rounded-xl object-cover" />
                        <div><p className="text-xs font-semibold text-ink">{product.name}</p><p className="mt-0.5 text-[10px] text-muted">{product.category}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-ink/80">{product.orders}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-ink/80">{product.revenue}</td>
                    <td className="px-6 py-3.5 text-right"><StatusPill tone="green">+{14 - index * 2}%</StatusPill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <SectionTitle title="Recent activity" description="Live updates from your restaurant" />
          <div className="mt-5 space-y-0">
            {dashboardActivity.map((item, index) => {
              const toneClasses: Record<string, string> = {
                brand: "bg-brand/10 text-brand",
                green: "bg-success/10 text-success",
                amber: "bg-amber-500/10 text-amber-600",
                blue: "bg-blue-500/10 text-blue-500",
              };
              const icons = [ScanLine, Globe2, Check, QrCode];
              const Icon = icons[index] || Clock3;
              return (
                <div key={item.title} className="relative flex gap-3 pb-5 last:pb-0">
                  {index !== dashboardActivity.length - 1 ? <span className="absolute left-[17px] top-8 h-[calc(100%-24px)] w-px bg-line" /> : null}
                  <span className={cx("relative z-10 grid size-9 shrink-0 place-items-center rounded-xl", toneClasses[item.tone])}><Icon className="size-4" /></span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-start justify-between gap-3"><p className="truncate text-xs font-semibold text-ink/90">{item.title}</p><span className="shrink-0 text-[10px] text-muted/75">{item.time}</span></div>
                    <p className="mt-1 truncate text-[11px] text-muted">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button type="button" className="mt-5 flex w-full items-center justify-center gap-1 rounded-xl border border-line py-2.5 text-xs font-semibold text-muted transition hover:bg-cream hover:text-ink">
            View all activity <ExternalLink className="size-3" />
          </button>
        </Panel>
      </section>
    </div>
  );
}
