"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, Globe } from "lucide-react";
import { cn } from "@/lib/format";
import { demoRestaurant } from "@/data/mock";
import { useCart } from "@/contexts/cart-context";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { resolvePublicLanguage, withLangParam, getPublicSiteUi } from "@/lib/i18n/public-languages";
import { useSearchParams } from "next/navigation";

export function DemoRestaurantNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const searchParams = useSearchParams();
  const lang = resolvePublicLanguage(searchParams.get("lang"));
  const ui = getPublicSiteUi(lang);

  const links = [
    { href: withLangParam("/r/demo-restaurant", lang), label: ui.home, exact: true },
    { href: withLangParam("/r/demo-restaurant/menu", lang), label: ui.menu },
    { href: withLangParam("/r/demo-restaurant/gallery", lang), label: ui.gallery },
    { href: withLangParam("/r/demo-restaurant/about", lang), label: ui.about },
    { href: withLangParam("/r/demo-restaurant/contact", lang), label: ui.contact },
  ];

  function openCart() {
    if (pathname.startsWith("/r/demo-restaurant/menu")) {
      window.dispatchEvent(new Event("avena:open-cart"));
      return;
    }
    router.push(withLangParam("/r/demo-restaurant/menu?cart=1", lang));
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--r-line)] bg-[var(--r-surface)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={withLangParam("/r/demo-restaurant", lang)} className="flex items-center gap-3">
          <Image
            src={demoRestaurant.logo}
            alt={demoRestaurant.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-semibold text-[var(--r-text)]">
            {demoRestaurant.name}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => {
            const path = link.href.split("?")[0]!;
            const active = link.exact
              ? pathname === path
              : pathname.startsWith(path);
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
          <Suspense fallback={null}>
            <LanguageSwitcher className="border-[var(--r-line)] bg-[var(--r-surface)] [&_button:not([aria-pressed=true])]:hover:bg-[var(--r-bg)]" />
          </Suspense>
          <ThemeToggle restaurant />
          <button
            type="button"
            onClick={openCart}
            className="relative inline-flex size-10 items-center justify-center rounded-full bg-[var(--r-primary)] text-white"
            aria-label="Open cart"
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
              ? pathname === "/r/demo-restaurant"
              : pathname.startsWith(link.href.split("?")[0]!);
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

export function DemoRestaurantFooter() {
  return (
    <Suspense fallback={null}>
      <DemoRestaurantFooterInner />
    </Suspense>
  );
}

function DemoRestaurantFooterInner() {
  const searchParams = useSearchParams();
  const lang = resolvePublicLanguage(searchParams.get("lang"));
  const ui = getPublicSiteUi(lang);

  return (
    <footer className="border-t border-[var(--r-line)] bg-[var(--r-surface)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-[var(--r-muted)]">
          © {demoRestaurant.name}. {ui.poweredBy}{" "}
          <Link href={withLangParam("/", lang)} className="font-semibold text-[var(--r-primary)]">
            Menurio
          </Link>
        </p>
        <Link
          href={withLangParam("/", lang)}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--r-muted)]"
        >
          <Globe className="size-4" /> {ui.createRestaurant}
        </Link>
      </div>
    </footer>
  );
}
