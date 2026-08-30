"use client";

import { Suspense } from "react";
import { CartProvider } from "@/contexts/cart-context";
import { ToastProvider } from "@/components/ui/toast";
import { getTheme } from "@/lib/themes/restaurant-themes";
import { demoRestaurant } from "@/data/mock";
import { DemoRestaurantNav, DemoRestaurantFooter } from "@/components/restaurant/demo-nav";

export function DemoRestaurantShell({ children }: { children: React.ReactNode }) {
  const theme = getTheme(demoRestaurant.themeId as "modern");

  return (
    <CartProvider>
      <ToastProvider>
        <div
          style={{
            ["--r-primary" as string]: theme.colors.primary,
            ["--r-bg" as string]: theme.colors.background,
            ["--r-surface" as string]: theme.colors.surface,
            ["--r-text" as string]: theme.colors.text,
            ["--r-muted" as string]: theme.colors.muted,
            ["--r-line" as string]: `${theme.colors.text}14`,
            ["--r-accent" as string]: theme.colors.accent,
          }}
          className="restaurant-demo theme-aware min-h-screen bg-[var(--r-bg)] text-[var(--r-text)]"
        >
          <Suspense fallback={null}>
            <DemoRestaurantNav />
          </Suspense>
          <main className="pb-16 sm:pb-0">{children}</main>
          <DemoRestaurantFooter />
        </div>
      </ToastProvider>
    </CartProvider>
  );
}
