"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { useAppLanguage } from "@/hooks/use-app-language";
import { marketingHref } from "@/lib/i18n/marketing";

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">{title}</p>
      <ul className="mt-5 space-y-3 text-sm text-white/70">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MarketingFooterInner() {
  const { lang, marketing: t } = useAppLanguage();

  const exploreLinks = [
    { label: t.nav.product, href: marketingHref("/features", lang) },
    { label: t.nav.howItWorks, href: `${marketingHref("/", lang)}#how-it-works` },
    { label: t.nav.pricing, href: marketingHref("/pricing", lang) },
    { label: t.nav.faq, href: `${marketingHref("/", lang)}#faq` },
    { label: t.viewDemo, href: marketingHref("/r/demo-restaurant", lang) },
  ];

  const accountLinks = [
    { label: t.createRestaurant, href: marketingHref("/register", lang) },
    { label: t.signIn, href: marketingHref("/login", lang) },
    { label: t.footerDashboard, href: marketingHref("/dashboard", lang) },
  ];

  return (
    <footer className="bg-night text-white">
      <div className="site-container py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 border-b border-white/10 pb-12 sm:pb-16 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <Wordmark light />
            <p className="display-font mt-7 max-w-md text-3xl leading-tight tracking-[-0.035em] text-white sm:text-4xl">
              {t.footerTagline}
            </p>
            <Link
              href={marketingHref("/register", lang)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-deep"
            >
              {t.footerCta}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:gap-16">
            <FooterLinkGroup title={t.footerGroups.explore} links={exploreLinks} />
            <FooterLinkGroup title={t.footerGroups.account} links={accountLinks} />
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Menurio.</p>
          <p>
            {lang === "hy"
              ? "Ստեղծված է Հայաստանում՝ հյուրընկալության բիզնեսների համար ամբողջ աշխարհում։"
              : lang === "ru"
                ? "Создано в Армении для ресторанного бизнеса по всему миру."
                : "Crafted in Armenia for hospitality everywhere."}
          </p>
        </div>
      </div>
    </footer>
  );
}

export function MarketingFooterClient() {
  return (
    <Suspense fallback={null}>
      <MarketingFooterInner />
    </Suspense>
  );
}
