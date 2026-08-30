import Link from "next/link";
import { cn } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import type { PricingPlan } from "@/data/mock";
import { Check } from "lucide-react";

export function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-[28px] border bg-surface p-6 shadow-soft sm:p-7",
        plan.featured
          ? "border-brand shadow-[0_24px_80px_rgba(150,105,31,0.14)]"
          : "border-line/80",
      )}
    >
      {plan.featured ? (
        <Badge variant="brand" className="absolute -top-3 left-6">
          Most popular
        </Badge>
      ) : null}
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">
          {plan.name}
        </p>
        <div className="mt-4 flex items-end gap-2">
          <span className="display-font text-5xl font-semibold tracking-tight text-ink">
            {plan.price}
          </span>
          <span className="pb-2 text-sm text-muted">{plan.suffix}</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{plan.description}</p>
      </div>
      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature.label} className="flex items-start gap-3 text-sm">
            <Check className="mt-0.5 size-4 shrink-0 text-brand" />
            <span className="flex flex-wrap items-center gap-2 text-ink/90">
              {feature.label}
              {feature.badge ? (
                <Badge variant="outline" className="normal-case tracking-normal">
                  {feature.badge}
                </Badge>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="/onboarding"
        className={buttonStyles({
          variant: plan.featured ? "primary" : "secondary",
          size: "lg",
          className: "mt-8 w-full",
        })}
      >
        {plan.id === "FREE" ? "Start free" : "Choose plan"}
      </Link>
    </div>
  );
}

export function AnalyticsCard({
  label,
  value,
  change,
  series,
}: {
  label: string;
  value: string;
  change: string;
  series: number[];
}) {
  const max = Math.max(...series, 1);

  return (
    <div className="rounded-[24px] border border-line/80 bg-surface p-5 shadow-soft">
      <p className="text-sm font-medium text-muted">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="display-font text-3xl font-semibold tracking-tight text-ink">
          {value}
        </p>
        <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
          {change}
        </span>
      </div>
      <div className="mt-5 flex h-12 items-end gap-1.5">
        {series.map((point, i) => (
          <div
            key={i}
            className="flex-1 rounded-full bg-brand/15"
            style={{ height: `${Math.max(18, (point / max) * 100)}%` }}
          />
        ))}
      </div>
    </div>
  );
}
