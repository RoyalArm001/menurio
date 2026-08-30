import type { Metadata } from "next";

import {
  MarketingPricingPage,
  marketingPricingMetadata,
} from "@/components/marketing-v2/pricing-page";

export const metadata: Metadata = {
  ...marketingPricingMetadata,
  robots: { index: false, follow: false },
};

export default function MarketingPreviewPricingPage() {
  return <MarketingPricingPage homeHref="/marketing-preview" />;
}
