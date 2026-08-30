import { cn } from "@/lib/format";

export type BadgeVariant = "default" | "brand" | "success" | "warning" | "muted" | "outline";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-ink/8 text-ink",
    brand: "bg-brand/12 text-brand-deep",
    success: "bg-success/12 text-success",
    warning: "bg-amber-500/12 text-amber-700",
    muted: "bg-cream text-muted",
    outline: "border border-line bg-white text-muted",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em]",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TagBadge({
  tag,
  className,
}: {
  tag: "New" | "Popular" | "Spicy" | "Vegan";
  className?: string;
}) {
  const styles = {
    New: "bg-blue-500/12 text-blue-700",
    Popular: "bg-brand/12 text-brand-deep",
    Spicy: "bg-red-500/12 text-red-700",
    Vegan: "bg-success/12 text-success",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        styles[tag],
        className,
      )}
    >
      {tag}
    </span>
  );
}
