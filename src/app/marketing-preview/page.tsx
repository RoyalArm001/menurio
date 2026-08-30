import type { Metadata } from "next";

import { MarketingHomeV2 } from "@/components/marketing-v2/home";

export const metadata: Metadata = {
  title: "Restaurant websites, menus and orders",
  description:
    "Create a beautiful restaurant website, multilingual QR menu and online ordering experience. Start free for 12 months.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "The complete digital home for your restaurant.",
    description: "A complete digital home for modern restaurants. Start free for 12 months.",
    type: "website",
  },
};

export default function MarketingPreviewPage() {
  return <MarketingHomeV2 />;
}
