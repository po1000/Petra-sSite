"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = { slug: string; size: string; qty: number };

type CartState = {
  items: CartItem[];
  open: boolean;
  add: (slug: string, size: string) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      add: (slug, size) =>
        set((s) => {
          const found = s.items.find((i) => i.slug === slug && i.size === size);
          const items = found
            ? s.items.map((i) => (i === found ? { ...i, qty: Math.min(i.qty + 1, 10) } : i))
            : [...s.items, { slug, size, qty: 1 }];
          return { items, open: true };
        }),
      setQty: (slug, size, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.slug === slug && i.size === size ? { ...i, qty: Math.min(qty, 10) } : i))
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ open }),
    }),
    { name: "cart", partialize: (s) => ({ items: s.items }) }
  )
);
