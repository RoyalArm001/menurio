/** Centralized subscription capabilities — never scatter plan-name checks */
export const CAPABILITIES = {
  CUSTOM_DOMAIN: "CUSTOM_DOMAIN",
  ADVANCED_ANALYTICS: "ADVANCED_ANALYTICS",
  ADVANCED_SEO: "ADVANCED_SEO",
  AI_IMPORT: "AI_IMPORT",
  ORDERING: "ORDERING",
  MULTI_BRANCH: "MULTI_BRANCH",
  MAX_LANGUAGES: "MAX_LANGUAGES",
  MULTI_USER: "MULTI_USER",
  TABLE_ORDERING: "TABLE_ORDERING",
  WAITER_CALL: "WAITER_CALL",
  PRIORITY_SUPPORT: "PRIORITY_SUPPORT",
  CUSTOM_LOGO: "CUSTOM_LOGO",
  CUSTOM_COVER: "CUSTOM_COVER",
  BRAND_COLORS: "BRAND_COLORS",
  PRO_THEMES: "PRO_THEMES",
  ADVANCED_DESIGN: "ADVANCED_DESIGN",
  CUSTOM_FAVICON: "CUSTOM_FAVICON",
  WHITE_LABEL: "WHITE_LABEL",
  CUSTOM_CSS: "CUSTOM_CSS",
  PWA_INSTALL: "PWA_INSTALL",
  PUSH_NOTIFICATIONS: "PUSH_NOTIFICATIONS",
  PUSH_SCHEDULING: "PUSH_SCHEDULING",
  PUSH_CAMPAIGN_HISTORY: "PUSH_CAMPAIGN_HISTORY",
  PUSH_SEGMENTATION: "PUSH_SEGMENTATION",
} as const;

export type Capability = (typeof CAPABILITIES)[keyof typeof CAPABILITIES];
export type SubscriptionPlan = "FREE" | "START" | "PRO" | "PRO_PLUS";

export interface PlanEntitlements {
  CUSTOM_DOMAIN: boolean;
  ADVANCED_ANALYTICS: boolean;
  ADVANCED_SEO: boolean;
  AI_IMPORT: boolean;
  ORDERING: boolean;
  MULTI_BRANCH: boolean;
  MAX_LANGUAGES: number;
  MULTI_USER: boolean;
  TABLE_ORDERING: boolean;
  WAITER_CALL: boolean;
  PRIORITY_SUPPORT: boolean;
  CUSTOM_LOGO: boolean;
  CUSTOM_COVER: boolean;
  BRAND_COLORS: boolean;
  PRO_THEMES: boolean;
  ADVANCED_DESIGN: boolean;
  CUSTOM_FAVICON: boolean;
  WHITE_LABEL: boolean;
  CUSTOM_CSS: boolean;
  PWA_INSTALL: boolean;
  PUSH_NOTIFICATIONS: boolean;
  PUSH_SCHEDULING: boolean;
  PUSH_CAMPAIGN_HISTORY: boolean;
  PUSH_SEGMENTATION: boolean;
}

/** Pricing in AMD/month — centralized configuration */
export const PLAN_PRICING: Record<
  SubscriptionPlan,
  { monthlyAmd: number; label: string; freeMonths?: number }
> = {
  FREE: { monthlyAmd: 0, label: "0 AMD", freeMonths: 12 },
  START: { monthlyAmd: 2500, label: "2,500 AMD/month" },
  PRO: { monthlyAmd: 4900, label: "4,900 AMD/month" },
  PRO_PLUS: { monthlyAmd: 9900, label: "9,900 AMD/month" },
};

export const PLAN_ENTITLEMENTS: Record<SubscriptionPlan, PlanEntitlements> = {
  FREE: {
    CUSTOM_DOMAIN: false,
    ADVANCED_ANALYTICS: false,
    ADVANCED_SEO: false,
    AI_IMPORT: false,
    ORDERING: false,
    MULTI_BRANCH: false,
    MAX_LANGUAGES: 1,
    MULTI_USER: false,
    TABLE_ORDERING: false,
    WAITER_CALL: false,
    PRIORITY_SUPPORT: false,
    CUSTOM_LOGO: true,
    CUSTOM_COVER: true,
    BRAND_COLORS: false,
    PRO_THEMES: false,
    ADVANCED_DESIGN: false,
    CUSTOM_FAVICON: false,
    WHITE_LABEL: false,
    CUSTOM_CSS: false,
    PWA_INSTALL: false,
    PUSH_NOTIFICATIONS: false,
    PUSH_SCHEDULING: false,
    PUSH_CAMPAIGN_HISTORY: false,
    PUSH_SEGMENTATION: false,
  },
  START: {
    CUSTOM_DOMAIN: false,
    ADVANCED_ANALYTICS: false,
    ADVANCED_SEO: false,
    AI_IMPORT: false,
    ORDERING: false,
    MULTI_BRANCH: false,
    MAX_LANGUAGES: 3,
    MULTI_USER: true,
    TABLE_ORDERING: false,
    WAITER_CALL: false,
    PRIORITY_SUPPORT: false,
    CUSTOM_LOGO: true,
    CUSTOM_COVER: true,
    BRAND_COLORS: true,
    PRO_THEMES: true,
    ADVANCED_DESIGN: false,
    CUSTOM_FAVICON: false,
    WHITE_LABEL: false,
    CUSTOM_CSS: false,
    PWA_INSTALL: false,
    PUSH_NOTIFICATIONS: false,
    PUSH_SCHEDULING: false,
    PUSH_CAMPAIGN_HISTORY: false,
    PUSH_SEGMENTATION: false,
  },
  PRO: {
    CUSTOM_DOMAIN: false,
    ADVANCED_ANALYTICS: true,
    ADVANCED_SEO: true,
    AI_IMPORT: true,
    ORDERING: true,
    MULTI_BRANCH: true,
    MAX_LANGUAGES: 5,
    MULTI_USER: true,
    TABLE_ORDERING: false,
    WAITER_CALL: false,
    PRIORITY_SUPPORT: false,
    CUSTOM_LOGO: true,
    CUSTOM_COVER: true,
    BRAND_COLORS: true,
    PRO_THEMES: true,
    ADVANCED_DESIGN: true,
    CUSTOM_FAVICON: true,
    WHITE_LABEL: false,
    CUSTOM_CSS: false,
    PWA_INSTALL: true,
    PUSH_NOTIFICATIONS: true,
    PUSH_SCHEDULING: false,
    PUSH_CAMPAIGN_HISTORY: false,
    PUSH_SEGMENTATION: false,
  },
  PRO_PLUS: {
    CUSTOM_DOMAIN: true,
    ADVANCED_ANALYTICS: true,
    ADVANCED_SEO: true,
    AI_IMPORT: true,
    ORDERING: true,
    MULTI_BRANCH: true,
    MAX_LANGUAGES: 8,
    MULTI_USER: true,
    TABLE_ORDERING: true,
    WAITER_CALL: true,
    PRIORITY_SUPPORT: true,
    CUSTOM_LOGO: true,
    CUSTOM_COVER: true,
    BRAND_COLORS: true,
    PRO_THEMES: true,
    ADVANCED_DESIGN: true,
    CUSTOM_FAVICON: true,
    WHITE_LABEL: true,
    CUSTOM_CSS: true,
    PWA_INSTALL: true,
    PUSH_NOTIFICATIONS: true,
    PUSH_SCHEDULING: true,
    PUSH_CAMPAIGN_HISTORY: true,
    PUSH_SEGMENTATION: true,
  },
};

export function getEntitlements(plan: SubscriptionPlan): PlanEntitlements {
  return PLAN_ENTITLEMENTS[plan];
}

export function hasCapability(
  plan: SubscriptionPlan,
  capability: Exclude<Capability, "MAX_LANGUAGES">,
): boolean {
  return getEntitlements(plan)[capability];
}

export function getMaxLanguages(plan: SubscriptionPlan): number {
  return getEntitlements(plan).MAX_LANGUAGES;
}

export function assertCapability(
  plan: SubscriptionPlan,
  capability: Exclude<Capability, "MAX_LANGUAGES">,
): void {
  if (!hasCapability(plan, capability)) {
    throw new EntitlementError(capability, plan);
  }
}

export function assertLanguageCount(
  plan: SubscriptionPlan,
  count: number,
): void {
  if (count > getMaxLanguages(plan)) {
    throw new EntitlementError("MAX_LANGUAGES", plan);
  }
}

export function canUsePwa(plan: SubscriptionPlan): boolean {
  return hasCapability(plan, "PWA_INSTALL");
}

export function canUsePush(plan: SubscriptionPlan): boolean {
  return hasCapability(plan, "PUSH_NOTIFICATIONS");
}

export function canSchedulePush(plan: SubscriptionPlan): boolean {
  return hasCapability(plan, "PUSH_SCHEDULING");
}

export function canUsePushCampaignHistory(plan: SubscriptionPlan): boolean {
  return hasCapability(plan, "PUSH_CAMPAIGN_HISTORY");
}

export function canUsePushSegmentation(plan: SubscriptionPlan): boolean {
  return hasCapability(plan, "PUSH_SEGMENTATION");
}

export class EntitlementError extends Error {
  constructor(
    public readonly capability: Capability,
    public readonly plan: SubscriptionPlan,
  ) {
    super(`Plan ${plan} does not include capability ${capability}`);
    this.name = "EntitlementError";
  }
}
