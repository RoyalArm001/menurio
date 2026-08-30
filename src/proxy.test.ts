import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const domainMocks = vi.hoisted(() => ({
  isPlatformRootHostname: vi.fn(),
  resolveTenantFromHostname: vi.fn(),
}));

vi.mock("@/services/domain.service", () => domainMocks);

import { proxy } from "@/proxy";

describe("proxy", () => {
  beforeEach(() => {
    domainMocks.isPlatformRootHostname.mockReturnValue(false);
    domainMocks.resolveTenantFromHostname.mockResolvedValue({
      restaurantId: "restaurant-id",
      slug: "art-lunch",
      hostname: "menu.example.am",
      source: "custom_domain",
    });
  });

  it("rewrites a verified custom-domain menu path to the tenant route", async () => {
    const response = await proxy(
      new NextRequest("https://menu.example.am/menu?lang=fr"),
    );

    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "https://menu.example.am/r/art-lunch/menu?lang=fr",
    );
  });

  it("rejects a mutating API request without a same-origin header", async () => {
    const response = await proxy(
      new NextRequest("https://menurio.store/api/analytics", { method: "POST" }),
    );

    expect(response.status).toBe(403);
  });
});
