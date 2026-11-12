import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/db";
import { formatGBP, site } from "@/lib/site";
import ProductView from "./ProductView";
import GoBack from "@/components/GoBack";
import Accordion from "@/components/Accordion";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProductBySlug((await params).slug);
  return { title: p?.name ?? "Not found", description: p?.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProductBySlug((await params).slug);
  if (!p) notFound();
  return (
    <section className="px-4 md:px-8 pt-4">
      <GoBack />
      <ProductView
        p={p}
        header={
          <div className="text-center">
            <h1 className="h-tight text-5xl md:text-6xl">{p.name}</h1>
            <p className="text-3xl font-semibold mt-2 tracking-tight">{formatGBP(p.price)}</p>
          </div>
        }
      >
        <Accordion
          items={[
            { title: "description", body: <p className="whitespace-pre-line">{p.description}</p> },
            {
              title: "shipping + care",
              body: (
                <>
                  <p>UK delivery from {formatGBP(site.shipping[0].amount)}{site.freeShippingOver ? `, free over ${formatGBP(site.freeShippingOver)}` : ""}. {p.badge === "PRE ORDER" ? "Pre-orders ship in [X] weeks." : "Dispatched within [X] working days."} {/* TODO */}</p>
                  {p.care && <p className="mt-2 whitespace-pre-line">{p.care}</p>}
                </>
              ),
            },
            { title: "size chart", body: <p>[TODO: measurements from client — chest, length, waist in cm and inches.]</p> },
            { title: "returns", body: <p>Return unworn items within {site.returnsDays} days of delivery for a full refund.</p> },
          ]}
        />
      </ProductView>
    </section>
  );
}
