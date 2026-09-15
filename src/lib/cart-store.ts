"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CategorySlug } from "./types";

export interface CartItem {
  key: string; // identifiant unique combinant produit + variantes
  productId: string;
  slug: string;
  name: string;
  price: number;
  category: CategorySlug;
  quantity: number;
  size?: string;
  color?: string;
  customization?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "key">) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
}

function buildKey(item: Omit<CartItem, "key">): string {
  return [item.productId, item.size ?? "", item.color ?? "", item.customization ?? ""].join("|");
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const key = buildKey(item);
          const existing = state.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.key === key ? { ...i, quantity: i.quantity + item.quantity } : i
              )
            };
          }
          return { items: [...state.items, { ...item, key }] };
        }),
      removeItem: (key) => set((state) => ({ items: state.items.filter((i) => i.key !== key) })),
      updateQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i))
        })),
      clear: () => set({ items: [] })
    }),
    { name: "luxurious-palace-cart" }
  )
);

export function useCartCount(): number {
  return useCartStore((state) => state.items.reduce((sum, i) => sum + i.quantity, 0));
}

export function useCartSubtotal(): number {
  return useCartStore((state) => state.items.reduce((sum, i) => sum + i.quantity * i.price, 0));
}
