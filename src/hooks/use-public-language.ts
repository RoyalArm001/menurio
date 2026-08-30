"use client";

import { useSearchParams } from "next/navigation";
import {
  getPublicSiteUi,
  resolvePublicLanguage,
  type PublicLanguage,
  type PublicSiteUi,
} from "@/lib/i18n/public-languages";
import { usePublicRestaurant } from "@/contexts/public-restaurant-context";

export function usePublicLanguage(): {
  lang: PublicLanguage;
  ui: PublicSiteUi;
  langQuery: string | null;
} {
  const searchParams = useSearchParams();
  const restaurant = usePublicRestaurant();
  const langParam = searchParams.get("lang");
  const lang = resolvePublicLanguage(
    langParam ?? restaurant.defaultLanguage,
    restaurant.supportedLanguages,
    restaurant.defaultLanguage,
  );

  return {
    lang,
    ui: getPublicSiteUi(lang),
    langQuery: langParam ?? (lang !== restaurant.defaultLanguage ? lang : null),
  };
}

export function useLocalizedRestaurantContent() {
  const { lang } = usePublicLanguage();
  const restaurant = usePublicRestaurant();

  const translation =
    restaurant.translations.find((t) => t.languageCode === lang) ??
    restaurant.translations.find(
      (t) => t.languageCode === restaurant.defaultLanguage,
    ) ??
    restaurant.translations[0];

  return {
    name: translation?.name ?? restaurant.name,
    description: translation?.description ?? restaurant.description,
    tagline: translation?.tagline ?? restaurant.tagline,
  };
}
