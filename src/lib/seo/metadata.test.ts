import { describe, expect, it } from "vitest";
import {
  buildMenuJsonLd,
  buildRestaurantMetadata,
  serializeJsonLd,
} from "@/lib/seo/metadata";

const restaurant = {
  name: "Avena",
  slug: "avena",
  description: "Armenian soul, Mediterranean rhythm.",
  logoUrl: null,
  defaultLanguage: "en",
  supportedLanguages: ["en", "hy", "ru"],
} as never;

describe("restaurant SEO metadata", () => {
  it("keeps the default language canonical clean and localizes alternates", () => {
    const metadata = buildRestaurantMetadata({ restaurant });
    const languages = metadata.alternates?.languages as Record<string, string>;

    expect(metadata.alternates?.canonical?.toString()).toContain("/r/avena");
    expect(languages.en).toContain("/r/avena");
    expect(languages.en).not.toContain("lang=en");
    expect(languages.hy).toContain("/r/avena?lang=hy");
    expect(languages["x-default"]).toContain("/r/avena");
  });

  it("escapes JSON-LD before it is placed inside a script tag", () => {
    const serialized = serializeJsonLd({
      name: '</script><script>alert("x")</script>',
      description: "Fish & wine\u2028menu",
    });

    expect(serialized).not.toContain("<");
    expect(serialized).not.toContain(">");
    expect(serialized).not.toContain("&");
    expect(serialized).toContain("\\u003c/script\\u003e");
    expect(serialized).toContain("\\u0026");
    expect(serialized).toContain("\\u2028");
  });

  it("adds language to menu structured data when available", () => {
    const schema = buildMenuJsonLd({
      restaurantName: "Avena",
      restaurantUrl: "https://menurio.store/r/avena",
      menuName: "Dinner",
      language: "hy",
      items: [
        {
          name: "Tolma",
          description: "Grape leaves",
          price: "4200",
          currency: "AMD",
        },
      ],
    });

    expect(schema.inLanguage).toBe("hy");
  });
});
