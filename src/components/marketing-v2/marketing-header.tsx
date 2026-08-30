"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, ChevronDown, Menu } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { buttonStyles } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useAppLanguage } from "@/hooks/use-app-language";
import { marketingHref } from "@/lib/i18n/marketing";

function MarketingHeaderInner({ homeHref = "" }: { homeHref?: string }) {
  const { lang, marketing: t } = useAppLanguage("en");

  const navigation = [
    { label: t.nav.product, href: "/features" },
    { label: t.nav.howItWorks, href: "#how-it-works" },
    { label: t.nav.pricing, href: "/pricing" },
    { label: t.nav.faq, href: "#faq" },
  ];

  function hrefFor(itemHref: string) {
    const route = itemHref.startsWith("#") ? `${homeHref}${itemHref}` : itemHref;
    const [path, anchor] = route.split("#");
    const localizedPath = marketingHref(path || "/", lang);

    return anchor ? `${localizedPath}#${anchor}` : localizedPath;
  }

  return (
    <header className="relative z-50">
      <Link
        href={marketingHref("/pricing", lang)}
        className="group flex min-h-9 items-center justify-center gap-2 bg-night px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.17em] text-white transition-colors hover:bg-brand-deep sm:text-xs"
      >
        <span className="size-1.5 rounded-full bg-[#e6b65f] shadow-[0_0_0_4px_rgba(230,182,95,.14)]" />
        {t.banner}
        <ArrowUpRight
          aria-hidden="true"
          className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </Link>

      <div className="sticky top-0 border-b border-ink/[0.07] bg-paper/90 backdrop-blur-xl">
        <div className="site-container flex h-[72px] items-center justify-between gap-3">
          <span className="sm:hidden">
            <Wordmark compact />
          </span>
          <span className="hidden sm:inline">
            <Wordmark />
          </span>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Primary navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={hrefFor(item.href)}
                className="rounded-full px-4 py-2 text-sm font-semibold text-muted transition-colors hover:bg-ink/[0.045] hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <LanguageSwitcher />
            </span>
            <span className="hidden sm:block">
              <ThemeToggle />
            </span>
            <span className="hidden sm:block">
              <Link
                href={marketingHref("/login", lang)}
                className={buttonStyles({ variant: "ghost", size: "sm" })}
              >
                {t.signIn}
              </Link>
            </span>
            <span className="hidden sm:block">
              <Link
                href="/onboarding"
                className={buttonStyles({ size: "sm", className: "px-5" })}
              >
                {t.createRestaurant}
              </Link>
            </span>

            <details className="group relative lg:hidden">
              <summary
                className="grid size-10 cursor-pointer list-none place-items-center rounded-full border border-line bg-white text-ink shadow-sm transition-colors hover:bg-cream [&::-webkit-details-marker]:hidden"
                aria-label="Open navigation menu"
              >
                <Menu aria-hidden="true" className="size-4.5 group-open:hidden" />
                <ChevronDown
                  aria-hidden="true"
                  className="hidden size-4.5 group-open:block"
                />
              </summary>
              <nav
                aria-label="Mobile navigation"
                className="absolute right-0 top-12 w-[min(19rem,calc(100vw-2rem))] rounded-3xl border border-line bg-white p-3 shadow-float"
              >
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={hrefFor(item.href)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold text-ink transition-colors hover:bg-cream"
                  >
                    {item.label}
                    <ArrowUpRight aria-hidden="true" className="size-3.5 text-muted" />
                  </Link>
                ))}
                <div className="mt-2 border-t border-line px-2 pt-3 sm:hidden">
                  <LanguageSwitcher className="w-full justify-center" />
                </div>
                <div className="mt-2 border-t border-line px-2 pt-3 sm:hidden">
                  <ThemeToggle showLabel />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-line pt-3">
                  <Link
                    href={marketingHref("/r/demo-restaurant", lang)}
                    className={buttonStyles({ variant: "secondary", size: "sm" })}
                  >
                    {t.viewDemo}
                  </Link>
                  <Link href="/onboarding" className={buttonStyles({ size: "sm" })}>
                    {t.startFree}
                  </Link>
                </div>
              </nav>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}

export function MarketingHeader({ homeHref = "" }: { homeHref?: string }) {
  return (
    <Suspense fallback={null}>
      <MarketingHeaderInner homeHref={homeHref} />
    </Suspense>
  );
}
