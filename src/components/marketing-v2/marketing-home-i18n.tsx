"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  LayoutTemplate,
  Palette,
  QrCode,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";
import { HeroVisual } from "@/components/marketing-v2/visuals";
import { HeroBackground } from "@/components/marketing-v2/hero-background";
import { buttonStyles, cx } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { useAppLanguage } from "@/hooks/use-app-language";
import { marketingHref } from "@/lib/i18n/marketing";
import { marketingFeatures } from "@/data/marketing-features";

const platformStepIcons = [LayoutTemplate, QrCode, Palette, ShoppingBag, BarChart3];
const STEP_INTERVAL_MS = 4500;

export function MarketingHomeHero() {
  const { lang, marketing: t } = useAppLanguage("en");

  return (
    <>
      <section className="relative overflow-hidden border-b border-line/70 pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
        <HeroBackground />
        <div className="site-container relative z-10 grid items-center gap-14 lg:grid-cols-[.86fr_1.14fr] lg:gap-14">
          <div className="fade-up max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.07] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand sm:text-xs">
              <Sparkles aria-hidden="true" className="size-3.5" />
              {t.heroBadge}
            </div>
            <h1 className="display-font text-balance mt-7 max-w-xl text-[2.7rem] leading-[0.98] font-semibold tracking-[-0.045em] text-ink sm:text-[3.8rem] lg:text-[4.5rem] xl:text-[5rem]">
              {t.heroTitle}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              {t.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/onboarding" className={buttonStyles({ size: "lg", className: "w-full sm:w-auto" })}>
                {t.heroCta}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href={marketingHref("/r/demo-restaurant", lang)}
                className={buttonStyles({ variant: "secondary", size: "lg", className: "w-full sm:w-auto" })}
              >
                {t.heroDemo}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted">
              {t.heroBullets.map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <Check aria-hidden="true" className="size-3.5 text-success" strokeWidth={3} />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="fade-up-delay">
            <HeroVisual />
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface" aria-label="Product promise">
        <div className="site-container grid grid-cols-2 py-6 sm:grid-cols-4 sm:divide-x sm:divide-line sm:py-8">
          {t.promiseStats.map(([label, value], index) => (
            <div
              key={label}
              className={cx(
                "px-3 first:pl-0 sm:px-7",
                index > 1 && "mt-6 border-t border-line pt-6 sm:mt-0 sm:border-t-0 sm:pt-0",
                index === 2 && "pl-0 sm:pl-7",
              )}
            >
              <p className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-brand sm:text-[10px]">
                {label}
              </p>
              <p className="mt-1.5 text-[11px] font-bold text-ink sm:text-sm">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function MarketingHomePlatformJourney() {
  const { marketing: t } = useAppLanguage("en");
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);

  const stepCount = t.platformSteps.length;

  const goToStep = useCallback(
    (index: number) => {
      setActiveStep((index + stepCount) % stepCount);
    },
    [stepCount],
  );

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % stepCount);
    }, STEP_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [paused, stepCount]);

  const active = t.platformSteps[activeStep];

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-cream/30 py-20 sm:py-28 lg:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="site-container">
        <SectionHeading
          eyebrow={t.platformJourney.eyebrow}
          title={t.platformJourney.title}
          description={t.platformJourney.description}
          align="center"
        />

        <div className="relative mt-14 lg:mt-20">
          <div
            aria-hidden="true"
            className="absolute left-[8%] right-[8%] top-10 hidden h-px bg-line lg:block"
          />

          <div className="grid gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-5 lg:gap-6">
            {t.platformSteps.map(({ title, description }, index) => {
              const Icon = platformStepIcons[index] ?? Store;
              const isActive = index === activeStep;

              return (
                <button
                  key={title}
                  type="button"
                  onClick={() => goToStep(index)}
                  aria-current={isActive ? "step" : undefined}
                  className={cx(
                    "group relative flex flex-col items-center text-center transition-opacity duration-500",
                    isActive ? "opacity-100" : "opacity-45 hover:opacity-80",
                  )}
                >
                  <div className="relative z-10 mb-6">
                    <div
                      className={cx(
                        "grid size-[4.5rem] place-items-center rounded-2xl border bg-surface shadow-[0_4px_24px_rgba(41,34,25,.06)] transition-all duration-500 sm:size-20",
                        isActive
                          ? "-translate-y-1 border-brand/45 shadow-[0_8px_32px_rgba(150,105,31,.16)]"
                          : "border-line/80 group-hover:-translate-y-0.5",
                      )}
                    >
                      <Icon
                        aria-hidden="true"
                        className={cx(
                          "size-8 sm:size-9",
                          isActive ? "text-brand" : "text-brand/70",
                        )}
                        strokeWidth={1.75}
                      />
                    </div>
                    <span
                      className={cx(
                        "absolute -right-2 -top-2 grid size-7 place-items-center rounded-full text-xs font-bold text-white shadow-md ring-4 transition-colors duration-500",
                        isActive ? "bg-brand ring-cream/30" : "bg-brand/70 ring-cream/20",
                      )}
                    >
                      {index + 1}
                    </span>
                  </div>

                  <h3
                    className={cx(
                      "display-font text-lg font-semibold tracking-[-0.02em] sm:text-xl",
                      isActive ? "text-ink" : "text-ink/80",
                    )}
                  >
                    {title}
                  </h3>
                  <p className="mt-2 max-w-[14rem] text-sm leading-6 text-muted">{description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div
          key={activeStep}
          className="fade-up mx-auto mt-12 max-w-3xl rounded-[28px] border border-line/80 bg-surface p-6 text-center shadow-soft sm:p-8"
        >
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand">
            {t.platformJourney.eyebrow} · {activeStep + 1}/{stepCount}
          </p>
          <h4 className="display-font mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
            {active.title}
          </h4>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted sm:text-base">
            {active.description}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {active.features.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand/15 bg-brand/[0.07] px-3 py-1.5 text-xs font-bold text-brand"
              >
                <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {t.platformSteps.map((step, index) => (
            <button
              key={step.title}
              type="button"
              aria-label={`${index + 1}. ${step.title}`}
              onClick={() => goToStep(index)}
              className={cx(
                "h-2 rounded-full transition-all duration-500",
                index === activeStep ? "w-8 bg-brand" : "w-2 bg-line hover:bg-brand/35",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function MarketingHomeFinalCta() {
  const { lang, marketing: t } = useAppLanguage("en");

  return (
    <section id="story" className="scroll-mt-24 px-4 pb-4 sm:px-8 sm:pb-8">
      <div className="noise-overlay relative mx-auto max-w-[1440px] overflow-hidden rounded-[30px] bg-brand px-5 py-16 text-center text-white sm:rounded-[40px] sm:px-10 sm:py-24 lg:py-28">
        <div className="relative mx-auto max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/65">
            {t.finalCta.eyebrow}
          </p>
          <h2 className="display-font text-balance mt-5 text-4xl leading-[1.02] font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            {t.finalCta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
            {t.finalCta.subtitle}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/onboarding"
              className={buttonStyles({ variant: "dark", size: "lg", className: "w-full sm:w-auto" })}
            >
              {t.finalCta.primary}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              href={marketingHref("/r/demo-restaurant", lang)}
              className={buttonStyles({
                variant: "secondary",
                size: "lg",
                className: "w-full border-white/25 bg-white/10 text-white hover:bg-white hover:text-ink sm:w-auto",
              })}
            >
              {t.finalCta.secondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MarketingHomeProduct() {
  const { lang, marketing: t } = useAppLanguage("en");

  return (
    <section id="product" className="scroll-mt-24 border-y border-line bg-cream/55 py-20 sm:py-28 lg:py-32">
      <div className="site-container">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={t.howItWorks.eyebrow}
            title={t.howItWorks.title}
            description={t.howItWorks.description}
          />
          <Link
            href={marketingHref("/features", lang)}
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-extrabold text-brand"
          >
            {t.product.browseAll}
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {t.product.items.map((item) => {
            const feature = marketingFeatures.find((entry) => entry.slug === item.slug);
            const Icon = feature?.icon ?? Store;

            return (
              <Link
                key={item.slug}
                href={marketingHref(`/features/${item.slug}`, lang)}
                className="group flex min-h-[250px] flex-col rounded-[26px] border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-soft"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-brand/[0.09] text-brand">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <p className="mt-7 text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand">
                  {item.eyebrow}
                </p>
                <h2 className="display-font mt-2 text-2xl font-semibold tracking-[-0.035em] text-ink">
                  {item.name}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-extrabold text-brand">
                  {t.product.exploreFeature}
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function MarketingHomeFaq() {
  const { marketing: t } = useAppLanguage("en");

  return (
    <section id="faq" className="scroll-mt-24 py-20 sm:py-28 lg:py-32">
      <div className="site-container grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} />
          <p className="mt-6 text-sm leading-6 text-muted">
            {t.faq.contactPrefix}{" "}
            <Link
              href="mailto:hello@menurio.store"
              className="font-bold text-brand underline decoration-brand/30 underline-offset-4"
            >
              hello@menurio.store
            </Link>
          </p>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {t.faq.items.map(([question, answer], index) => (
            <details key={question} className="group" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-bold text-ink sm:py-6 sm:text-lg [&::-webkit-details-marker]:hidden">
                {question}
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-cream text-muted transition-transform duration-300 group-open:rotate-180">
                  <ChevronDown aria-hidden="true" className="size-4" />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 pr-10 text-sm leading-7 text-muted sm:text-base">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
