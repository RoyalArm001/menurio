import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "dark";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-brand text-white shadow-[0_10px_24px_rgba(150,105,31,.24)] hover:bg-brand-deep",
    secondary:
      "border border-line bg-cream text-ink shadow-sm hover:border-brand/35 hover:bg-surface",
    ghost: "text-ink hover:bg-ink/[0.055]",
    dark: "bg-night text-white shadow-lg hover:bg-black",
  };
  const sizes: Record<ButtonSize, string> = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-13 px-6 text-[15px]",
    icon: "size-10",
  };

  return cx(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}
