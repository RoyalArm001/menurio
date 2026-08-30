import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, validatePasswordStrength } from "@/lib/auth/password";

describe("password security", () => {
  it("hashes and verifies passwords", async () => {
    const hash = await hashPassword("secure-password-123");
    expect(hash).not.toContain("secure-password");
    expect(await verifyPassword("secure-password-123", hash)).toBe(true);
    expect(await verifyPassword("wrong-password", hash)).toBe(false);
  });

  it("rejects weak passwords", () => {
    expect(validatePasswordStrength("short")).toMatch(/8 characters/);
    expect(validatePasswordStrength("long-enough-password")).toBeNull();
  });
});
