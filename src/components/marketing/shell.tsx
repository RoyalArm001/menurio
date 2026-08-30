import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/format";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-xl">
      <div className="site-container flex h-16 items-center justify-between gap-4">
        <Wordmark compact />
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <span className="hidden sm:block">
            <Link href="/r/demo-restaurant" className={buttonStyles({ variant: "ghost", size: "sm" })}>
              View Demo
            </Link>
          </span>
          <Link href="/onboarding" className={buttonStyles({ size: "sm" })}>
            Create Free
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-line bg-night text-white">
      <div className="site-container grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Wordmark light href="/" compact />
          <p className="mt-4 max-w-md text-sm leading-7 text-white/60">
            Menurio for Restaurants — your website, menu, orders, analytics,
            and SEO in one platform. 12 months free to get started.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
            Product
          </p>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link href="/r/demo-restaurant" className="hover:text-white">Demo restaurant</Link></li>
            <li><Link href="/onboarding" className="hover:text-white">Get started</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
            Platform
          </p>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
            <li><Link href="/login" className="hover:text-white">Sign in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="site-container flex flex-col gap-3 py-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Menurio. All rights reserved.</p>
          <p>Built for restaurants in Armenia and beyond.</p>
        </div>
      </div>
    </footer>
  );
}

export function MarketingShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("theme-aware min-h-screen bg-paper", className)}>
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
