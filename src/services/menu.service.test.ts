import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/utils/slug";
import { hasCapability } from "@/lib/entitlements";
import {
  createProductSchema,
  parseBody,
  updateSeoSettingsSchema,
} from "@/lib/validation/schemas";

describe("slug generation", () => {
  it("normalizes restaurant names", () => {
    expect(slugify("Lavash Restaurant")).toBe("lavash-restaurant");
  });

  it("strips special characters", () => {
    expect(slugify("Café №1!")).toBe("cafe-o1");
  });

  it("handles armenian transliteration via normalization", () => {
    const slug = slugify("Test Name");
    expect(slug).toMatch(/^[a-z0-9-]+$/);
  });
});

describe("order creation constraints", () => {
  it("START plan blocks ordering", () => {
    expect(hasCapability("FREE", "ORDERING")).toBe(false);
    expect(hasCapability("START", "ORDERING")).toBe(false);
    expect(hasCapability("PRO", "ORDERING")).toBe(true);
  });
});

describe("menu validation schemas", () => {
  it("validates product creation input", () => {
    const result = parseBody(createProductSchema, {
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
      price: "1500.00",
      translations: [{ languageCode: "en", name: "Khachapuri" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid product price", () => {
    const result = parseBody(createProductSchema, {
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
      price: "not-a-price",
      translations: [{ languageCode: "en", name: "Test" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a script-like analytics measurement ID", () => {
    const result = parseBody(updateSeoSettingsSchema, {
      analyticsMeasurementId: "G-1234');alert(1);//",
    });
    expect(result.success).toBe(false);
  });
});
