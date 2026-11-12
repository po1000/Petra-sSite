"use client";
import { createContext, useContext } from "react";
import type { Product } from "@/lib/catalog-types";

// Makes the live product list available to browser-side parts (bag, etc.).
const Ctx = createContext<Product[]>([]);

export function CatalogProvider({ products, children }: { products: Product[]; children: React.ReactNode }) {
  return <Ctx.Provider value={products}>{children}</Ctx.Provider>;
}

export function useCatalog() {
  const products = useContext(Ctx);
  return { products, get: (slug: string) => products.find((p) => p.slug === slug) };
}
