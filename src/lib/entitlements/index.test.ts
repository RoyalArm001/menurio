import { describe, it, expect } from "vitest";
import {
  hasCapability,
  getMaxLanguages,
  assertCapability,
  EntitlementError,
  PLAN_ENTITLEMENTS,
} from "@/lib/entitlements";

describe("subscription entitlements", () => {
  it("FREE plan disables ordering and custom domains", () => {
    expect(hasCapability("FREE", "ORDERING")).toBe(false);
    expect(hasCapability("FREE", "CUSTOM_DOMAIN")).toBe(false);
    expect(getMaxLanguages("FREE")).toBe(1);
  });

  it("START includes 3 languages without ordering", () => {
    expect(getMaxLanguages("START")).toBe(3);
    expect(hasCapability("START", "ORDERING")).toBe(false);
  });

  it("PRO_PLUS enables all boolean capabilities", () => {
    expect(hasCapability("PRO_PLUS", "CUSTOM_DOMAIN")).toBe(true);
    expect(hasCapability("PRO_PLUS", "AI_IMPORT")).toBe(true);
    expect(getMaxLanguages("PRO_PLUS")).toBe(8);
  });

  it("assertCapability throws EntitlementError when missing", () => {
    expect(() => assertCapability("FREE", "ORDERING")).toThrow(EntitlementError);
  });

  it("defines entitlements for every plan", () => {
    for (const plan of ["FREE", "START", "PRO", "PRO_PLUS"] as const) {
      expect(PLAN_ENTITLEMENTS[plan]).toBeDefined();
    }
  });

  it("FREE keeps logo/cover but not white-label or custom CSS", () => {
    expect(hasCapability("FREE", "CUSTOM_LOGO")).toBe(true);
    expect(hasCapability("FREE", "CUSTOM_COVER")).toBe(true);
    expect(hasCapability("FREE", "BRAND_COLORS")).toBe(false);
    expect(hasCapability("FREE", "WHITE_LABEL")).toBe(false);
    expect(hasCapability("FREE", "CUSTOM_CSS")).toBe(false);
  });

  it("START unlocks brand colors and professional themes", () => {
    expect(hasCapability("START", "BRAND_COLORS")).toBe(true);
    expect(hasCapability("START", "PRO_THEMES")).toBe(true);
    expect(hasCapability("START", "ADVANCED_DESIGN")).toBe(false);
  });

  it("PRO unlocks advanced design and favicon", () => {
    expect(hasCapability("PRO", "ADVANCED_DESIGN")).toBe(true);
    expect(hasCapability("PRO", "CUSTOM_FAVICON")).toBe(true);
    expect(hasCapability("PRO", "WHITE_LABEL")).toBe(false);
  });

  it("PRO_PLUS unlocks white-label and custom CSS", () => {
    expect(hasCapability("PRO_PLUS", "WHITE_LABEL")).toBe(true);
    expect(hasCapability("PRO_PLUS", "CUSTOM_CSS")).toBe(true);
    expect(hasCapability("PRO_PLUS", "CUSTOM_DOMAIN")).toBe(true);
  });
});
