import { describe, expect, it } from "vitest";

import { buildRestaurantWebManifest } from "@/services/pwa.service";
import { PLATFORM_BRANDING } from "@/lib/platform/branding";

describe("restaurant PWA manifest", () => {
  it("uses restaurant branding and keeps the start URL inside its scope", () => {
    const manifest = buildRestaurantWebManifest({
      slug: "art-lunch",
      restaurantName: "Art Lunch",
      logoUrl: "https://cdn.example/logo.png",
      plan: "PRO",
      settings: {
        pwaDisplayName: "Art Lunch App",
      } as never,
    });

    expect(manifest.name).toBe("Art Lunch App");
    expect(manifest.start_url).toBe("/r/art-lunch");
    expect(manifest.scope).toBe("/r/art-lunch");
    expect(manifest.icons[0]?.src).toBe("https://cdn.example/logo.png");
  });

  it("uses the Menurio icon when a restaurant has no PWA icon or logo", () => {
    const manifest = buildRestaurantWebManifest({
      slug: "art-lunch",
      restaurantName: "Art Lunch",
      plan: "PRO",
    });

    expect(manifest.icons[0]?.src).toContain(PLATFORM_BRANDING.icon192);
  });

  it("serves matching Menurio PWA icon assets for each generated size", () => {
    const manifest = buildRestaurantWebManifest({
      slug: "art-lunch",
      restaurantName: "Art Lunch",
      plan: "PRO",
    });

    const icon192 = manifest.icons.find((icon) => icon.sizes === "192x192");
    const icon512 = manifest.icons.find((icon) => icon.sizes === "512x512");

    expect(icon192?.src).toContain(PLATFORM_BRANDING.icon192);
    expect(icon512?.src).toContain(PLATFORM_BRANDING.icon512);
  });

  it("uses the custom-domain root as the PWA scope", () => {
    const manifest = buildRestaurantWebManifest({
      slug: "art-lunch",
      restaurantName: "Art Lunch",
      plan: "PRO",
      publicBasePath: "/",
    });

    expect(manifest.start_url).toBe("/");
    expect(manifest.scope).toBe("/");
  });
});
