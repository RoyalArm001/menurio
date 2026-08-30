import { describe, it, expect } from "vitest";
import {
  hasSeoFeature,
  canEditCustomSeo,
  canUseStructuredData,
  canUseSeoAnalytics,
} from "@/lib/entitlements/seo";

describe("SEO entitlements", () => {
  it("FREE gets automatic metadata only", () => {
    expect(hasSeoFeature("FREE", "AUTO_METADATA")).toBe(true);
    expect(canEditCustomSeo("FREE")).toBe(false);
    expect(canUseStructuredData("FREE")).toBe(false);
  });

  it("PRO gets custom and structured SEO", () => {
    expect(canEditCustomSeo("PRO")).toBe(true);
    expect(canUseStructuredData("PRO")).toBe(true);
    expect(hasSeoFeature("PRO", "HREFLANG")).toBe(true);
    expect(canUseSeoAnalytics("PRO")).toBe(false);
  });

  it("PRO_PLUS gets analytics integration", () => {
    expect(canUseSeoAnalytics("PRO_PLUS")).toBe(true);
    expect(hasSeoFeature("PRO_PLUS", "SEO_REDIRECTS")).toBe(true);
  });
});
