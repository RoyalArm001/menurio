import { describe, it, expect } from "vitest";
import {
  domainVerificationHostname,
  normalizeCustomHostname,
  parsePlatformSubdomain,
  txtRecordsContainVerificationToken,
} from "@/services/domain.service";

describe("domain resolution", () => {
  it("extracts slug from platform subdomain", () => {
    expect(parsePlatformSubdomain("lavash.menurio.store", "menurio.store")).toBe(
      "lavash",
    );
  });

  it("returns null for apex platform domain", () => {
    expect(parsePlatformSubdomain("menurio.store", "menurio.store")).toBeNull();
    expect(parsePlatformSubdomain("www.menurio.store", "menurio.store")).toBeNull();
  });

  it("returns null for unrelated hostnames", () => {
    expect(parsePlatformSubdomain("menu.restaurant.am", "menurio.store")).toBeNull();
  });

  it("returns null for nested subdomains", () => {
    expect(
      parsePlatformSubdomain("a.b.menurio.store", "menurio.store"),
    ).toBeNull();
  });

  it("is case insensitive", () => {
    expect(parsePlatformSubdomain("Lavash.Menurio.STORE", "menurio.store")).toBe(
      "lavash",
    );
  });

  it("normalizes only valid custom hostnames", () => {
    expect(normalizeCustomHostname("Menu.Restaurant.am.")).toBe(
      "menu.restaurant.am",
    );
    expect(() => normalizeCustomHostname("https://restaurant.am")).toThrow();
    expect(() => normalizeCustomHostname("restaurant.am:443")).toThrow();
  });

  it("matches only the expected DNS verification TXT token", () => {
    const token = "abc-123";
    expect(domainVerificationHostname("restaurant.am")).toBe(
      "_menurio-verify.restaurant.am",
    );
    expect(
      txtRecordsContainVerificationToken([["menurio-verification=abc-123"]], token),
    ).toBe(true);
    expect(txtRecordsContainVerificationToken([["different-token"]], token)).toBe(
      false,
    );
  });
});
