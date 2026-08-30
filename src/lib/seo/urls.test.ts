import { describe, expect, it } from "vitest";
import {
  buildAbsolutePublicUrl,
  buildHreflangAlternates,
  buildLocalizedPublicPath,
  buildLocalizedPublicUrl,
  joinPublicPath,
  normalizeSeoLanguages,
} from "@/lib/seo/urls";

describe("SEO URL helpers", () => {
  it("normalizes languages with the default language first", () => {
    expect(normalizeSeoLanguages("en", ["hy", "EN", "ru", ""])).toEqual([
      "en",
      "hy",
      "ru",
    ]);
  });

  it("builds clean localized paths", () => {
    expect(
      buildLocalizedPublicPath({
        publicBasePath: "/r/avena",
        language: "en",
        defaultLanguage: "en",
      }),
    ).toBe("/r/avena");

    expect(
      buildLocalizedPublicPath({
        publicBasePath: "/r/avena",
        language: "hy",
        defaultLanguage: "en",
      }),
    ).toBe("/r/avena?lang=hy");
  });

  it("joins platform and custom-domain public paths", () => {
    expect(joinPublicPath("/r/avena", "menu")).toBe("/r/avena/menu");
    expect(joinPublicPath("/", "menu")).toBe("/menu");
  });

  it("builds absolute public URLs with custom-domain support", () => {
    expect(buildAbsolutePublicUrl("/pricing", "https://menurio.store")).toBe(
      "https://menurio.store/pricing",
    );

    expect(
      buildLocalizedPublicUrl({
        publicBasePath: "/",
        language: "hy",
        defaultLanguage: "en",
        hostname: "restaurant.example",
        pathSuffix: "menu",
      }),
    ).toBe("https://restaurant.example/menu?lang=hy");
  });

  it("creates default, localized and x-default hreflang entries", () => {
    expect(
      buildHreflangAlternates({
        publicBasePath: "/r/avena",
        defaultLanguage: "en",
        languages: ["en", "hy"],
        hostname: "https://menurio.store",
      }),
    ).toEqual({
      en: "https://menurio.store/r/avena",
      hy: "https://menurio.store/r/avena?lang=hy",
      "x-default": "https://menurio.store/r/avena",
    });
  });
});
