"use client";

import { useSearchParams } from "next/navigation";
import {
  getMarketingUi,
  type MarketingUi,
} from "@/lib/i18n/marketing";
import {
  getPublicSiteUi,
  resolvePublicLanguage,
  type PublicLanguage,
  type PublicSiteUi,
} from "@/lib/i18n/public-languages";

export function useAppLanguage(defaultLanguage: PublicLanguage = "en"): {
  lang: PublicLanguage;
  ui: PublicSiteUi;
  marketing: MarketingUi;
} {
  const searchParams = useSearchParams();
  const lang = resolvePublicLanguage(
    searchParams.get("lang") ?? defaultLanguage,
  );

  return {
    lang,
    ui: getPublicSiteUi(lang),
    marketing: getMarketingUi(lang),
  };
}
