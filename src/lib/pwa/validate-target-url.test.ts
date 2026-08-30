import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { validateNotificationTargetUrl } from "@/lib/pwa/validate-target-url";

describe("validateNotificationTargetUrl", () => {
  const original = process.env.NEXT_PUBLIC_APP_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = "https://menurio.store";
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = original;
  });

  it("defaults to restaurant home", () => {
    const result = validateNotificationTargetUrl("", "art-lunch");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.url).toBe("/r/art-lunch");
  });

  it("allows internal restaurant paths", () => {
    const result = validateNotificationTargetUrl(
      "/r/art-lunch?offer=summer",
      "art-lunch",
    );
    expect(result.ok).toBe(true);
  });

  it("rejects javascript URLs", () => {
    const result = validateNotificationTargetUrl(
      "javascript:alert(1)",
      "art-lunch",
    );
    expect(result.ok).toBe(false);
  });

  it("rejects other restaurant paths", () => {
    const result = validateNotificationTargetUrl("/r/other-cafe", "art-lunch");
    expect(result.ok).toBe(false);
  });
});
