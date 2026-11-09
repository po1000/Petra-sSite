import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import ProductArt from "@/components/ProductArt";
import AddToBag from "./AddToBag";
import { formatGBP, site } from "@/lib/site";
import { Starburst } from "@/components/Stickers";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  return { title: p?.name ?? "Not found", description: p?.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  return (
    <section className="px-4 md:px-8 pt-10 grid gap-10 md:grid-cols-2">
      <div className="card relative aspect-square overflow-hidden" style={{ background: `color-mix(in srgb, ${p.colour} 25%, var(--paper))` }}>
        {p.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
        ) : (
          <ProductArt garment={p.garment} colour={p.colour} className="w-full h-full p-12" />
        )}
        <Starburst className="absolute -top-6 -right-6 w-28 spin-slow" />
      </div>
      <div>
        <h1 className="font-display text-4xl md:text-6xl leading-none">{p.name}</h1>
        <p className="text-2xl font-bold mt-3">{formatGBP(p.price)}</p>
        <p className="mt-4 max-w-prose">{p.description}</p>
        <AddToBag slug={p.slug} sizes={p.sizes} soldOut={!!p.soldOut} />
        <details className="mt-8 card p-4"><summary className="font-bold cursor-pointer">Delivery</summary>
          <p className="mt-2 text-sm">UK delivery from {formatGBP(site.shipping[0].amount)}{site.freeShippingOver ? `, free over ${formatGBP(site.freeShippingOver)}` : ""}. Dispatched within X working days. {/* TODO */}</p>
        </details>
        <details className="mt-3 card p-4"><summary className="font-bold cursor-pointer">Returns</summary>
          <p className="mt-2 text-sm">You can return unworn items within {site.returnsDays} days of delivery for a full refund.</p>
        </details>
      </div>
    </section>
  );
}
