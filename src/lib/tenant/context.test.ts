import { describe, it, expect } from "vitest";
import { assertTenantScope } from "@/lib/tenant/context";
import { AuthorizationError } from "@/lib/auth/permissions";

describe("tenant isolation", () => {
  it("allows matching restaurant IDs", () => {
    expect(() =>
      assertTenantScope("abc-123", "abc-123"),
    ).not.toThrow();
  });

  it("rejects cross-tenant access", () => {
    expect(() =>
      assertTenantScope("tenant-a", "tenant-b"),
    ).toThrow(AuthorizationError);
  });

  it("rejects empty or mismatched IDs", () => {
    expect(() => assertTenantScope("", "tenant-b")).toThrow();
  });
});
