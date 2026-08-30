import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarketingFeaturePage } from "@/components/marketing-v2/feature-pages";
import { getMarketingFeature, marketingFeatures } from "@/data/marketing-features";

type FeaturePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return marketingFeatures.map((feature) => ({ slug: feature.slug }));
}

export async function generateMetadata({
  params,
}: FeaturePageProps): Promise<Metadata> {
  const { slug } = await params;
  const feature = getMarketingFeature(slug);

  if (!feature) {
    return { robots: { index: false, follow: false } };
  }

  return {
    title: feature.name,
    description: feature.description,
    alternates: {
      canonical: `/features/${feature.slug}`,
    },
    openGraph: {
      title: `${feature.name} - Menurio for Restaurants`,
      description: feature.description,
      url: `/features/${feature.slug}`,
      type: "website",
    },
  };
}

export default async function FeaturePage({ params }: FeaturePageProps) {
  const { slug } = await params;
  const feature = getMarketingFeature(slug);

  if (!feature) {
    notFound();
  }

  return <MarketingFeaturePage feature={feature} />;
}
