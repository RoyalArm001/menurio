"use client";

import { useEffect } from "react";
import { usePublicRestaurant } from "@/contexts/public-restaurant-context";

export function PublicPwaManager() {
  const restaurant = usePublicRestaurant();

  useEffect(() => {
    if (!restaurant.pwa.enabled || typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const swUrl = `${restaurant.publicBasePath}/sw.js`;
    navigator.serviceWorker
      .register(swUrl, { scope: restaurant.publicBasePath || "/" })
      .catch(() => {
        /* SW optional — page still works without it */
      });
  }, [restaurant.pwa.enabled, restaurant.publicBasePath]);

  return null;
}
