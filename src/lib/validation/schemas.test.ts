import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/format";
import { createRestaurantSchema } from "@/lib/validation/schemas";

describe("international restaurant input", () => {
  it("canonicalizes supported BCP 47 language tags and ISO currency codes", () => {
    const input = createRestaurantSchema.parse({
      name: "Cafe International",
      defaultLanguage: "pt-br",
      supportedLanguages: ["pt-br", "es-419", "zh-Hans"],
      currency: "usd",
      timezone: "America/Sao_Paulo",
    });

    expect(input.defaultLanguage).toBe("pt-BR");
    expect(input.supportedLanguages).toEqual(["pt-BR", "es-419", "zh-Hans"]);
    expect(input.currency).toBe("USD");
  });

  it("rejects malformed language, currency, and time-zone values", () => {
    expect(
      createRestaurantSchema.safeParse({
        name: "Cafe International",
        defaultLanguage: "not_a_locale",
        currency: "ZZZ",
        timezone: "Mars/Olympus",
      }).success,
    ).toBe(false);
  });

  it("formats restaurant prices using the requested currency and locale", () => {
    expect(formatPrice(12.5, "USD", "en-US")).toContain("12.50");
    expect(formatPrice(1250, "EUR", "de-DE")).toContain("1.250");
  });
});
