"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ImagePlus,
  Laptop,
  Monitor,
  Palette,
  RotateCcw,
  Smartphone,
  Sparkles,
  Upload,
} from "lucide-react";
import { cx } from "@/components/ui/button";
import { dashboardThemes } from "./dashboard-data";
import {
  DashboardButton,
  PageHeader,
  Panel,
  PrototypeNotice,
  SectionTitle,
  StatusPill,
} from "./dashboard-ui";

type PreviewSize = "desktop" | "tablet" | "mobile";
type MenuStyle = "cards" | "list" | "editorial";

const colorPresets = ["#D95532", "#8D3D32", "#66715C", "#B79557", "#3F526B", "#252525"];
const coverOptions = ["/images/avena-interior.png", "/images/manti.png", "/images/trout.png"];

function ThemeThumb({ themeId }: { themeId: string }) {
  const palettes: Record<string, [string, string, string]> = {
    editorial: ["#f7f0e5", "#d95532", "#282620"],
    nocturne: ["#1f211f", "#b79557", "#f1eadc"],
    garden: ["#edf1e9", "#66715c", "#313c2d"],
    atelier: ["#f6f6f3", "#252525", "#d9d8d0"],
  };
  const [background, accent, ink] = palettes[themeId] || palettes.editorial!;
  return (
    <div className="relative h-24 overflow-hidden rounded-xl" style={{ background }}>
      <span className="absolute left-3 top-3 h-2 w-12 rounded-full" style={{ background: ink, opacity: 0.82 }} />
      <span className="absolute right-3 top-3 size-2 rounded-full" style={{ background: accent }} />
      <div className="absolute inset-x-3 bottom-3 grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((item) => <span key={item} className="aspect-[4/3] rounded-md" style={{ background: item === 1 ? accent : ink, opacity: item === 1 ? 0.75 : 0.12 }} />)}
      </div>
    </div>
  );
}

function MenuPreview({
  size,
  color,
  font,
  cover,
  logo,
  menuStyle,
  themeId,
}: {
  size: PreviewSize;
  color: string;
  font: string;
  cover: string;
  logo: string | null;
  menuStyle: MenuStyle;
  themeId: string;
}) {
  const dark = themeId === "nocturne";
  const fontFamily = font === "Fraunces" ? "var(--font-display), Georgia, serif" : font === "Serif" ? "Georgia, serif" : "var(--font-sans), Arial, sans-serif";
  const widths = { desktop: "w-full", tablet: "w-[78%]", mobile: "w-[340px] max-w-full" };
  const products = [
    { name: "Market Burrata", copy: "Tomatoes, basil oil, toasted lavash", price: "4,900 ֏", image: "/images/burrata.png" },
    { name: "Lamb Manti", copy: "Garlic yogurt, paprika butter, herbs", price: "5,600 ֏", image: "/images/manti.png" },
    { name: "Apricot Pavlova", copy: "Mountain honey, pistachio, soft cream", price: "3,200 ֏", image: "/images/pavlova.png" },
  ];

  return (
    <div className={cx("mx-auto overflow-hidden rounded-[20px] shadow-[0_28px_80px_rgba(20,20,18,.2)] transition-[width] duration-500", widths[size], dark ? "bg-[#1f211f] text-[#f3eee4]" : "bg-[#faf8f3] text-[#252522]")} style={{ fontFamily }}>
      <div className="relative h-36 overflow-hidden sm:h-44">
        <Image src={cover} alt="Avena restaurant cover preview" fill className="object-cover" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/10" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 text-white">
          <div className="flex items-center gap-2">
            {logo ? <span className="relative block size-7 overflow-hidden rounded-lg bg-[#fff]"><Image src={logo} alt="Logo preview" fill unoptimized={logo.startsWith("data:")} className="object-cover" /></span> : <span className="grid size-7 place-items-center rounded-lg text-xs font-bold text-white" style={{ background: color }}>A</span>}
            <span className="text-xs font-semibold tracking-tight">AVENA</span>
          </div>
          <div className="flex gap-3 text-[9px] font-semibold"><span>Story</span><span>Menu</span><span>Visit</span></div>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
          <span className="rounded-full bg-white/15 px-2 py-1 text-[8px] font-bold uppercase tracking-widest backdrop-blur">Open until 23:00</span>
          <h3 className="mt-2 text-2xl font-semibold leading-none tracking-[-0.04em] sm:text-3xl">Avena Yerevan</h3>
          <p className="mt-1 text-[9px] text-white/70">Armenian soul, Mediterranean rhythm</p>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="no-scrollbar flex gap-2 overflow-x-auto border-b pb-3 text-[9px] font-semibold" style={{ borderColor: dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)" }}>
          {["Featured", "Small plates", "Mains", "Desserts"].map((item, index) => <span key={item} className="shrink-0 rounded-full px-2.5 py-1.5" style={index === 0 ? { background: color, color: "white" } : { background: dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.045)" }}>{item}</span>)}
        </div>
        <div className="mb-3 mt-4 flex items-end justify-between"><div><p className="text-[8px] font-bold uppercase tracking-[.18em]" style={{ color }}>Chef’s selection</p><p className="mt-1 text-lg font-semibold tracking-[-0.03em]">Made for the table</p></div><span className="text-[9px] opacity-45">6 dishes</span></div>
        <div className={cx(menuStyle === "cards" ? "grid grid-cols-2 gap-2 sm:grid-cols-3" : "space-y-2")}>
          {products.map((product, index) => (
            <article key={product.name} className={cx("overflow-hidden", menuStyle === "cards" ? "rounded-xl" : "flex items-center gap-3 border-b pb-2 last:border-0", dark ? "border-white/10 bg-white/[0.035]" : "border-black/10 bg-[#fff]")}>
              <div className={cx("relative shrink-0 overflow-hidden", menuStyle === "cards" ? "aspect-[4/3] w-full" : menuStyle === "editorial" ? "size-16 rounded-lg" : "size-12 rounded-lg")}><Image src={product.image} alt="" fill className="object-cover" /></div>
              <div className={cx(menuStyle === "cards" ? "p-2.5" : "min-w-0 flex-1 py-1")}>
                <div className="flex items-start justify-between gap-2"><p className="truncate text-[10px] font-semibold sm:text-[11px]">{product.name}</p>{menuStyle !== "cards" ? <span className="shrink-0 text-[9px] font-bold" style={{ color }}>{product.price}</span> : null}</div>
                <p className={cx("mt-1 truncate text-[8px] leading-3 opacity-50", menuStyle === "editorial" && "sm:text-[9px]")}>{product.copy}</p>
                {menuStyle === "cards" ? <p className="mt-2 text-[9px] font-bold" style={{ color }}>{product.price}</p> : null}
              </div>
              {index === 0 && menuStyle !== "cards" ? <span className="mr-1 grid size-5 shrink-0 place-items-center rounded-full text-white" style={{ background: color }}>+</span> : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ThemeStudio() {
  const [themeId, setThemeId] = useState("editorial");
  const [color, setColor] = useState("#D95532");
  const [font, setFont] = useState("Fraunces");
  const [cover, setCover] = useState(coverOptions[0]!);
  const [menuStyle, setMenuStyle] = useState<MenuStyle>("cards");
  const [previewSize, setPreviewSize] = useState<PreviewSize>("desktop");
  const [logo, setLogo] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const logoInput = useRef<HTMLInputElement>(null);

  function chooseTheme(id: string) {
    const theme = dashboardThemes.find((item) => item.id === id);
    if (!theme) return;
    setThemeId(id);
    setColor(theme.color);
    setFont(theme.font);
    setMenuStyle(theme.style.toLowerCase().includes("list") ? "list" : theme.style.toLowerCase().includes("grid") ? "cards" : "editorial");
    setCover(theme.image);
    setSaved(false);
  }

  function uploadLogo(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" && setLogo(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Brand experience"
        title="Theme studio"
        description="Shape every guest touchpoint with a restaurant identity that feels completely your own."
        actions={
          <>
            <DashboardButton variant="light" onClick={() => chooseTheme("editorial")}><RotateCcw className="size-3.5" /> Reset</DashboardButton>
            <DashboardButton variant={saved ? "light" : "brand"} onClick={() => setSaved(true)}>{saved ? <Check className="size-4 text-success" /> : <Sparkles className="size-4" />}{saved ? "Design saved" : "Save design"}</DashboardButton>
          </>
        }
      />

      <div className="mt-6 grid min-w-0 gap-4 xl:grid-cols-[350px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Panel className="p-4">
            <SectionTitle title="Choose a foundation" description="Each theme can be fully customized" />
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {dashboardThemes.map((theme) => (
                <button key={theme.id} type="button" onClick={() => chooseTheme(theme.id)} className={cx("rounded-2xl border p-2 text-left transition", themeId === theme.id ? "border-brand bg-brand/5 ring-2 ring-brand/10" : "border-line bg-surface hover:border-brand/45")}>
                  <ThemeThumb themeId={theme.id} />
                  <div className="mt-2.5 flex items-center justify-between gap-1 px-1"><div className="min-w-0"><p className="truncate text-xs font-semibold text-ink">{theme.name}</p><p className="mt-0.5 truncate text-[9px] text-muted">{theme.description}</p></div>{themeId === theme.id ? <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand text-white"><Check className="size-3" /></span> : null}</div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <div className="border-b border-line p-4"><SectionTitle title="Brand settings" description="Fine-tune the details" /></div>
            <div className="divide-y divide-line">
              <div className="p-4">
                <div className="flex items-center justify-between"><div><p className="text-xs font-semibold">Restaurant logo</p><p className="mt-1 text-[10px] text-muted">Square PNG or SVG works best</p></div><button type="button" onClick={() => logoInput.current?.click()} className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-[10px] font-semibold transition hover:border-brand">{logo ? <span className="relative block size-6 overflow-hidden rounded-md"><Image src={logo} alt="Uploaded logo" fill unoptimized className="object-cover" /></span> : <Upload className="size-3.5" />}{logo ? "Replace" : "Upload"}</button></div>
                <input ref={logoInput} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={(event) => uploadLogo(event.target.files?.[0])} />
              </div>
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between"><div><p className="text-xs font-semibold">Brand color</p><p className="mt-1 text-[10px] text-muted">Buttons, highlights and links</p></div><label className="flex h-9 items-center gap-2 rounded-xl border border-line bg-surface px-2"><input type="color" value={color} onChange={(event) => { setColor(event.target.value); setSaved(false); }} className="size-5 cursor-pointer appearance-none overflow-hidden rounded-md border-0 bg-transparent p-0" /><span className="text-[10px] font-semibold uppercase text-muted">{color}</span></label></div>
                <div className="flex items-center gap-2">{colorPresets.map((preset) => <button key={preset} type="button" aria-label={`Use color ${preset}`} onClick={() => setColor(preset)} className={cx("grid size-8 place-items-center rounded-full border-2 transition", color.toLowerCase() === preset.toLowerCase() ? "border-ink" : "border-transparent")}><span className="size-5 rounded-full shadow-sm" style={{ background: preset }} /> </button>)}</div>
              </div>
              <div className="p-4">
                <label className="mb-2 block text-xs font-semibold">Font style</label>
                <div className="relative"><select value={font} onChange={(event) => setFont(event.target.value)} className="h-11 w-full appearance-none rounded-xl border border-line bg-surface px-3.5 text-xs font-semibold text-ink outline-none focus:border-brand"><option>Fraunces</option><option>DM Sans</option><option>Serif</option></select><ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" /></div>
              </div>
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between"><div><p className="text-xs font-semibold">Cover image</p><p className="mt-1 text-[10px] text-muted">Set the mood before guests scroll</p></div><ImagePlus className="size-4 text-muted" /></div>
                <div className="grid grid-cols-3 gap-2">{coverOptions.map((image) => <button key={image} type="button" onClick={() => setCover(image)} className={cx("relative aspect-[4/3] overflow-hidden rounded-xl border-2", cover === image ? "border-brand" : "border-transparent")}><Image src={image} alt="Cover option" fill className="object-cover" />{cover === image ? <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-brand text-white"><Check className="size-3" /></span> : null}</button>)}</div>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold">Menu style</p><p className="mt-1 text-[10px] text-muted">Choose how products are presented</p>
                <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-cream p-1">{(["cards", "list", "editorial"] as const).map((style) => <button key={style} type="button" onClick={() => setMenuStyle(style)} className={cx("rounded-lg px-2 py-2 text-[10px] font-semibold capitalize transition", menuStyle === style ? "bg-surface text-ink shadow-sm" : "text-muted")}>{style}</button>)}</div>
              </div>
            </div>
          </Panel>
          <PrototypeNotice />
        </div>

        <Panel className="min-w-0 overflow-hidden bg-cream">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-xl bg-cream"><Palette className="size-4 text-muted" /></span><div><p className="text-xs font-semibold">Live preview</p><p className="mt-0.5 text-[9px] text-muted">Changes appear instantly</p></div></div>
            <div className="flex items-center rounded-xl bg-cream p-1">{([{ id: "desktop", icon: Monitor }, { id: "tablet", icon: Laptop }, { id: "mobile", icon: Smartphone }] as const).map(({ id, icon: Icon }) => <button key={id} type="button" aria-label={`${id} preview`} onClick={() => setPreviewSize(id)} className={cx("grid size-8 place-items-center rounded-lg transition", previewSize === id ? "bg-surface text-ink shadow-sm" : "text-muted")}><Icon className="size-3.5" /></button>)}</div>
          </div>
          <div className="no-scrollbar min-h-[720px] overflow-auto p-4 sm:p-7 lg:p-10">
            <MenuPreview size={previewSize} color={color} font={font} cover={cover} logo={logo} menuStyle={menuStyle} themeId={themeId} />
          </div>
          <div className="flex items-center justify-between border-t border-line bg-surface px-4 py-3 text-[10px] text-muted sm:px-5"><span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-success" /> Preview synced</span><StatusPill tone="neutral">{previewSize}</StatusPill></div>
        </Panel>
      </div>
    </div>
  );
}
