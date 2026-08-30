import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Sparkles } from "lucide-react";

import { MarketingV2Shell } from "@/components/marketing-v2/shell";
import {
  AnalyticsVisual,
  IntegrationsVisual,
  MenuPhoneVisual,
  OrdersVisual,
  WebsiteVisual,
} from "@/components/marketing-v2/visuals";
import { buttonStyles, cx } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  type MarketingFeature,
  marketingFeatures,
} from "@/data/marketing-features";

function FeatureCanvas({ feature }: { feature: MarketingFeature }) {
  const Icon = feature.icon;

  return (
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[30px] border border-line bg-surface p-5 shadow-float sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-brand/15 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-night text-white">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand">Menurio</p>
              <p className="mt-0.5 text-sm font-bold text-ink">{feature.name}</p>
            </div>
          </div>
          <span className="rounded-full bg-success/10 px-3 py-1.5 text-[9px] font-bold text-success">Ready to customize</span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {feature.benefits.map((benefit, index) => (
            <div key={benefit} className={cx("rounded-2xl p-4", index === 0 ? "bg-night text-white" : "bg-cream") }>
              <span className={cx("grid size-7 place-items-center rounded-full text-[10px] font-extrabold", index === 0 ? "bg-white/10 text-[#e6b65f]" : "bg-white text-brand")}>0{index + 1}</span>
              <p className={cx("mt-6 text-xs font-bold leading-5", index === 0 ? "text-white" : "text-ink")}>{benefit}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-brand/15 bg-brand/[0.055] px-4 py-3 text-xs font-bold text-ink">
          <span>Designed for the guest journey</span>
          <ArrowUpRight aria-hidden="true" className="size-4 text-brand" />
        </div>
      </div>
    </div>
  );
}

function FeatureVisual({ feature }: { feature: MarketingFeature }) {
  switch (feature.visual) {
    case "website":
      return <WebsiteVisual />;
    case "qr-menu":
      return <div className="rounded-[30px] bg-night px-2 py-4 shadow-float"><MenuPhoneVisual /></div>;
    case "orders":
      return <OrdersVisual />;
    case "analytics":
      return <div className="rounded-[30px] bg-[#282d27] p-3 shadow-float sm:p-5"><AnalyticsVisual /></div>;
    case "integrations":
      return <IntegrationsVisual />;
    default:
      return <FeatureCanvas feature={feature} />;
  }
}

function FeatureCard({ feature, compact = false }: { feature: MarketingFeature; compact?: boolean }) {
  const Icon = feature.icon;

  return (
    <Link
      href={`/features/${feature.slug}`}
      className={cx(
        "group flex h-full flex-col rounded-[26px] border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-soft sm:p-7",
        compact && "p-5 sm:p-6",
      )}
    >
      <span className="grid size-11 place-items-center rounded-2xl bg-brand/[0.09] text-brand">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <p className="mt-7 text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand">{feature.eyebrow}</p>
      <h3 className="display-font mt-2 text-2xl font-semibold tracking-[-0.035em] text-ink">{feature.name}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{feature.description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-brand">
        Explore feature
        <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function MarketingFeaturesIndexPage() {
  return (
    <MarketingV2Shell homeHref="/">
      <section className="relative overflow-hidden border-b border-line py-16 sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="pointer-events-none absolute left-1/2 top-[-18rem] size-[38rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[100px]" />
        <div className="site-container relative text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.07] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand sm:text-xs">
            <Sparkles aria-hidden="true" className="size-3.5" />Built for hospitality
          </div>
          <h1 className="display-font text-balance mx-auto mt-7 max-w-3xl text-4xl leading-[1.02] font-semibold tracking-[-0.045em] text-ink sm:text-6xl lg:text-7xl">
            Every part of your restaurant&apos;s digital front door.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Start with the essentials today, then add the tools that match the way your restaurant grows.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 lg:py-28">
        <div className="site-container">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {marketingFeatures.map((feature) => <FeatureCard key={feature.slug} feature={feature} />)}
          </div>
        </div>
      </section>

      <section className="px-4 pb-4 sm:px-8 sm:pb-8">
        <div className="noise-overlay relative mx-auto max-w-[1440px] overflow-hidden rounded-[30px] bg-night px-5 py-16 text-center text-white sm:rounded-[40px] sm:px-10 sm:py-20">
          <div className="relative mx-auto max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#e6b65f]">12 months free</p>
            <h2 className="display-font text-balance mt-5 text-4xl leading-[1.02] font-semibold tracking-[-0.045em] sm:text-6xl">Build your first version now. Keep growing it later.</h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-white/70 sm:text-base">One platform for the restaurant you run today and the operational needs you will add next.</p>
            <Link href="/onboarding" className={buttonStyles({ size: "lg", className: "mt-8 bg-brand text-white hover:bg-brand-deep" })}>
              Create Your Restaurant — Free
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingV2Shell>
  );
}

export function MarketingFeaturePage({ feature }: { feature: MarketingFeature }) {
  const Icon = feature.icon;
  const relatedFeatures = marketingFeatures.filter((item) => item.slug !== feature.slug).slice(0, 3);

  return (
    <MarketingV2Shell homeHref="/">
      <section className="relative overflow-hidden border-b border-line py-14 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="pointer-events-none absolute right-[-12rem] top-0 size-[32rem] rounded-full bg-brand/10 blur-[100px]" />
        <div className="site-container relative grid items-center gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.07] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand sm:text-xs">
              <Icon aria-hidden="true" className="size-3.5" />{feature.eyebrow}
            </div>
            <h1 className="display-font text-balance mt-7 max-w-xl text-4xl leading-[1.02] font-semibold tracking-[-0.045em] text-ink sm:text-6xl lg:text-[4.35rem]">
              {feature.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{feature.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/onboarding" className={buttonStyles({ size: "lg", className: "w-full sm:w-auto" })}>
                Create Your Restaurant — Free
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link href="/r/demo-restaurant" className={buttonStyles({ variant: "secondary", size: "lg", className: "w-full sm:w-auto" })}>
                View live demo
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
          <FeatureVisual feature={feature} />
        </div>
      </section>

      <section className="bg-cream/55 py-16 sm:py-20 lg:py-24">
        <div className="site-container grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <SectionHeading eyebrow="What it gives you" title="Built around real restaurant decisions." />
          <ul className="grid content-start gap-3 sm:grid-cols-3">
            {feature.benefits.map((benefit) => (
              <li key={benefit} className="rounded-2xl border border-line bg-surface p-5 text-sm font-bold leading-6 text-ink">
                <span className="mb-5 grid size-7 place-items-center rounded-full bg-success/10 text-success"><Check aria-hidden="true" className="size-3.5" strokeWidth={3} /></span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 sm:py-28 lg:py-32">
        <div className="site-container">
          <SectionHeading eyebrow="How it comes together" title="Simple to begin. Ready to grow with you." align="center" />
          <div className="relative mx-auto mt-12 grid max-w-5xl gap-4 lg:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-10 hidden border-t border-dashed border-brand/25 lg:block" />
            {feature.steps.map((step, index) => (
              <article key={step.title} className="relative rounded-[26px] border border-line bg-surface p-6 shadow-[0_8px_35px_rgba(41,34,25,.04)] sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="relative z-10 grid size-12 place-items-center rounded-2xl bg-night text-sm font-extrabold text-white">0{index + 1}</span>
                  <Icon aria-hidden="true" className="size-5 text-brand/40" />
                </div>
                <h2 className="display-font mt-8 text-2xl font-semibold tracking-[-0.03em] text-ink">{step.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-cream/55 py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Keep exploring" title="More ways to make Menurio yours." />
            <Link href="/features" className="group inline-flex items-center gap-2 text-sm font-extrabold text-brand">All features<ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" /></Link>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {relatedFeatures.map((relatedFeature) => <FeatureCard key={relatedFeature.slug} feature={relatedFeature} compact />)}
          </div>
        </div>
      </section>

      <section className="px-4 pb-4 pt-16 sm:px-8 sm:pb-8 sm:pt-20">
        <div className="noise-overlay relative mx-auto max-w-[1440px] overflow-hidden rounded-[30px] bg-brand px-5 py-16 text-center text-white sm:rounded-[40px] sm:px-10 sm:py-20">
          <div className="relative mx-auto max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/65">12 months free</p>
            <h2 className="display-font text-balance mt-5 text-4xl leading-[1.02] font-semibold tracking-[-0.045em] sm:text-6xl">Put your restaurant in good hands online.</h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-white/75 sm:text-base">Start with the digital essentials, then shape the platform around your service.</p>
            <Link href="/onboarding" className={buttonStyles({ variant: "dark", size: "lg", className: "mt-8" })}>
              Create Your Restaurant — Free
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingV2Shell>
  );
}
