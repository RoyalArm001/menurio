import { describe, expect, it } from "vitest";
import { getPublicSiteUi, resolvePublicLanguage } from "@/lib/i18n/public-languages";

describe("public language resolution", () => {
  it("defaults to Armenian when no language is requested", () => {
    expect(resolvePublicLanguage(null)).toBe("hy");
  });

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

  it("uses Armenian UI labels when a dynamic locale has no platform UI copy", () => {
    expect(getPublicSiteUi("fr").menu).toBe("Մենյու");
  });
});
