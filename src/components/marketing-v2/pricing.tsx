import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonStyles, cx } from "@/components/ui/button";
import { pricingPlans } from "@/data/mock";

type ComparisonRow = {
  feature: string;
  values: [string, string, string, string];
};

type ComparisonGroup = {
  title: string;
  rows: ComparisonRow[];
};

const comparisonGroups: ComparisonGroup[] = [
  {
    title: "Website & brand",
    rows: [
      { feature: "Restaurant website", values: ["Included", "Included", "Included", "Included"] },
      { feature: "Professional themes", values: ["1 theme", "Included", "Advanced", "Advanced"] },
      { feature: "Custom domain", values: ["—", "—", "—", "Included"] },
      { feature: "SEO tools", values: ["Basic", "Basic", "Advanced", "Advanced"] },
    ],
  },
  {
    title: "Menu & guests",
    rows: [
      { feature: "Menu products", values: ["Starter limit", "Unlimited", "Unlimited", "Unlimited"] },
      { feature: "Languages", values: ["1", "Up to 3", "Up to 5", "Up to 8"] },
      { feature: "Product photography", values: ["—", "Included", "Included", "Included"] },
      { feature: "Menu search & sold out", values: ["—", "Included", "Included", "Included"] },
      { feature: "QR design", values: ["Basic", "Custom", "Custom", "Table QR"] },
    ],
  },
  {
    title: "Growth & operations",
    rows: [
      { feature: "Analytics", values: ["Visitor count", "Basic", "Advanced", "Cross-branch"] },
      { feature: "Cart & orders", values: ["—", "—", "Included", "Included"] },
      { feature: "Branches", values: ["1", "1", "1", "Up to 5"] },
      { feature: "Team roles", values: ["—", "—", "—", "Included"] },
      { feature: "Support", values: ["Standard", "Standard", "Priority", "Priority"] },
    ],
  },
];

function FeatureValue({ value, invert = false }: { value: string; invert?: boolean }) {
  if (value === "Included") {
    return (
      <span className={cx("inline-flex items-center gap-1.5 font-bold", invert ? "text-white" : "text-success")}>
        <span className={cx("grid size-5 place-items-center rounded-full", invert ? "bg-white/10" : "bg-success/10")}>
          <Check aria-hidden="true" className="size-3" strokeWidth={3} />
        </span>
        Included
      </span>
    );
  }

  if (value === "—") {
    return <Minus aria-label="Not included" className={cx("size-4", invert ? "text-white/30" : "text-muted/40")} />;
  }

  return <span className={invert ? "text-white/70" : "text-muted"}>{value}</span>;
}

export function PricingPlanCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {pricingPlans.map((plan) => {
        const isFree = plan.price === "0";
        return (
          <article
            key={plan.id}
            className={cx(
              "relative flex flex-col overflow-hidden rounded-[28px] border p-6 transition-all duration-300 hover:-translate-y-1 sm:p-7",
              plan.featured
                ? "border-night bg-night text-white shadow-float"
                : "border-line bg-surface shadow-[0_8px_35px_rgba(41,34,25,.045)] hover:shadow-soft",
            )}
          >
            {plan.featured ? <div className="absolute right-0 top-0 rounded-bl-2xl bg-brand px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white">Most popular</div> : null}
            <div className="flex min-h-7 items-center gap-2">
              <span className={cx("text-xs font-extrabold tracking-[0.19em]", plan.featured ? "text-white/60" : "text-muted")}>{plan.name}</span>
              {isFree ? <span className="rounded-full bg-success/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-success">12 months</span> : null}
            </div>
            <div className="mt-6 flex items-end gap-2">
              <span className="display-font text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{plan.price}</span>
              {!isFree ? <span className={cx("mb-1.5 text-xs", plan.featured ? "text-white/55" : "text-muted")}>AMD</span> : null}
            </div>
            <p className={cx("mt-1 text-xs", plan.featured ? "text-white/55" : "text-muted")}>{isFree ? "Free for your first 12 months" : "per month, billed monthly"}</p>
            <p className={cx("mt-5 min-h-12 text-sm leading-6", plan.featured ? "text-white/68" : "text-muted")}>{plan.description}</p>
            <Link href="/setup-preview" className={buttonStyles({ variant: plan.featured ? "primary" : "secondary", size: "md", className: "mt-6 w-full" })}>
              {isFree ? "Start free" : `Choose ${plan.name}`}<ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <ul className="mt-7 flex-1 space-y-3.5">
              {plan.features.slice(0, 7).map((feature) => (
                <li key={feature.label} className="flex gap-2.5 text-sm">
                  <span className={cx("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", plan.featured ? "bg-white/10 text-white" : "bg-brand/10 text-brand")}><Check aria-hidden="true" className="size-3" strokeWidth={3} /></span>
                  <span className={cx("flex flex-wrap items-center gap-1.5", plan.featured ? "text-white/78" : "text-ink/78")}>
                    {feature.label}
                    {feature.badge ? <Badge variant="outline" className={cx("normal-case tracking-normal", plan.featured && "border-white/15 bg-white/5 text-white/60")}>{feature.badge}</Badge> : null}
                  </span>
                </li>
              ))}
            </ul>
            {plan.features.length > 7 ? <a href="#full-comparison" className={cx("mt-5 text-center text-xs font-bold underline decoration-current/25 underline-offset-4", plan.featured ? "text-white/65" : "text-brand")}>+ {plan.features.length - 7} more in comparison</a> : null}
          </article>
        );
      })}
    </div>
  );
}

export function PricingComparison() {
  return (
    <div id="full-comparison" className="scroll-mt-28">
      <div className="mb-7 flex items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Full comparison</p>
          <h3 className="display-font mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Find your right fit.</h3>
        </div>
        <p className="hidden max-w-sm text-right text-xs leading-5 text-muted md:block">Every plan includes secure hosting, responsive design and automatic platform updates.</p>
      </div>

      <div className="hidden overflow-hidden rounded-[28px] border border-line bg-white shadow-soft md:block">
        <table className="w-full table-fixed text-left text-xs lg:text-sm">
          <caption className="sr-only">Menurio plan feature comparison</caption>
          <thead className="bg-night text-white">
            <tr>
              <th scope="col" className="w-[28%] px-5 py-5 font-bold lg:px-7">Feature</th>
              {pricingPlans.map((plan) => <th scope="col" key={plan.id} className={cx("px-3 py-5 font-extrabold tracking-wider lg:px-5", plan.featured && "bg-brand")}>{plan.name}<span className="mt-1 block text-[9px] font-medium normal-case tracking-normal text-white/50">{plan.price === "0" ? "12 months free" : `${plan.price} AMD / mo`}</span></th>)}
            </tr>
          </thead>
          <tbody>
            {comparisonGroups.map((group) => (
              <FragmentRows key={group.title} group={group} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        <p className="rounded-2xl bg-brand/[0.07] px-4 py-3 text-xs leading-5 text-brand"><strong>Mobile comparison:</strong> open each category to compare all four plans without sideways scrolling.</p>
        {comparisonGroups.map((group, groupIndex) => (
          <details key={group.title} open={groupIndex === 0} className="group overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-5 text-sm font-extrabold [&::-webkit-details-marker]:hidden">
              {group.title}<span className="grid size-7 place-items-center rounded-full bg-cream text-lg font-medium text-brand group-open:rotate-45">+</span>
            </summary>
            <div className="space-y-3 border-t border-line bg-cream/35 p-3">
              {group.rows.map((row) => (
                <div key={row.feature} className="rounded-2xl border border-line/70 bg-white p-4">
                  <p className="text-xs font-extrabold text-ink">{row.feature}</p>
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                    {pricingPlans.map((plan, planIndex) => (
                      <div key={plan.id} className="border-t border-line pt-2">
                        <p className="text-[8px] font-extrabold uppercase tracking-wider text-brand">{plan.name}</p>
                        <div className="mt-1 text-[10px]"><FeatureValue value={row.values[planIndex]} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function FragmentRows({ group }: { group: ComparisonGroup }) {
  return (
    <>
      <tr className="border-t border-line bg-cream/70"><th colSpan={5} scope="colgroup" className="px-5 py-3 text-[9px] font-extrabold uppercase tracking-[0.18em] text-brand lg:px-7">{group.title}</th></tr>
      {group.rows.map((row) => (
        <tr key={row.feature} className="border-t border-line/70 transition-colors hover:bg-cream/30">
          <th scope="row" className="px-5 py-4 font-bold text-ink lg:px-7">{row.feature}</th>
          {row.values.map((value, index) => <td key={`${value}-${index}`} className={cx("px-3 py-4 lg:px-5", index === 2 && "bg-brand/[0.035]")}><FeatureValue value={value} /></td>)}
        </tr>
      ))}
    </>
  );
}

export function PricingExperience() {
  return (
    <>
      <PricingPlanCards />
      <div className="mt-16 sm:mt-20"><PricingComparison /></div>
      <p className="mt-6 text-center text-xs leading-5 text-muted">Prices exclude applicable taxes. No setup fees. Change or cancel your plan anytime. Roadmap features are clearly marked before activation.</p>
    </>
  );
}
