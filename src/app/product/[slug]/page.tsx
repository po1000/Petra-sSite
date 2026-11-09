import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import { formatGBP, site } from "@/lib/site";
import AddToBag from "./AddToBag";
import Gallery from "./Gallery";
import GoBack from "@/components/GoBack";
import Accordion from "@/components/Accordion";

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
    <section className="px-4 md:px-8 pt-4">
      <GoBack />
      <div className="grid gap-8 md:gap-16 md:grid-cols-[1.2fr_1fr] mt-6 items-start">
        <Gallery p={p} />
        <div className="md:sticky md:top-28">
          <div className="text-center">
            <h1 className="h-tight text-5xl md:text-6xl">{p.name}</h1>
            <p className="text-3xl font-semibold mt-2 tracking-tight">{formatGBP(p.price)}</p>
          </div>
          <AddToBag slug={p.slug} sizes={p.sizes} soldOut={!!p.soldOut} preorder={p.badge === "PRE ORDER"} />
          <div className="mt-10">
            <Accordion
              items={[
                { title: "description", body: <p>{p.description}</p> },
                {
                  title: "shipping + care",
                  body: (
                    <>
                      <p>UK delivery from {formatGBP(site.shipping[0].amount)}{site.freeShippingOver ? `, free over ${formatGBP(site.freeShippingOver)}` : ""}. {p.badge === "PRE ORDER" ? "Pre-orders ship in [X] weeks." : "Dispatched within [X] working days."} {/* TODO */}</p>
                      {p.care && <p className="mt-2">{p.care}</p>}
                    </>
                  ),
                },
                { title: "size chart", body: <p>[TODO: measurements from client — chest, length, waist in cm and inches.]</p> },
                { title: "returns", body: <p>Return unworn items within {site.returnsDays} days of delivery for a full refund.</p> },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
