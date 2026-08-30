"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Globe } from "lucide-react";
import { cn } from "@/lib/format";
import { withLangParam } from "@/lib/i18n/public-languages";
import { useCart } from "@/contexts/cart-context";
import { usePublicDesign, usePublicRestaurant } from "@/contexts/public-restaurant-context";
import { PublicLanguageSwitcher } from "@/components/restaurant/public-language-switcher";
import { PwaInstallButton } from "@/components/restaurant/pwa-install-button";
import { PushEnableButton } from "@/components/restaurant/push-enable-button";
import {
  useLocalizedRestaurantContent,
  usePublicLanguage,
} from "@/hooks/use-public-language";

export function PublicRestaurantNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const restaurant = usePublicRestaurant();
  const design = usePublicDesign();
  const { ui, lang } = usePublicLanguage();
  const localized = useLocalizedRestaurantContent();
  const base = restaurant.publicBasePath;
  const homeHref = base || "/";
  const menuHref = `${base}/menu`;

  const links = [
    { href: withLangParam(homeHref, lang), label: ui.home, exact: true },
    { href: withLangParam(menuHref, lang), label: ui.menu },
  ];

  function openCart() {
    if (pathname.startsWith(menuHref)) {
      window.dispatchEvent(new Event("ws:open-cart"));
      return;
    }
    router.push(withLangParam(`${menuHref}?cart=1`, lang));
  }

  return (
    <header
      className={cn(
        "z-40 border-b border-[var(--r-line)]",
        design.navigationStyle === "transparent"
          ? "absolute inset-x-0 top-0 bg-transparent"
          : design.navigationStyle === "solid"
            ? "sticky top-0 bg-[var(--r-surface)]"
            : design.navigationStyle === "minimal"
              ? "sticky top-0 border-transparent bg-[var(--r-bg)]"
              : "sticky top-0 bg-[var(--r-surface)]/90 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={withLangParam(base, lang)} className="flex items-center gap-3">
          {restaurant.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={restaurant.logoUrl}
              alt={localized.name}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <span className="grid size-10 place-items-center rounded-full bg-[var(--r-primary)] text-sm font-bold text-white">
              {localized.name.slice(0, 1)}
            </span>
          )}
          <span className="font-semibold text-[var(--r-text)]">{localized.name}</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => {
            const active = link.exact
              ? pathname === homeHref
              : pathname.startsWith(menuHref);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition",
                  active
                    ? "text-[var(--r-primary)]"
                    : "text-[var(--r-muted)] hover:text-[var(--r-text)]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <PwaInstallButton />
          <PushEnableButton />
          <Suspense fallback={null}>
            <PublicLanguageSwitcher />
          </Suspense>
          <button
            type="button"
            onClick={openCart}
            className="relative inline-flex size-10 items-center justify-center rounded-full bg-[var(--r-primary)] text-white"
            aria-label={ui.openCart}
          >
            <ShoppingBag className="size-4" />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-white text-[10px] font-bold text-[var(--r-primary)]">
                {count}
              </span>
            ) : null}
          </button>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto border-t border-[var(--r-line)] px-4 py-2 no-scrollbar md:hidden">
          {links.map((link) => {
            const active = link.exact
              ? pathname === homeHref
              : pathname.startsWith(menuHref);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  active
                    ? "bg-[var(--r-primary)] text-white"
                    : "bg-[var(--r-bg)] text-[var(--r-text)]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
      </nav>
    </header>
  );
}

export function PublicRestaurantFooter() {
  const restaurant = usePublicRestaurant();
  const design = usePublicDesign();
  const { ui, lang } = usePublicLanguage();
  const branded = design.footerStyle === "branded";
  const minimal = design.footerStyle === "minimal";

  return (
    <footer
      className={cn(
        "border-t",
        branded
          ? "border-[var(--r-primary)]/20 bg-[var(--r-primary)] text-white"
          : "border-[var(--r-line)] bg-[var(--r-surface)]",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6",
          minimal && "py-5",
        )}
      >
        <p className={cn("text-sm", branded ? "text-white/80" : "text-[var(--r-muted)]")}>
          © {restaurant.name}
          {design.whiteLabelEnabled ? null : (
            <>
              . {ui.poweredBy}{" "}
              <Link
                href={withLangParam("/", lang)}
                className={cn("font-semibold", branded ? "text-white" : "text-[var(--r-primary)]")}
              >
                Menurio
              </Link>
            </>
          )}
        </p>
        {design.whiteLabelEnabled ? null : (
          <Link
            href={withLangParam("/", lang)}
            className={cn(
              "inline-flex items-center gap-2 text-sm font-medium",
              branded ? "text-white/80" : "text-[var(--r-muted)]",
            )}
          >
            <Globe className="size-4" /> {ui.createRestaurant}
          </Link>
        )}
      </div>
    </footer>
  );
}
