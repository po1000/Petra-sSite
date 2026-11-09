"use client";
import { useState } from "react";
import { collections, products, type CollectionId } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import FilterPills from "@/components/FilterPills";

type Sort = "featured" | "low" | "high";

export default function ShopGrid() {
  const [col, setCol] = useState<CollectionId | "all">("all");
  const [sort, setSort] = useState<Sort>("featured");
  let list = products.filter((p) => col === "all" || p.collection === col);
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);

  return (
    <>
      <FilterPills options={collections} value={col} onChange={setCol} big />
      <div className="flex justify-end mt-8">
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="gloss gloss-white text-sm !py-2 appearance-none pr-8" aria-label="Sort products">
          <option value="featured">featured</option>
          <option value="low">price: low to high</option>
          <option value="high">price: high to low</option>
        </select>
      </div>
      <div key={col + sort} className="grid gap-x-6 gap-y-14 grid-cols-2 lg:grid-cols-3 mt-6">
        {list.map((p, i) => <ProductCard key={p.slug} p={p} i={i} />)}
      </div>
      {list.length === 0 && <p className="mt-10 font-semibold text-[var(--muted)]">nothing here yet…</p>}
    </>
  );
}
