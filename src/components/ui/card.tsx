import { cn } from "@/lib/format";

export function Card({
  className,
  children,
  padding = "md",
}: {
  className?: string;
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  return (
    <div
      className={cn(
        "rounded-[28px] border border-line/80 bg-surface shadow-soft",
        paddings[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold tracking-tight text-ink">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
