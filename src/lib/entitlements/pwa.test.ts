import { describe, it, expect } from "vitest";
import {
  canUsePwa,
  canUsePush,
  canSchedulePush,
  hasCapability,
} from "@/lib/entitlements";

describe("PWA and push entitlements", () => {
  it("FREE plan has no PWA or push", () => {
    expect(canUsePwa("FREE")).toBe(false);
    expect(canUsePush("FREE")).toBe(false);
    expect(canSchedulePush("FREE")).toBe(false);
  });

  it("START plan has no PWA or push", () => {
    expect(canUsePwa("START")).toBe(false);
    expect(canUsePush("START")).toBe(false);
  });

  it("PRO enables PWA and basic push", () => {
    expect(canUsePwa("PRO")).toBe(true);
    expect(canUsePush("PRO")).toBe(true);
    expect(canSchedulePush("PRO")).toBe(false);
    expect(hasCapability("PRO", "PUSH_CAMPAIGN_HISTORY")).toBe(false);
  });

  it("PRO_PLUS enables scheduling and campaign history", () => {
    expect(canUsePwa("PRO_PLUS")).toBe(true);
    expect(canUsePush("PRO_PLUS")).toBe(true);
    expect(canSchedulePush("PRO_PLUS")).toBe(true);
    expect(hasCapability("PRO_PLUS", "PUSH_CAMPAIGN_HISTORY")).toBe(true);
    expect(hasCapability("PRO_PLUS", "PUSH_SEGMENTATION")).toBe(true);
  });
});
