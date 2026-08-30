import type { Metadata } from "next";

import { MarketingPricingPage } from "@/components/marketing-v2/pricing-page";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Compare FREE, START, PRO and PRO+ plans for restaurant websites, multilingual QR menus, orders and analytics. Start free for 12 months.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Simple restaurant platform pricing — Menurio",
    description:
      "Start free for 12 months, then choose the plan that fits your restaurant.",
    url: "/pricing",
    type: "website",
  },
};

export default function PricingPage() {
  return <MarketingPricingPage homeHref="/" />;
}
