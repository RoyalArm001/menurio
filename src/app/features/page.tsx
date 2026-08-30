import type { Metadata } from "next";

import { MarketingFeaturesIndexPage } from "@/components/marketing-v2/feature-pages";

export const metadata: Metadata = {
  title: "Restaurant platform features",
  description:
    "Explore Menurio features for restaurant websites, QR menus, online orders, multilingual menus, themes, analytics and more.",
  alternates: {
    canonical: "/features",
  },
  openGraph: {
    title: "Restaurant platform features — Menurio",
    description:
      "Website, QR menu, online orders, branding, analytics and more for modern restaurants.",
    url: "/features",
    type: "website",
  },
};

export default function FeaturesPage() {
  return <MarketingFeaturesIndexPage />;
}
