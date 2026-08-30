import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Sparkles } from "lucide-react";

import { PricingExperience } from "@/components/marketing-v2/pricing";
import { MarketingV2Shell } from "@/components/marketing-v2/shell";
import { buttonStyles } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export const marketingPricingMetadata: Metadata = {
  title: "Pricing — Menurio for Restaurants",
  description:
    "Compare FREE, START, PRO and PRO+ plans for restaurant websites, multilingual QR menus, orders and analytics. Start free for 12 months.",
  openGraph: {
    title: "Simple restaurant platform pricing — Menurio",
    description: "Start free for 12 months, then choose the plan that fits your restaurant.",
    type: "website",
  },
};

const pricingFaqs = [
  [
    "Is the FREE plan really free for 12 months?",
    "Yes. You can build and publish your restaurant website and QR menu on FREE for your first 12 months, with no setup fee or card required to begin.",
  ],
  [
    "What happens when the 12 months end?",
    "We will show your available options before anything changes. You can choose the plan that fits your restaurant at that time; there are no surprise upgrades.",
  ],
  [
    "Can I change plans later?",
    "Yes. Start with what you need now and move to another plan as your menu, team or locations grow.",
  ],
  [
    "Which plan includes a custom domain?",
    "PRO+ includes guided custom-domain setup, along with multi-branch tools, staff roles and priority support.",
  ],
  [
    "Are future integrations included today?",
    "No. Roadmap and integration-dependent capabilities are clearly marked. They will never be presented as active before the connection is genuinely available.",
  ],
] as const;

export function MarketingPricingPage({ homeHref }: { homeHref: string }) {
  return (
    <MarketingV2Shell homeHref={homeHref}>
      <section id="pricing" className="relative overflow-hidden border-b border-line py-16 sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="pointer-events-none absolute left-1/2 top-[-20rem] size-[38rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[100px]" />
        <div className="site-container relative">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.07] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand sm:text-xs">
            <Sparkles aria-hidden="true" className="size-3.5" />12 months free · No card required
          </div>
          <div className="mt-7">
            <SectionHeading
              eyebrow="Pricing"
              title="A plan for the restaurant you run today."
              description="Start with a complete digital foundation, then add deeper branding, orders, analytics and multi-location tools when they make sense."
              align="center"
            />
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted">
            {["No setup fee", "Change plans anytime", "Transparent roadmap features"].map((item) => (
              <span key={item} className="flex items-center gap-1.5"><Check aria-hidden="true" className="size-3.5 text-success" strokeWidth={3} />{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream/55 py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          <PricingExperience />
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="site-container grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Pricing FAQ" title="Know exactly what you’re choosing." />
            <p className="mt-6 max-w-sm text-sm leading-6 text-muted">
              Need help matching a plan to your restaurant? Email{" "}
              <Link href="mailto:hello@menurio.store?subject=Help%20choosing%20a%20Menurio%20plan" className="font-bold text-brand underline decoration-brand/25 underline-offset-4">hello@menurio.store</Link>.
            </p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {pricingFaqs.map(([question, answer], index) => (
              <details key={question} open={index === 0} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-bold text-ink sm:py-6 sm:text-lg [&::-webkit-details-marker]:hidden">
                  {question}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-cream text-muted transition-transform duration-300 group-open:rotate-180"><ChevronDown aria-hidden="true" className="size-4" /></span>
                </summary>
                <p className="max-w-2xl pb-6 pr-10 text-sm leading-7 text-muted sm:text-base">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-4 sm:px-8 sm:pb-8">
        <div className="noise-overlay relative mx-auto max-w-[1440px] overflow-hidden rounded-[30px] bg-night px-5 py-16 text-center text-white sm:rounded-[40px] sm:px-10 sm:py-20">
          <div className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full border-[50px] border-white/[0.04]" />
          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#e6b65f]">Start with 12 months free</p>
            <h2 className="display-font text-balance mt-5 text-4xl leading-[1.02] font-semibold tracking-[-0.045em] sm:text-5xl">Build the restaurant presence you wish you already had.</h2>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-white/65">Set up your brand, website and menu visually—without entering a protected account flow.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/setup-preview" className={buttonStyles({ size: "lg", className: "w-full sm:w-auto" })}>Create Your Restaurant — Free<ArrowRight aria-hidden="true" className="size-4" /></Link>
              <Link href="/r/demo-restaurant" className={buttonStyles({ variant: "secondary", size: "lg", className: "w-full border-white/15 bg-white/5 text-white hover:bg-white hover:text-ink sm:w-auto" })}>View Demo</Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingV2Shell>
  );
}
