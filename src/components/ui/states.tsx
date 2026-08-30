import { cn } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-line bg-cream/50 px-6 py-16 text-center">
      {icon ? (
        <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-white text-brand shadow-soft">
          {icon}
        </div>
      ) : null}
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="size-10 animate-spin rounded-full border-[3px] border-line border-t-brand" />
      <p className="mt-4 text-sm font-medium text-muted">{label}</p>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-red-200 bg-red-50 px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-red-800">{title}</h3>
      <p className="mt-2 text-sm text-red-700">{description}</p>
      {onRetry ? (
        <Button variant="secondary" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-line/70",
        className,
      )}
    />
  );
}
