import {
  hasCapability,
  type SubscriptionPlan,
} from "@/lib/entitlements/index";

/** Centralized SEO feature checks — never scatter plan checks in UI/API */
export type SeoFeature =
  | "AUTO_METADATA"
  | "CUSTOM_SEO"
  | "MULTILINGUAL_SEO"
  | "HREFLANG"
  | "STRUCTURED_DATA"
  | "SEO_EDITOR"
  | "CUSTOM_DOMAIN_SEO"
  | "SEO_REDIRECTS"
  | "SEO_ANALYTICS"
  | "ADVANCED_SEO_AUDIT";

const SEO_MATRIX: Record<SeoFeature, SubscriptionPlan[]> = {
  AUTO_METADATA: ["FREE", "START", "PRO", "PRO_PLUS"],
  CUSTOM_SEO: ["PRO", "PRO_PLUS"],
  MULTILINGUAL_SEO: ["PRO", "PRO_PLUS"],
  HREFLANG: ["PRO", "PRO_PLUS"],
  STRUCTURED_DATA: ["PRO", "PRO_PLUS"],
  SEO_EDITOR: ["PRO", "PRO_PLUS"],
  CUSTOM_DOMAIN_SEO: ["PRO_PLUS"],
  SEO_REDIRECTS: ["PRO_PLUS"],
  SEO_ANALYTICS: ["PRO_PLUS"],
  ADVANCED_SEO_AUDIT: ["PRO_PLUS"],
};

export function hasSeoFeature(
  plan: SubscriptionPlan,
  feature: SeoFeature,
): boolean {
  return SEO_MATRIX[feature].includes(plan);
}

export function canEditCustomSeo(plan: SubscriptionPlan): boolean {
  return hasSeoFeature(plan, "CUSTOM_SEO");
}

export function canEditMultilingualSeo(plan: SubscriptionPlan): boolean {
  return hasSeoFeature(plan, "MULTILINGUAL_SEO");
}

export function canUseStructuredData(plan: SubscriptionPlan): boolean {
  return hasSeoFeature(plan, "STRUCTURED_DATA");
}

export function canUseHreflang(plan: SubscriptionPlan): boolean {
  return hasSeoFeature(plan, "HREFLANG");
}

export function canUseSeoRedirects(plan: SubscriptionPlan): boolean {
  return hasSeoFeature(plan, "SEO_REDIRECTS");
}

export function canUseSeoAnalytics(plan: SubscriptionPlan): boolean {
  return hasSeoFeature(plan, "SEO_ANALYTICS");
}

export function canUseCustomDomainSeo(plan: SubscriptionPlan): boolean {
  return hasCapability(plan, "CUSTOM_DOMAIN");
}
