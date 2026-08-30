"use client";

import { Moon, Sun } from "lucide-react";
import { cx } from "@/components/ui/button";

type ThemeToggleProps = {
  className?: string;
  showLabel?: boolean;
  inverse?: boolean;
  restaurant?: boolean;
};

export function ThemeToggle({
  className,
  showLabel = false,
  inverse = false,
  restaurant = false,
}: ThemeToggleProps) {
  function toggleTheme() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";

    root.classList.add("theme-transition");
    root.dataset.theme = next;
    root.style.colorScheme = next;
    localStorage.setItem("menurio-theme", next);
    window.dispatchEvent(new CustomEvent("menurio:theme-change", { detail: next }));

    window.setTimeout(() => root.classList.remove("theme-transition"), 350);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cx(
        "theme-toggle inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border px-3 text-xs font-bold transition hover:-translate-y-0.5",
        restaurant
          ? "border-[var(--r-line)] bg-[var(--r-bg)] text-[var(--r-text)] shadow-sm hover:border-[var(--r-primary)]/40"
          : inverse
          ? "border-white/15 bg-white/[0.07] text-white hover:bg-white/[0.12]"
          : "border-line bg-surface text-ink shadow-sm hover:border-brand/35",
        !showLabel && "w-10 px-0",
        className,
      )}
      aria-label="Switch between light and dark mode"
      title="Switch color theme"
    >
      <Sun aria-hidden="true" className="theme-icon-light size-4" />
      <Moon aria-hidden="true" className="theme-icon-dark size-4" />
      {showLabel ? (
        <span>
          <span className="theme-label-light">Dark</span>
          <span className="theme-label-dark">Light</span>
        </span>
      ) : null}
    </button>
  );
}
