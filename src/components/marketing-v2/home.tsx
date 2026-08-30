import { Suspense } from "react";

import { MarketingV2Shell } from "@/components/marketing-v2/shell";
import {
  MarketingHomeFaq,
  MarketingHomeFinalCta,
  MarketingHomeHero,
  MarketingHomePlatformJourney,
  MarketingHomeProduct,
} from "@/components/marketing-v2/marketing-home-i18n";

export function MarketingHomeV2() {
  return (
    <MarketingV2Shell>
      <Suspense fallback={null}>
        <MarketingHomeHero />
        <MarketingHomeProduct />
        <MarketingHomePlatformJourney />
        <MarketingHomeFaq />
        <MarketingHomeFinalCta />
      </Suspense>
    </MarketingV2Shell>
  );
}
