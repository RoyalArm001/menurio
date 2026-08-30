"use client";

import { Suspense } from "react";
import { CartProvider } from "@/contexts/cart-context";
import { ToastProvider } from "@/components/ui/toast";
import {
  PublicRestaurantProvider,
  usePublicDesign,
  type PublicRestaurantData,
} from "@/contexts/public-restaurant-context";
import { PublicRestaurantNav, PublicRestaurantFooter } from "@/components/restaurant/public-nav";
import { PublicTranslationGuard } from "@/components/restaurant/public-translation-guard";
import { PublicPwaManager } from "@/components/restaurant/public-pwa-manager";

function ThemedShell({ children }: { children: React.ReactNode }) {
  const design = usePublicDesign();

  return (
    <div
      data-theme={design.themeId}
      data-nav={design.navigationStyle}
      data-card={design.cardStyle}
      data-menu={design.menuLayout}
      data-image={design.imageStyle}
      data-footer={design.footerStyle}
      data-button={design.buttonStyle}
      style={design.cssVariables as React.CSSProperties}
      className="min-h-screen bg-[var(--r-bg)] font-[family-name:var(--r-body-font)] text-[var(--r-text)]"
    >
      {design.customCss ? (
        <style data-restaurant-css dangerouslySetInnerHTML={{ __html: design.customCss }} />
      ) : null}
      <Suspense fallback={null}>
        <PublicRestaurantNav />
      </Suspense>
      <PublicTranslationGuard />
      <PublicPwaManager />
      <main>{children}</main>
      <Suspense fallback={null}>
        <PublicRestaurantFooter />
      </Suspense>
    </div>
  );
}

export function PublicRestaurantShell({
  data,
  children,
}: {
  data: PublicRestaurantData;
  children: React.ReactNode;
}) {
  return (
    <PublicRestaurantProvider data={data}>
      <CartProvider>
        <ToastProvider>
          <ThemedShell>{children}</ThemedShell>
        </ToastProvider>
      </CartProvider>
    </PublicRestaurantProvider>
  );
}
