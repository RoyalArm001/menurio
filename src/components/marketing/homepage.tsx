import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  QrCode,
  Languages,
  Link2,
  ShoppingBag,
  BarChart3,
  Search,
  Plug,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/shell";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonStyles } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PricingCard } from "@/components/cards/pricing-card";
import { homepageFeatures, howItWorks, faqs, pricingPlans } from "@/data/mock";

const iconMap = {
  Globe,
  QrCode,
  Languages,
  Link: Link2,
  ShoppingBag,
  BarChart3,
  Search,
  Plug,
};

export function HomePage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line/70">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="site-container relative grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div className="fade-up">
            <Badge variant="brand" className="mb-5 normal-case tracking-normal">
              12 months free · No credit card
            </Badge>
            <h1 className="display-font text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-ink sm:text-6xl lg:text-7xl">
              Your Restaurant. Your Website. Your Menu. Your Orders.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              Menurio is the complete digital platform for restaurants — not
              just another QR menu. Launch a beautiful website, multilingual
              menu, ordering, analytics, and SEO in one place.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/onboarding" className={buttonStyles({ size: "lg" })}>
                Create Your Restaurant — Free
              </Link>
              <Link
                href="/r/demo-restaurant"
                className={buttonStyles({ variant: "secondary", size: "lg" })}
              >
                View Demo
              </Link>
            </div>
            <p className="mt-4 text-sm font-medium text-brand">
              12 months free on the FREE plan
            </p>
          </div>
          <div className="fade-up-delay relative">
            <div className="float-gentle overflow-hidden rounded-[32px] border border-line bg-surface p-3 shadow-float">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-cream">
                <Image
                  src="/images/hero-preview.svg"
                  alt="Menurio restaurant preview"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 p-2">
                {["Website", "QR Menu", "Orders"].map((label) => (
                  <div
                    key={label}
                    className="rounded-2xl bg-cream px-3 py-4 text-center text-xs font-bold uppercase tracking-wide text-ink"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="site-container py-20 lg:py-28">
        <SectionHeading
          eyebrow="How it works"
          title="From zero to published in an afternoon"
          description="A guided flow designed for busy restaurant owners — no developers required."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {howItWorks.map((item) => (
            <div
              key={item.step}
              className="rounded-[28px] border border-line/80 bg-surface p-7 shadow-soft"
            >
              <p className="text-sm font-bold text-brand">{item.step}</p>
              <h3 className="mt-3 text-xl font-semibold text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-line/70 bg-cream/50 py-20 lg:py-28">
        <div className="site-container">
          <SectionHeading
            eyebrow="Platform"
            title="Much more than a QR menu"
            description="Everything a modern restaurant needs to be discovered, browsed, and booked — on mobile and desktop."
            align="center"
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {homepageFeatures.map((feature) => {
              const Icon = iconMap[feature.icon as keyof typeof iconMap];
              return (
                <article
                  key={feature.title}
                  className="rounded-[24px] border border-line/70 bg-surface p-6 shadow-soft"
                >
                  <div className="mb-4 grid size-11 place-items-center rounded-2xl bg-brand/10 text-brand">
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink">{feature.title}</h3>
                    {feature.badge ? (
                      <Badge variant="outline" className="normal-case tracking-normal">
                        {feature.badge}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrations teaser */}
      <section className="site-container py-20">
        <div className="grid items-center gap-10 rounded-[32px] bg-night px-8 py-12 text-white lg:grid-cols-2 lg:px-12">
          <div>
            <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80 normal-case tracking-normal">
              Requires Integration
            </Badge>
            <h2 className="display-font mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Ready for iiko, POS, and the Restaurant Bridge
            </h2>
            <p className="mt-4 text-base leading-7 text-white/65">
              Architecture is prepared for future POS sync, kitchen printers,
              realtime order receivers, and the Menurio Restaurant Bridge for
              Windows — without rebuilding your stack.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["iiko / POS", "Kitchen printer", "Order receiver", "AI menu import"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold"
                >
                  {item}
                  <span className="mt-2 block text-xs font-normal text-white/45">
                    Coming soon
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section id="pricing" className="site-container py-20 lg:py-28">
        <SectionHeading
          eyebrow="Pricing"
          title="Start free. Grow when you are ready."
          description="12 months free on FREE. Upgrade for languages, orders, analytics, and custom domains."
          align="center"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-deep"
          >
            Compare all features <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-line/70 bg-cream/40 py-20">
        <div className="site-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions restaurant owners ask"
            description="Straight answers about what Menurio includes — and what is still on the roadmap."
          />
          <div className="space-y-4">
            {faqs.map(([q, a]) => (
              <details
                key={q}
                className="group rounded-[24px] border border-line/80 bg-surface p-5 shadow-soft"
              >
                <summary className="cursor-pointer list-none font-semibold text-ink marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {q}
                    <Sparkles className="size-4 shrink-0 text-brand opacity-0 transition group-open:opacity-100" />
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="site-container py-20">
        <div className="rounded-[32px] bg-brand px-8 py-14 text-center text-white shadow-[0_24px_80px_rgba(150,105,31,0.25)] sm:px-12">
          <h2 className="display-font text-4xl font-semibold tracking-tight sm:text-5xl">
            Ready to launch your restaurant online?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/80">
            Join restaurants using Menurio for their website, menu, QR codes,
            and orders. Start free for 12 months.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/onboarding"
              className={buttonStyles({
                variant: "secondary",
                size: "lg",
                className: "border-0 bg-white text-brand hover:bg-white/90",
              })}
            >
              Create Your Restaurant — Free
            </Link>
            <Link
              href="/r/demo-restaurant"
              className={buttonStyles({
                variant: "ghost",
                size: "lg",
                className: "text-white hover:bg-white/10",
              })}
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
