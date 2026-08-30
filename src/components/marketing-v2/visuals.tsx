import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  Clock3,
  Globe2,
  MapPin,
  QrCode,
  Search,
  ShoppingBag,
  Sparkles,
  Utensils,
} from "lucide-react";

import { cx } from "@/components/ui/button";
import { products } from "@/data/mock";

function BrowserBar({ dark = false }: { dark?: boolean }) {
  return (
    <div className={cx("flex h-10 items-center gap-1.5 border-b px-4", dark ? "border-white/10 bg-white/[0.04]" : "border-ink/[0.07] bg-cream")}>
      <span className="size-2 rounded-full bg-[#e17e69]" />
      <span className="size-2 rounded-full bg-[#e9bd67]" />
      <span className="size-2 rounded-full bg-[#83a276]" />
      <div className={cx("mx-auto flex h-5 w-1/2 items-center justify-center rounded-full text-[7px] font-semibold", dark ? "bg-white/[0.07] text-white/35" : "bg-white text-muted/60")}>
        avena.am
      </div>
    </div>
  );
}

export function HeroVisual() {
  const heights = [30, 48, 37, 61, 52, 74, 92, 70, 100, 84, 96];

  return (
    <div className="relative mx-auto w-full max-w-[660px] pb-20 pt-7 sm:pb-24 lg:pt-0">
      <div className="absolute -left-4 top-2 size-36 rounded-full bg-brand/15 blur-3xl" />
      <div className="absolute -right-5 bottom-20 size-40 rounded-full bg-[#dcb45f]/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-[22px] border border-white/80 bg-white shadow-float sm:rounded-[30px]">
        <BrowserBar />
        <div className="relative aspect-[1.27/1] overflow-hidden bg-night sm:aspect-[1.5/1]">
          <Image
            src="/images/avena-interior.png"
            alt="Warm, elegant Avena restaurant interior"
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 text-white sm:p-6">
            <div className="display-font text-lg font-semibold tracking-tight sm:text-xl">AVENA</div>
            <div className="hidden items-center gap-4 text-[9px] font-bold uppercase tracking-[0.14em] text-white/75 sm:flex">
              <span>Menu</span><span>Our story</span><span>Visit</span>
            </div>
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md sm:hidden">Menu</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.2em] text-white/65 sm:text-[10px]">Armenian soul · Mediterranean rhythm</p>
            <p className="display-font max-w-md text-[2rem] leading-[0.95] font-semibold tracking-[-0.045em] sm:text-[3.4rem]">Gather around our table.</p>
            <div className="mt-5 flex gap-2">
              <span className="rounded-full bg-white px-3.5 py-2 text-[9px] font-bold text-ink sm:px-4 sm:text-[10px]">Explore the menu</span>
              <span className="rounded-full border border-white/30 bg-white/10 px-3.5 py-2 text-[9px] font-bold backdrop-blur-md sm:px-4 sm:text-[10px]">Reserve a table</span>
            </div>
          </div>
        </div>
      </div>

      <div className="float-gentle absolute -bottom-1 -left-1 w-[45%] min-w-[164px] rounded-[22px] border border-white/80 bg-white p-3 shadow-float sm:-left-8 sm:w-[230px] sm:rounded-[26px] sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-night text-white"><QrCode aria-hidden="true" className="size-4" /></span>
            <div>
              <p className="text-[8px] font-bold uppercase tracking-wider text-muted sm:text-[9px]">Live activity</p>
              <p className="text-xs font-bold text-ink sm:text-sm">Menu viewed</p>
            </div>
          </div>
          <span className="size-2 rounded-full bg-success shadow-[0_0_0_4px_rgba(40,122,84,.12)]" />
        </div>
        <div className="mt-3 flex h-8 items-end gap-1 sm:h-10">
          {heights.map((height, index) => (
            <span key={`${height}-${index}`} className="flex-1 rounded-t bg-brand/20 last:bg-brand" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>

      <div className="absolute -bottom-2 right-0 w-[47%] min-w-[172px] rounded-[22px] border border-white/80 bg-night p-3.5 text-white shadow-float sm:-right-7 sm:w-[240px] sm:rounded-[26px] sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div><p className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/45 sm:text-[9px]">New order</p><p className="mt-1 text-sm font-bold sm:text-base">#1048 · Pickup</p></div>
          <span className="rounded-full bg-[#e6b65f] px-2 py-1 text-[7px] font-extrabold uppercase tracking-wider text-[#1d1b18] sm:text-[8px]">New</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-[9px] sm:text-xs">
          <span className="text-white/55">3 items</span><span className="font-bold">18,400 AMD</span>
        </div>
      </div>
    </div>
  );
}

export function WebsiteVisual() {
  return (
    <div className="relative min-h-[420px] sm:min-h-[540px]">
      <div className="absolute inset-x-0 top-0 overflow-hidden rounded-[26px] border border-ink/[0.08] bg-surface shadow-soft sm:rounded-[32px]">
        <BrowserBar />
        <div className="relative aspect-[1.3/1] overflow-hidden sm:aspect-[1.5/1]">
          <Image src="/images/avena-interior.png" alt="Avena restaurant website cover" fill sizes="(max-width: 1024px) 92vw, 53vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex max-w-[75%] flex-col justify-center p-5 text-white sm:p-10">
            <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-white/65 sm:text-[9px]">Avena · Yerevan</span>
            <p className="display-font mt-3 text-3xl leading-none font-semibold tracking-[-0.04em] sm:text-5xl">Food with a sense of place.</p>
            <span className="mt-5 w-fit rounded-full bg-white px-4 py-2 text-[9px] font-bold text-ink sm:text-[10px]">Discover Avena</span>
          </div>
        </div>
        <div className="grid grid-cols-3 border-t border-line bg-white">
          {[["Open today", "09:00 — 23:00"], ["Find us", "12 Abovyan St."], ["Services", "Dine in · Delivery"]].map(([label, value]) => (
            <div key={label} className="border-r border-line p-3 last:border-r-0 sm:p-5">
              <p className="text-[7px] font-bold uppercase tracking-wider text-muted sm:text-[9px]">{label}</p>
              <p className="mt-1 truncate text-[8px] font-bold text-ink sm:text-xs">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 right-3 w-[46%] overflow-hidden rounded-[20px] border-[5px] border-night bg-white shadow-float sm:right-8 sm:w-[210px] sm:rounded-[28px] sm:border-[7px]">
        <div className="relative aspect-[1/1.05]">
          <Image src="/images/burrata.png" alt="Market burrata on the restaurant mobile website" fill sizes="220px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[6px] font-bold text-success sm:text-[7px]">OPEN NOW</span>
          <p className="display-font absolute bottom-3 left-3 right-3 text-lg leading-none font-semibold text-white sm:text-2xl">Seasonal plates, made to share.</p>
        </div>
        <div className="flex items-center justify-between p-3">
          <div><p className="text-[6px] font-bold uppercase tracking-wider text-muted sm:text-[7px]">From the menu</p><p className="mt-0.5 text-[8px] font-bold sm:text-xs">Market Burrata</p></div>
          <span className="grid size-7 place-items-center rounded-full bg-brand text-white"><ArrowUpRight aria-hidden="true" className="size-3" /></span>
        </div>
      </div>
    </div>
  );
}

export function MenuPhoneVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[430px] px-2 py-7 sm:px-10">
      <div className="absolute left-0 top-24 z-10 hidden w-36 rounded-2xl border border-white/10 bg-white/[0.07] p-3 text-white shadow-2xl backdrop-blur-md sm:block">
        <div className="flex items-center gap-2"><Globe2 aria-hidden="true" className="size-4 text-[#e6b65f]" /><span className="text-[9px] font-bold uppercase tracking-wider text-white/50">Languages</span></div>
        <div className="mt-3 flex gap-1.5 text-[9px] font-bold"><span className="rounded-full bg-white px-2.5 py-1 text-ink">EN</span><span className="rounded-full bg-white/10 px-2.5 py-1">ՀՅ</span><span className="rounded-full bg-white/10 px-2.5 py-1">RU</span></div>
      </div>
      <div className="relative mx-auto w-[270px] overflow-hidden rounded-[38px] border-[7px] border-[#302d28] bg-paper shadow-[0_35px_90px_rgba(0,0,0,.4)] sm:w-[300px]">
        <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-night" />
        <div className="px-4 pb-6 pt-4">
          <div className="flex items-center justify-between">
            <div><p className="display-font text-xl font-semibold tracking-tight">AVENA</p><p className="mt-0.5 flex items-center gap-1 text-[8px] font-bold text-success"><span className="size-1.5 rounded-full bg-success" />Open · until 23:00</p></div>
            <span className="grid size-8 place-items-center rounded-full border border-line bg-white"><ShoppingBag aria-hidden="true" className="size-3.5" /></span>
          </div>
          <div className="mt-4 flex h-9 items-center gap-2 rounded-full border border-line bg-white px-3 text-[9px] text-muted"><Search aria-hidden="true" className="size-3" />Search the menu</div>
          <div className="no-scrollbar -mx-4 mt-3 flex gap-1.5 overflow-hidden px-4">
            {["Popular", "Breakfast", "Small plates"].map((category, index) => (
              <span key={category} className={cx("shrink-0 rounded-full px-3 py-1.5 text-[8px] font-bold", index === 0 ? "bg-night text-white" : "border border-line bg-white text-muted")}>{category}</span>
            ))}
          </div>
          <p className="display-font mt-5 text-xl font-semibold">Guest favourites</p>
          <div className="mt-3 space-y-2.5">
            {products.slice(0, 3).map((product, index) => (
              <div key={product.id} className="flex gap-2.5 rounded-2xl border border-line bg-white p-2 shadow-sm">
                <div className="relative size-[66px] shrink-0 overflow-hidden rounded-xl bg-cream">
                  <Image src={["/images/burrata.png", "/images/manti.png", "/images/trout.png"][index]} alt="" fill sizes="66px" className="object-cover" />
                  {index === 0 ? <span className="absolute left-1 top-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[6px] font-extrabold text-brand">POPULAR</span> : null}
                </div>
                <div className="min-w-0 flex-1 py-0.5"><p className="truncate text-[10px] font-bold">{product.name}</p><p className="mt-1 line-clamp-2 text-[7px] leading-[1.35] text-muted">{product.description}</p><p className="mt-1.5 text-[9px] font-extrabold">{product.price.toLocaleString()} AMD</p></div>
                <span className="mt-auto grid size-6 shrink-0 place-items-center rounded-full bg-brand text-sm font-medium text-white">+</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-20 right-0 z-10 w-32 rounded-2xl border border-white/10 bg-[#f1b954] p-3 text-[#1d1b18] shadow-2xl sm:w-36">
        <div className="flex items-center justify-between"><QrCode aria-hidden="true" className="size-5" /><Sparkles aria-hidden="true" className="size-3.5" /></div>
        <p className="mt-6 text-[8px] font-bold uppercase tracking-wider opacity-60">Permanent QR</p><p className="mt-0.5 text-[9px] font-extrabold sm:text-[10px]">Always points to your menu</p>
      </div>
    </div>
  );
}

const orderRows = [
  { id: "#1048", type: "Pickup", guest: "Mariam A.", total: "18,400 AMD", status: "New", time: "18:42" },
  { id: "#1047", type: "Delivery", guest: "Arman G.", total: "12,900 AMD", status: "Preparing", time: "18:36" },
  { id: "#1046", type: "Table 8", guest: "Walk-in", total: "24,600 AMD", status: "Ready", time: "18:21" },
];

export function OrdersVisual() {
  return (
    <div className="overflow-hidden rounded-[26px] border border-ink/[0.08] bg-white shadow-soft sm:rounded-[32px]">
      <div className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-6">
        <div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand sm:text-[10px]">Live orders</p><p className="mt-1 text-base font-bold sm:text-lg">Saturday dinner service</p></div>
        <span className="rounded-full bg-success/10 px-3 py-1.5 text-[9px] font-bold text-success sm:text-[10px]">Accepting orders</span>
      </div>
      <div className="p-3 sm:p-5">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[["New", "8"], ["Preparing", "4"], ["Ready", "2"]].map(([label, value], index) => (
            <div key={label} className={cx("rounded-2xl p-3 sm:p-4", index === 0 ? "bg-brand text-white" : "bg-cream")}><p className={cx("text-[8px] font-bold uppercase tracking-wider", index === 0 ? "text-white/65" : "text-muted")}>{label}</p><p className="display-font mt-2 text-2xl font-semibold sm:text-3xl">{value}</p></div>
          ))}
        </div>
        <div className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line">
          {orderRows.map((order, index) => (
            <div key={order.id} className="grid grid-cols-[1fr_auto] gap-3 bg-white p-3 transition-colors hover:bg-cream/45 sm:grid-cols-[.6fr_1fr_.8fr_.7fr] sm:items-center sm:p-4">
              <div><p className="text-sm font-extrabold">{order.id}</p><p className="mt-0.5 text-[9px] font-medium text-muted">{order.time}</p></div>
              <div className="hidden sm:block"><p className="text-xs font-bold">{order.guest}</p><p className="mt-0.5 text-[9px] text-muted">{order.type}</p></div>
              <p className="hidden text-xs font-bold sm:block">{order.total}</p>
              <span className={cx("w-fit rounded-full px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-wider", index === 0 ? "bg-brand/10 text-brand" : index === 1 ? "bg-[#e6b65f]/20 text-[#806019]" : "bg-success/10 text-success")}>{order.status}</span>
              <div className="col-span-2 flex items-center justify-between border-t border-line pt-2 sm:hidden"><span className="text-[9px] text-muted">{order.guest} · {order.type}</span><span className="text-[9px] font-bold">{order.total}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const analyticsSummary: Array<{ label: string; value: string; icon: LucideIcon }> = [
  { label: "QR scans", value: "3,804", icon: QrCode },
  { label: "Orders", value: "284", icon: ShoppingBag },
  { label: "Avg. visit", value: "3m 42s", icon: Clock3 },
];

export function AnalyticsVisual() {
  const bars = [46, 63, 54, 77, 68, 86, 74, 96, 82, 100, 91, 112];
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.055] p-4 text-white shadow-2xl backdrop-blur-sm sm:rounded-[32px] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/45 sm:text-[9px]">Website & menu views</p><div className="mt-2 flex items-end gap-2"><span className="display-font text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">14,640</span><span className="mb-1 rounded-full bg-success/20 px-2 py-1 text-[9px] font-bold text-[#83d9ac]">+18.2%</span></div></div>
        <span className="hidden rounded-full border border-white/10 px-3 py-1.5 text-[9px] font-bold text-white/55 sm:block">Last 30 days</span>
      </div>
      <div className="mt-7 flex h-36 items-end gap-2 border-b border-white/10 sm:h-48 sm:gap-3">
        {bars.map((height, index) => <div key={`${height}-${index}`} className="group flex h-full flex-1 items-end"><span className={cx("w-full rounded-t-md transition-colors group-hover:bg-brand", index === 9 ? "bg-brand" : "bg-white/15")} style={{ height: `${Math.round((height / 112) * 100)}%` }} /></div>)}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        {analyticsSummary.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-3 sm:p-4"><Icon aria-hidden="true" className="size-3.5 text-[#e6b65f]" /><p className="mt-3 text-[7px] font-bold uppercase tracking-wider text-white/40 sm:text-[8px]">{label}</p><p className="mt-1 text-xs font-bold sm:text-lg">{value}</p></div>
        ))}
      </div>
    </div>
  );
}

const integrations: Array<{ label: string; icon: LucideIcon; position: string; comingSoon?: boolean }> = [
  { label: "Google", icon: Globe2, position: "left-[6%] top-[14%] sm:left-[2%]" },
  { label: "Instagram", icon: Sparkles, position: "right-[2%] top-[13%]" },
  { label: "Delivery", icon: ShoppingBag, position: "bottom-[8%] left-[5%]" },
  { label: "POS / iiko", icon: Utensils, position: "bottom-[3%] right-[8%]", comingSoon: true },
  { label: "Maps", icon: MapPin, position: "right-[-1%] top-[47%]" },
];

export function IntegrationsVisual() {
  return (
    <div className="relative mx-auto grid min-h-[330px] max-w-xl place-items-center sm:min-h-[390px]">
      <div className="absolute size-72 rounded-full border border-dashed border-ink/15 sm:size-[360px]" /><div className="absolute size-48 rounded-full border border-ink/[0.08] sm:size-60" />
      <div className="relative z-10 grid size-28 place-items-center rounded-[32px] bg-night text-center text-white shadow-float sm:size-36"><div><span className="mx-auto grid size-9 place-items-center rounded-xl bg-brand sm:size-11"><Sparkles aria-hidden="true" className="size-4 sm:size-5" /></span><p className="mt-2 text-xs font-extrabold tracking-tight sm:text-sm">Menurio</p></div></div>
      {integrations.map(({ label, icon: Icon, position, comingSoon }) => (
        <div key={label} className={cx("absolute flex items-center gap-2 rounded-2xl border border-line bg-white px-3 py-2.5 text-[9px] font-bold shadow-soft sm:px-4 sm:py-3 sm:text-xs", position)}>
          <span className="grid size-7 place-items-center rounded-lg bg-cream text-brand sm:size-8"><Icon aria-hidden="true" className="size-3.5" /></span>{label}
          {comingSoon ? <span className="rounded-full bg-cream px-1.5 py-0.5 text-[6px] uppercase text-muted">Soon</span> : <Check aria-hidden="true" className="size-3 text-success" />}
        </div>
      ))}
    </div>
  );
}
