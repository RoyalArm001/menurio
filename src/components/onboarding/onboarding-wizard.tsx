"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Globe2,
  ImagePlus,
  Languages,
  LayoutGrid,
  Palette,
  Plus,
  QrCode,
  Rocket,
  Store,
  Upload,
} from "lucide-react";
import { BrandMark, Wordmark } from "@/components/brand/wordmark";
import { Button, cx } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { products } from "@/data/mock";
import { QrPreview } from "./qr-preview";

const steps = [
  { title: "Restaurant information", short: "Information", icon: Store },
  { title: "Logo and branding", short: "Branding", icon: Palette },
  { title: "Menu", short: "Menu", icon: LayoutGrid },
  { title: "Languages", short: "Languages", icon: Languages },
  { title: "Generate QR", short: "QR code", icon: QrCode },
  { title: "Publish", short: "Publish", icon: Rocket },
];

const fieldClass =
  "mt-2 h-12 w-full rounded-xl border border-ink/12 bg-white px-4 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/60 focus:border-brand/50 focus:ring-4 focus:ring-brand/10";

function StepHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="mb-8">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
      <h1 className="display-font text-balance text-4xl leading-[1.05] font-semibold tracking-[-0.04em] sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base">{description}</p>
    </header>
  );
}

function Field({ label, placeholder, defaultValue, type = "text" }: { label: string; placeholder?: string; defaultValue?: string; type?: string }) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <input className={fieldClass} type={type} placeholder={placeholder} defaultValue={defaultValue} />
    </label>
  );
}

export function OnboardingWizard() {
  const [current, setCurrent] = useState(0);
  const [brandColor, setBrandColor] = useState("#D95532");
  const [logoName, setLogoName] = useState("");
  const [menuItems, setMenuItems] = useState(products.slice(0, 2));
  const [languages, setLanguages] = useState(["English", "Armenian"]);
  const [published, setPublished] = useState(false);

  const progress = useMemo(() => ((current + 1) / steps.length) * 100, [current]);

  function goNext() {
    if (current === steps.length - 1) {
      setPublished(true);
      return;
    }
    setCurrent((value) => Math.min(value + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setCurrent((value) => Math.max(value - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleLanguage(language: string) {
    setLanguages((selected) =>
      selected.includes(language)
        ? selected.filter((item) => item !== language)
        : [...selected, language],
    );
  }

  return (
    <main className="theme-aware min-h-screen bg-paper lg:grid lg:grid-cols-[360px_1fr]">
      <aside className="relative hidden min-h-screen overflow-hidden bg-night p-8 text-white lg:flex lg:flex-col xl:p-10">
        <div className="absolute inset-0 dot-grid opacity-[0.06]" />
        <div className="relative flex items-center justify-between gap-3">
          <Wordmark light />
          <ThemeToggle inverse />
        </div>
        <div className="relative my-auto py-12">
          <p className="mb-8 text-xs font-bold uppercase tracking-[0.22em] text-white/40">Restaurant setup</p>
          <ol className="space-y-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const complete = index < current || published;
              const active = index === current && !published;
              return (
                <li key={step.title}>
                  <button
                    type="button"
                    onClick={() => !published && setCurrent(index)}
                    className={cx(
                      "flex w-full items-center gap-4 rounded-2xl px-3 py-3 text-left transition",
                      active ? "bg-white/10" : "hover:bg-white/[0.05]",
                    )}
                  >
                    <span className={cx("grid size-10 place-items-center rounded-xl border", complete ? "border-[#70b695] bg-[#70b695] text-ink" : active ? "border-brand bg-brand text-white" : "border-white/15 text-white/45")}>
                      {complete ? <Check className="size-4" /> : <Icon className="size-4" />}
                    </span>
                    <span>
                      <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">Step {index + 1}</span>
                      <span className={cx("mt-0.5 block text-sm font-semibold", active || complete ? "text-white" : "text-white/45")}>{step.title}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="relative rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-sm leading-6 text-white/60">
          Your draft saves automatically on this device. You can finish anytime.
        </div>
      </aside>

      <section className="flex min-h-screen flex-col">
        <div className="border-b border-ink/8 bg-paper/90 px-4 py-4 backdrop-blur-xl sm:px-8 lg:hidden">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
            <Wordmark compact />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <span className="text-xs font-bold text-muted">{current + 1} / {steps.length}</span>
            </div>
          </div>
          <div className="mx-auto mt-4 h-1 max-w-3xl overflow-hidden rounded-full bg-ink/8">
            <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16 xl:px-20">
          <div className="flex-1">
            {published ? (
              <PublishSuccess />
            ) : (
              <>
                {current === 0 && <RestaurantStep />}
                {current === 1 && (
                  <BrandStep
                    brandColor={brandColor}
                    setBrandColor={setBrandColor}
                    logoName={logoName}
                    setLogoName={setLogoName}
                  />
                )}
                {current === 2 && (
                  <MenuStep
                    menuItems={menuItems}
                    onAdd={() => setMenuItems((items) => [...items, products[2]])}
                  />
                )}
                {current === 3 && (
                  <LanguagesStep languages={languages} onToggle={toggleLanguage} />
                )}
                {current === 4 && <QrStep brandColor={brandColor} />}
                {current === 5 && <PublishStep brandColor={brandColor} languages={languages} menuCount={menuItems.length} />}
              </>
            )}
          </div>

          {!published ? (
            <footer className="mobile-safe-bottom sticky bottom-0 z-20 -mx-4 mt-10 flex items-center justify-between border-t border-ink/10 bg-paper/95 px-4 pt-4 shadow-[0_-14px_35px_rgba(0,0,0,.08)] backdrop-blur-xl sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:pt-6 sm:pb-0 sm:shadow-none">
              <Button variant="ghost" onClick={goBack} disabled={current === 0} className="-ml-3">
                <ArrowLeft className="size-4" /> Back
              </Button>
              <div className="hidden text-xs font-medium text-muted sm:block">Step {current + 1} of {steps.length}</div>
              <Button size="lg" onClick={goNext}>
                {current === steps.length - 1 ? "Publish restaurant" : "Continue"}
                {current === steps.length - 1 ? <Rocket className="size-4" /> : <ArrowRight className="size-4" />}
              </Button>
            </footer>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function RestaurantStep() {
  return (
    <div className="fade-up">
      <StepHeader eyebrow="Step 1 of 6" title="Tell us about your restaurant." description="Start with the essentials guests need to discover and contact you. You can change everything later." />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2"><Field label="Restaurant name" defaultValue="Avena" /></div>
        <Field label="Restaurant type" defaultValue="Restaurant" />
        <Field label="City" defaultValue="Yerevan" />
        <div className="sm:col-span-2"><Field label="Street address" defaultValue="12 Abovyan Street" /></div>
        <Field label="Phone" defaultValue="+374 10 58 18 18" type="tel" />
        <Field label="Instagram" defaultValue="@avena.yerevan" />
      </div>
      <div className="mt-6 rounded-2xl border border-brand/15 bg-brand/[0.055] p-4 text-sm leading-6 text-ink/75">
        <span className="font-bold text-ink">Tip:</span> Keep your public name short. You can add a longer SEO description after publishing.
      </div>
    </div>
  );
}

function BrandStep({ brandColor, setBrandColor, logoName, setLogoName }: { brandColor: string; setBrandColor: (value: string) => void; logoName: string; setLogoName: (value: string) => void }) {
  const colors = ["#D95532", "#66715C", "#20201D", "#A76B44", "#6D4773"];
  return (
    <div className="fade-up">
      <StepHeader eyebrow="Step 2 of 6" title="Make it unmistakably yours." description="Add a logo and choose a signature color. We will apply it across your website, menu, and QR materials." />
      <div className="grid gap-6 md:grid-cols-[1fr_1.1fr]">
        <div>
          <label className="group grid min-h-56 place-items-center rounded-3xl border border-dashed border-ink/20 bg-white p-6 text-center shadow-sm transition hover:border-brand/50 hover:bg-brand/[0.025]">
            <input type="file" accept="image/*" className="sr-only" onChange={(event) => setLogoName(event.target.files?.[0]?.name ?? "")} />
            <span>
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-cream text-brand"><Upload className="size-5" /></span>
              <span className="mt-4 block font-bold">{logoName || "Upload your logo"}</span>
              <span className="mt-1 block text-xs leading-5 text-muted">PNG, JPG, or SVG · up to 5 MB</span>
            </span>
          </label>
          <p className="mt-5 text-sm font-bold">Brand color</p>
          <div className="mt-3 flex items-center gap-3">
            {colors.map((color) => (
              <button key={color} type="button" aria-label={`Use ${color}`} onClick={() => setBrandColor(color)} className={cx("size-10 rounded-full border-4 border-white shadow-sm ring-2 transition hover:scale-110", brandColor === color ? "ring-ink" : "ring-transparent")} style={{ backgroundColor: color }} />
            ))}
            <label className="grid size-10 place-items-center rounded-full border border-ink/12 bg-white text-muted shadow-sm" aria-label="Choose a custom brand color">
              <Plus className="size-4" />
              <input className="sr-only" type="color" value={brandColor} onChange={(event) => setBrandColor(event.target.value)} />
            </label>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-soft">
          <div className="relative h-48">
            <Image src="/images/avena-interior.png" alt="Avena dining room preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 420px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 flex items-end gap-3 text-white">
              <span className="grid size-11 place-items-center rounded-full border border-white/30 bg-white/15 font-serif text-xl backdrop-blur"><span>A</span></span>
              <div><p className="text-lg font-bold">Avena</p><p className="text-xs text-white/70">Yerevan · Open now</p></div>
            </div>
          </div>
          <div className="p-5">
            <div className="flex gap-2"><span className="h-8 flex-1 rounded-lg" style={{ backgroundColor: brandColor }} /><span className="h-8 flex-1 rounded-lg bg-cream" /><span className="h-8 flex-1 rounded-lg bg-night" /></div>
            <p className="mt-4 text-xs font-semibold text-muted">Live brand preview</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuStep({ menuItems, onAdd }: { menuItems: typeof products; onAdd: () => void }) {
  return (
    <div className="fade-up">
      <StepHeader eyebrow="Step 3 of 6" title="Add your first menu items." description="Start small or add everything now. Your menu stays editable after launch." />
      <div className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white px-4 py-3 shadow-sm">
        <div><p className="font-bold">Dinner menu</p><p className="text-xs text-muted">{menuItems.length} products · 2 categories</p></div>
        <button type="button" className="text-sm font-bold text-brand">Rename</button>
      </div>
      <div className="mt-4 space-y-3">
        {menuItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-3 shadow-sm">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl"><Image src={item.image} alt="" fill className="object-cover" sizes="64px" /></div>
            <div className="min-w-0 flex-1"><p className="truncate font-bold">{item.name}</p><p className="mt-1 text-xs text-muted">{item.price.toLocaleString()} ֏ · Available</p></div>
            <ChevronRight className="size-4 text-muted" />
          </div>
        ))}
      </div>
      <button type="button" onClick={onAdd} disabled={menuItems.length >= 3} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-ink/20 bg-surface/55 py-5 text-sm font-bold text-ink transition hover:border-brand/40 hover:text-brand disabled:opacity-45">
        <ImagePlus className="size-4" /> {menuItems.length >= 3 ? "Sample product added" : "Add a sample product"}
      </button>
    </div>
  );
}

function LanguagesStep({ languages, onToggle }: { languages: string[]; onToggle: (language: string) => void }) {
  const options = [
    ["English", "EN", "English"], ["Armenian", "HY", "Հայերեն"], ["Russian", "RU", "Русский"], ["French", "FR", "Français"],
  ];
  return (
    <div className="fade-up">
      <StepHeader eyebrow="Step 4 of 6" title="Welcome every guest." description="Choose the languages your website and menu will support. English is the default for this preview." />
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map(([language, code, local]) => {
          const selected = languages.includes(language);
          return (
            <button key={language} type="button" onClick={() => onToggle(language)} className={cx("flex items-center gap-4 rounded-2xl border bg-white p-4 text-left shadow-sm transition", selected ? "border-brand ring-4 ring-brand/8" : "border-ink/10 hover:border-ink/25")}>
              <span className={cx("grid size-11 place-items-center rounded-xl text-xs font-black", selected ? "bg-brand text-white" : "bg-cream text-muted")}>{code}</span>
              <span className="flex-1"><span className="block font-bold">{language}</span><span className="block text-xs text-muted">{local}</span></span>
              <span className={cx("grid size-6 place-items-center rounded-full border", selected ? "border-brand bg-brand text-white" : "border-ink/15 text-transparent")}><Check className="size-3.5" /></span>
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex gap-3 rounded-2xl bg-cream p-4 text-sm leading-6 text-muted"><Globe2 className="mt-0.5 size-5 shrink-0 text-olive" /><p>Translations can be entered manually or imported later. Guests will see only languages you publish.</p></div>
    </div>
  );
}

function QrStep({ brandColor }: { brandColor: string }) {
  return (
    <div className="fade-up">
      <StepHeader eyebrow="Step 5 of 6" title="Your menu, one scan away." description="This permanent QR will keep working even if you rename your restaurant or connect a custom domain later." />
      <div className="grid items-center gap-8 rounded-[2rem] border border-ink/10 bg-white p-5 shadow-soft sm:p-8 md:grid-cols-[280px_1fr]">
        <div className="mx-auto w-full max-w-[280px] rounded-[2rem] border border-ink/10 p-4 shadow-lg"><QrPreview color={brandColor} /><div className="mt-3 flex items-center justify-center gap-2"><BrandMark className="size-6" /><span className="display-font text-lg font-semibold">Avena</span></div></div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Permanent link</p>
          <p className="mt-2 rounded-xl bg-cream px-4 py-3 font-mono text-xs text-ink">menurio.store/q/AVN-24Y8</p>
          <div className="mt-5 space-y-3 text-sm text-muted">
            {["Works on every phone camera", "Updates when your menu changes", "Print-ready files available after publish"].map((item) => <p key={item} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" />{item}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function PublishStep({ brandColor, languages, menuCount }: { brandColor: string; languages: string[]; menuCount: number }) {
  const checks = [`Avena profile is complete`, `${menuCount} menu products added`, `${languages.length} languages selected`, "Permanent QR code generated"];
  return (
    <div className="fade-up">
      <StepHeader eyebrow="Step 6 of 6" title="Everything looks ready." description="Review your setup. Publishing will create the public restaurant preview; you can keep refining it from the dashboard." />
      <div className="grid gap-6 md:grid-cols-[1.15fr_.85fr]">
        <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-soft">
          <div className="relative h-52"><Image src="/images/avena-interior.png" alt="Avena website cover" fill className="object-cover" sizes="500px" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /><div className="absolute bottom-5 left-5 text-white"><p className="display-font text-3xl font-semibold">Avena</p><p className="text-xs text-white/70">Armenian soul, Mediterranean rhythm</p></div></div>
          <div className="flex items-center justify-between p-4"><div><p className="text-sm font-bold">avena.menurio.store</p><p className="text-xs text-muted">Website preview</p></div><span className="size-8 rounded-full" style={{ backgroundColor: brandColor }} /></div>
        </div>
        <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="font-bold">Launch checklist</p>
          <div className="mt-5 space-y-4">{checks.map((item) => <div key={item} className="flex items-center gap-3 text-sm"><span className="grid size-6 place-items-center rounded-full bg-success/10 text-success"><Check className="size-3.5" /></span>{item}</div>)}</div>
        </div>
      </div>
    </div>
  );
}

function PublishSuccess() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center py-8 text-center fade-up sm:py-16">
      <div className="relative grid size-24 place-items-center rounded-full bg-success/10 text-success"><Check className="size-10" /><span className="absolute inset-0 animate-ping rounded-full border border-success/20" /></div>
      <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-success">Published successfully</p>
      <h1 className="display-font mt-3 text-balance text-5xl leading-none font-semibold tracking-[-0.045em] sm:text-6xl">Avena is live.</h1>
      <p className="mt-5 max-w-lg text-base leading-7 text-muted">Your restaurant website, menu, and permanent QR preview are ready to share.</p>
      <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:flex-row">
        <Link href="/demo" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-bold text-white transition hover:bg-brand-deep">View restaurant <ArrowRight className="size-4" /></Link>
        <Link href="/studio-preview" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-6 text-sm font-bold text-ink transition hover:border-ink/30">Open dashboard</Link>
      </div>
    </div>
  );
}
