"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type { RestaurantTheme } from "@/lib/themes/restaurant-themes";
import { getTheme } from "@/lib/themes/restaurant-themes";
import type { ResolvedRestaurantDesign } from "@/lib/design/resolve";
import type { SubscriptionPlan } from "@/lib/entitlements";

export type RestaurantTranslation = {
  languageCode: string;
  name: string;
  description: string | null;
  tagline: string | null;
};

export type PublicRestaurantData = {
  slug: string;
  id: string;
  name: string;
  description: string | null;
  tagline: string | null;
  translations: RestaurantTranslation[];
  logoUrl: string | null;
  coverImageUrl: string | null;
  defaultLanguage: string;
  supportedLanguages: string[];
  publicBasePath: string;
  customHostname: string | null;
  currency: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  tableOrderingEnabled: boolean;
  waiterCallEnabled: boolean;
  socialLinks: { instagram?: string; facebook?: string };
  themeSlug: string;
  tableLabel?: string | null;
  design: ResolvedRestaurantDesign;
  plan: SubscriptionPlan;
  pwa: {
    enabled: boolean;
    canInstall: boolean;
    displayName: string;
    iconUrl: string;
  };
  push: {
    enabled: boolean;
    canSubscribe: boolean;
    vapidPublicKey: string | null;
  };
};

const PublicRestaurantContext = createContext<PublicRestaurantData | null>(null);

export function PublicRestaurantProvider({
  data,
  children,
}: {
  data: PublicRestaurantData;
  children: ReactNode;
}) {
  return (
    <PublicRestaurantContext.Provider value={data}>
      {children}
    </PublicRestaurantContext.Provider>
  );
}

export function usePublicRestaurant() {
  const ctx = useContext(PublicRestaurantContext);
  if (!ctx) throw new Error("usePublicRestaurant requires provider");
  return ctx;
}

export function usePublicTheme(): RestaurantTheme {
  const restaurant = usePublicRestaurant();
  return restaurant.design?.theme ?? getTheme(restaurant.themeSlug);
}

export function usePublicDesign(): ResolvedRestaurantDesign {
  return usePublicRestaurant().design;
}
