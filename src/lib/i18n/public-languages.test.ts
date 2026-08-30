import { describe, expect, it } from "vitest";
import { getPublicSiteUi, resolvePublicLanguage } from "@/lib/i18n/public-languages";

describe("public language resolution", () => {
  it("preserves a supported dynamic locale", () => {
    expect(
      resolvePublicLanguage("fr", ["hy", "en", "fr"], "hy"),
    ).toBe("fr");
  });

  it("matches locale casing to the stored restaurant language", () => {
    expect(
      resolvePublicLanguage("pt-br", ["en", "pt-BR"], "en"),
    ).toBe("pt-BR");
  });

  it("uses English UI labels when a dynamic locale has no platform UI copy", () => {
    expect(getPublicSiteUi("fr").menu).toBe("Menu");
  });
});
