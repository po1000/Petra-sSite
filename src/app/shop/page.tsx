import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Smiley } from "@/components/Stickers";

export const metadata = { title: "Shop" };

export default function Shop() {
  return (
    <section className="px-4 md:px-8 pt-12">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="font-display text-5xl md:text-8xl">Shop all</h1>
        <Smiley className="w-16 md:w-24 bob" color="var(--pink)" />
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => <ProductCard key={p.slug} p={p} i={i} />)}
      </div>
    </section>
  );
}
