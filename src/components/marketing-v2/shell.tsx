import { cx } from "@/components/ui/button";
import { MarketingMobileActions } from "@/components/marketing-v2/mobile-actions";
import { MarketingHeader } from "@/components/marketing-v2/marketing-header";
import { MarketingFooterClient } from "@/components/marketing-v2/marketing-footer";

/** @deprecated use MarketingHeader */
export function MarketingV2Header({ homeHref = "" }: { homeHref?: string }) {
  return <MarketingHeader homeHref={homeHref} />;
}

/** @deprecated use MarketingFooterClient */
export function MarketingV2Footer() {
  return <MarketingFooterClient />;
}

export function MarketingV2Shell({
  children,
  className,
  homeHref = "",
}: {
  children: React.ReactNode;
  className?: string;
  homeHref?: string;
}) {
  return (
    <div className={cx("theme-aware min-h-screen overflow-x-clip bg-paper", className)}>
      <MarketingHeader homeHref={homeHref} />
      <main className="pb-20 sm:pb-0">{children}</main>
      <MarketingFooterClient />
      <MarketingMobileActions />
    </div>
  );
}
