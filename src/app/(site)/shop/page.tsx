import ShopGrid from "./ShopGrid";
import { listProducts } from "@/lib/db";

export const metadata = { title: "Store" };

export default async function Shop() {
  const products = await listProducts();
  return (
    <section className="px-4 md:px-8 pt-6 max-w-[1400px]">
      <p className="h-tight text-2xl mb-4">collections</p>
      <ShopGrid products={products} />
    </section>
  );
}
