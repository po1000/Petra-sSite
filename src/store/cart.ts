"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = { slug: string; size: string; colour: string; qty: number };

type CartState = {
  items: CartItem[];
  open: boolean;
  add: (slug: string, size: string, colour: string) => void;
  setQty: (slug: string, size: string, colour: string, qty: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

const same = (i: CartItem, slug: string, size: string, colour: string) => i.slug === slug && i.size === size && i.colour === colour;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      add: (slug, size, colour) =>
        set((s) => {
          const found = s.items.find((i) => same(i, slug, size, colour));
          const items = found
            ? s.items.map((i) => (i === found ? { ...i, qty: Math.min(i.qty + 1, 10) } : i))
            : [...s.items, { slug, size, colour, qty: 1 }];
          return { items, open: true };
        }),
      setQty: (slug, size, colour, qty) =>
        set((s) => ({
          items: s.items.map((i) => (same(i, slug, size, colour) ? { ...i, qty: Math.min(qty, 10) } : i)).filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ open }),
    }),
    { name: "cart-v2", partialize: (s) => ({ items: s.items }) }
  )
);
