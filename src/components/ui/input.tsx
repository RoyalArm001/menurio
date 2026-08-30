import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/format";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-brand/40 focus:ring-4 focus:ring-brand/10",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-brand/40 focus:ring-4 focus:ring-brand/10",
        className,
      )}
      {...props}
    />
  );
}

export function Label({
  children,
  htmlFor,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("mb-2 block text-sm font-semibold text-ink", className)}
    >
      {children}
    </label>
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
