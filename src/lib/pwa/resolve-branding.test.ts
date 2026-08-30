import { describe, it, expect } from "vitest";
import { resolvePwaBranding } from "@/lib/pwa/resolve-branding";
import { PLATFORM_BRANDING } from "@/lib/platform/branding";

describe("resolvePwaBranding", () => {
  it("uses pwa display name when set", () => {
    const branding = resolvePwaBranding({
      restaurantName: "Art Lunch",
      pwaDisplayName: "Art Lunch App",
    });
    expect(branding.name).toBe("Art Lunch App");
  });

  it("falls back to restaurant name", () => {
    const branding = resolvePwaBranding({ restaurantName: "Art Lunch" });
    expect(branding.name).toBe("Art Lunch");
  });

  it("falls back to Menurio icon when no logo", () => {
    const branding = resolvePwaBranding({ restaurantName: "Art Lunch" });
    expect(branding.iconUrl).toBe(PLATFORM_BRANDING.icon192);
  });

  it("prefers pwa icon over logo", () => {
    const branding = resolvePwaBranding({
      restaurantName: "Art Lunch",
      logoUrl: "https://cdn.example/logo.png",
      pwaIconUrl: "https://cdn.example/pwa.png",
    });
    expect(branding.iconUrl).toBe("https://cdn.example/pwa.png");
  });
});
