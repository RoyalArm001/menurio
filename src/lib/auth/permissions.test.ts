import { describe, it, expect } from "vitest";
import {
  hasPermission,
  roleMeetsMinimum,
  assertPermission,
  AuthorizationError,
} from "@/lib/auth/permissions";

describe("authorization", () => {
  it("OWNER has all permissions", () => {
    expect(hasPermission("OWNER", "subscription:manage")).toBe(true);
    expect(hasPermission("OWNER", "menu:write")).toBe(true);
  });

  it("ORDER_OPERATOR can read orders but not manage members", () => {
    expect(hasPermission("ORDER_OPERATOR", "order:read")).toBe(true);
    expect(hasPermission("ORDER_OPERATOR", "member:manage")).toBe(false);
  });

  it("EDITOR can write menu but not cancel orders", () => {
    expect(hasPermission("EDITOR", "menu:write")).toBe(true);
    expect(hasPermission("EDITOR", "order:cancel")).toBe(false);
  });

  it("role hierarchy compares correctly", () => {
    expect(roleMeetsMinimum("ADMIN", "MANAGER")).toBe(true);
    expect(roleMeetsMinimum("EDITOR", "MANAGER")).toBe(false);
  });

  it("assertPermission throws for insufficient role", () => {
    expect(() =>
      assertPermission("ORDER_OPERATOR", "restaurant:delete"),
    ).toThrow(AuthorizationError);
  });

  it("unauthorized users cannot modify branding", () => {
    expect(hasPermission("ORDER_OPERATOR", "restaurant:update")).toBe(false);
    expect(hasPermission("EDITOR", "restaurant:update")).toBe(false);
    expect(hasPermission("ADMIN", "restaurant:update")).toBe(true);
  });
});
