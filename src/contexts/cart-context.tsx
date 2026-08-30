"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";

export type CartProduct = {
  id: string;
  name: string;
  price: number;
  image?: string;
  available?: boolean;
};

export type CartItem = {
  product: CartProduct;
  quantity: number;
  notes?: string;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: CartProduct) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: CartProduct) => {
    if (product.available === false) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i,
      ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { total, count } = useMemo(() => {
    const total = items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0,
    );
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    return { total, count };
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clear, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
