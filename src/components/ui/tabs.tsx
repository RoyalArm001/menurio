"use client";

import { cn } from "@/lib/format";

export function Tabs({
  items,
  value,
  onChange,
  className,
}: {
  items: Array<{ id: string; label: string; count?: number }>;
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 no-scrollbar",
        className,
      )}
      role="tablist"
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
              active
                ? "bg-night text-white shadow-md"
                : "bg-white text-muted hover:bg-cream hover:text-ink",
            )}
          >
            {item.label}
            {item.count !== undefined ? (
              <span className={cn("ml-1.5", active ? "text-white/70" : "text-muted/70")}>
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function SegmentedTabs({
  items,
  value,
  onChange,
}: {
  items: Array<{ id: string; label: string }>;
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-line bg-cream p-1">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition",
            value === item.id ? "bg-white text-ink shadow-sm" : "text-muted",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
