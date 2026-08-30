"use client";

import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { cx } from "@/components/ui/button";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between lg:pb-7">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.17em] text-muted">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.04em] text-ink sm:text-[34px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-[15px]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function Panel({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "rounded-[22px] border border-line bg-surface shadow-soft",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold tracking-[-0.02em] text-ink">{title}</h2>
        {description ? <p className="mt-1 text-xs leading-5 text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function DashboardButton({
  children,
  variant = "dark",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "dark" | "light" | "brand" | "ghost";
  size?: "sm" | "md" | "icon";
}) {
  const variants = {
    dark: "bg-ink text-paper shadow-soft hover:opacity-85",
    light: "border border-line bg-surface text-ink hover:border-brand/35 hover:bg-cream",
    brand: "bg-brand text-white shadow-soft hover:bg-brand-deep",
    ghost: "text-muted hover:bg-cream hover:text-ink",
  };
  const sizes = {
    sm: "h-9 px-3.5 text-xs",
    md: "h-10 px-4 text-sm",
    icon: "size-10",
  };
  return (
    <button
      type="button"
      className={cx(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function StatusPill({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "amber" | "brand" | "blue";
  className?: string;
}) {
  const tones = {
    neutral: "bg-cream text-muted",
    green: "bg-success/15 text-success",
    amber: "bg-[#d89a36]/15 text-[#b7791f]",
    brand: "bg-brand/15 text-brand",
    blue: "bg-[#5c8fd6]/15 text-[#669be4]",
  };
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold", tones[tone], className)}>
      {children}
    </span>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-success" : "bg-line",
      )}
    >
      <span
        className={cx(
          "absolute top-1 size-4 rounded-full bg-[#fff] shadow-sm transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

export function Field({
  label,
  hint,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between text-xs font-semibold text-ink">
        {label}
        {hint ? <span className="font-normal text-muted">{hint}</span> : null}
      </span>
      <input
        className={cx(
          "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink outline-none transition placeholder:text-muted/65 focus:border-brand focus:ring-4 focus:ring-brand/10",
          className,
        )}
        {...props}
      />
    </label>
  );
}

export function SelectControl({
  value,
  onChange,
  children,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-ink">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-line bg-surface px-3.5 pr-10 text-sm text-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
      </span>
    </label>
  );
}

export function PrototypeNotice() {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-brand/20 bg-brand/10 px-3 py-2 text-[11px] font-medium text-brand">
      <Sparkles className="size-3.5" />
      Changes are preview-only in this visual prototype
    </div>
  );
}
