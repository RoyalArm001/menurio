import { describe, expect, it } from "vitest";
import { AuthorizationError } from "@/lib/auth/permissions";
import { EntitlementError } from "@/lib/entitlements";
import { assertTenantScope } from "@/lib/tenant/context";
import { sanitizeCustomCss, UnsafeCssError } from "@/lib/security/sanitize-css";
import { assertDesignPatchAllowed } from "@/lib/design/assert-patch";
import { resolveRestaurantDesign } from "@/lib/design/resolve";

describe("theme resolution", () => {
  it("returns tenant-specific branding instead of a global default", () => {
    const artLunch = resolveRestaurantDesign(
      {
        themeId: "elegant",
        primaryColor: "#7A4B2A",
        logoUrl: "https://cdn.example/art-lunch/logo.png",
        coverUrl: "https://cdn.example/art-lunch/cover.jpg",
      },
      "START",
    );
    const restaurantB = resolveRestaurantDesign(
      {
        themeId: "minimal",
        primaryColor: "#111111",
        logoUrl: "https://cdn.example/restaurant-b/logo.png",
      },
      "START",
    );

    expect(artLunch.themeId).toBe("elegant");
    expect(artLunch.colors.primary).toBe("#7A4B2A");
    expect(artLunch.logoUrl).toContain("art-lunch");
    expect(restaurantB.themeId).toBe("minimal");
    expect(restaurantB.logoUrl).toContain("restaurant-b");
    expect(artLunch.logoUrl).not.toBe(restaurantB.logoUrl);
  });

  it("downgrades advanced theme and white-label when the plan cannot use them", () => {
    const resolved = resolveRestaurantDesign(
      {
        themeId: "dark-premium",
        whiteLabelEnabled: true,
        customCssEnabled: true,
        customCss: "h1{color:red}",
        faviconUrl: "https://cdn.example/icon.png",
        primaryColor: "#ABCDEF",
      },
      "FREE",
    );

    expect(resolved.themeId).toBe("modern");
    expect(resolved.whiteLabelEnabled).toBe(false);
    expect(resolved.customCss).toBeNull();
    expect(resolved.faviconUrl).toBeNull();
    expect(resolved.colors.primary).toBe("#D95532");
  });

  it("lets START keep brand colors and PRO keep advanced layout", () => {
    const start = resolveRestaurantDesign(
      { themeId: "elegant", primaryColor: "#9A7B4F", buttonStyle: "square" },
      "START",
    );
    const pro = resolveRestaurantDesign(
      { themeId: "dark-premium", menuLayout: "editorial", navigationStyle: "minimal" },
      "PRO",
    );

    expect(start.colors.primary).toBe("#9A7B4F");
    expect(start.buttonStyle).toBe("square");
    expect(start.menuLayout).toBe("editorial");
    expect(pro.themeId).toBe("dark-premium");
    expect(pro.menuLayout).toBe("editorial");
    expect(pro.navigationStyle).toBe("minimal");
  });

  it("lets PRO+ activate white-label", () => {
    const resolved = resolveRestaurantDesign(
      { themeId: "modern", whiteLabelEnabled: true },
      "PRO_PLUS",
    );
    expect(resolved.whiteLabelEnabled).toBe(true);
  });
});

describe("design entitlement enforcement", () => {
  it("rejects FREE activating PRO+ white-label", () => {
    expect(() =>
      assertDesignPatchAllowed("FREE", { whiteLabelEnabled: true }),
    ).toThrow(EntitlementError);
  });

  it("lets START save allowed brand colors", () => {
    expect(() =>
      assertDesignPatchAllowed("START", {
        primaryColor: "#D95532",
        secondaryColor: "#8D3D32",
        accentColor: "#66715C",
      }),
    ).not.toThrow();
  });

  it("lets PRO save advanced layout settings", () => {
    expect(() =>
      assertDesignPatchAllowed("PRO", {
        menuLayout: "grid",
        navigationStyle: "transparent",
        imageStyle: "rounded",
        faviconAssetId: "550e8400-e29b-41d4-a716-446655440000",
      }),
    ).not.toThrow();
  });

  it("lets PRO+ activate white-label", () => {
    expect(() =>
      assertDesignPatchAllowed("PRO_PLUS", { whiteLabelEnabled: true }),
    ).not.toThrow();
  });

  it("lets FREE save a basic theme without paid design fields", () => {
    expect(() =>
      assertDesignPatchAllowed("FREE", { themeId: "modern" }),
    ).not.toThrow();
  });

  it("rejects unsupported design capability server-side", () => {
    expect(() =>
      assertDesignPatchAllowed("START", { customCss: "body{color:red}" }),
    ).toThrow(EntitlementError);
    expect(() =>
      assertDesignPatchAllowed("PRO", { whiteLabelEnabled: true }),
    ).toThrow(EntitlementError);
  });
});

describe("tenant isolation for branding", () => {
  it("Restaurant A cannot modify Restaurant B design", () => {
    expect(() =>
      assertTenantScope("restaurant-a", "restaurant-b"),
    ).toThrow(AuthorizationError);
  });

  it("same-tenant design writes stay in scope", () => {
    expect(() => assertTenantScope("restaurant-a", "restaurant-a")).not.toThrow();
  });
});

describe("custom CSS isolation", () => {
  it("rejects script injection", () => {
    expect(() =>
      sanitizeCustomCss("h1{color:red} </style><script>alert(1)</script>"),
    ).toThrow(UnsafeCssError);
    expect(() =>
      sanitizeCustomCss("body{background:url(javascript:alert(1))}"),
    ).toThrow(UnsafeCssError);
  });

  it("rejects HTML and event handlers", () => {
    expect(() => sanitizeCustomCss("<img src=x onerror=alert(1)>")).toThrow(
      UnsafeCssError,
    );
  });

  it("allows plain CSS declarations", () => {
    expect(sanitizeCustomCss("h1 { color: #111111; }")).toBe(
      "h1 { color: #111111; }",
    );
  });
});
