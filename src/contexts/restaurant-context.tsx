"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api, ApiError } from "@/lib/api/client";

const STORAGE_KEY = "ws_active_restaurant_id";

type RestaurantSummary = {
  id: string;
  slug: string;
  name: string;
  role: string;
};

type RestaurantContextValue = {
  restaurants: RestaurantSummary[];
  activeRestaurant: RestaurantSummary | null;
  setActiveRestaurantId: (id: string) => void;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const RestaurantContext = createContext<RestaurantContextValue | null>(null);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [restaurants, setRestaurants] = useState<RestaurantSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listRestaurants();
      const list = data.restaurants.map((r) => ({
        id: r.restaurant.id,
        slug: r.restaurant.slug,
        name: r.restaurant.name,
        role: r.role,
      }));
      setRestaurants(list);

      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;
      const nextId =
        stored && list.some((r) => r.id === stored)
          ? stored
          : list[0]?.id ?? null;
      setActiveId(nextId);
      if (nextId) localStorage.setItem(STORAGE_KEY, nextId);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load restaurants on mount
    void refresh();
  }, []);

  const setActiveRestaurantId = (id: string) => {
    setActiveId(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const activeRestaurant =
    restaurants.find((r) => r.id === activeId) ?? null;

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        activeRestaurant,
        setActiveRestaurantId,
        loading,
        error,
        refresh,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error("useRestaurant requires RestaurantProvider");
  return ctx;
}
