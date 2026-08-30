"use client";

import { usePublicRestaurant } from "@/contexts/public-restaurant-context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";

export function PublicLanguageSwitcher({
  className,
}: {
  className?: string;
}) {
  const restaurant = usePublicRestaurant();
  return (
    <LanguageSwitcher
      defaultLanguage={restaurant.defaultLanguage}
      supportedLanguages={restaurant.supportedLanguages}
      className={className}
    />
  );
}
