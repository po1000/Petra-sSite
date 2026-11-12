import { notFound } from "next/navigation";
import { formatGBP, site } from "@/lib/site";
import GoBack from "@/components/GoBack";

// Placeholder policy pages. TODO: client must supply/approve final wording —
// these are starting points, not legal advice.
const pages: Record<string, { title: string; body: React.ReactNode }> = {
  about: { title: "About", body: <p>Placeholder brand story. Who are you, why do you make clothes, what makes you different?</p> },
  shipping: {
    title: "Shipping",
    body: (
      <>
        <ul className="list-disc pl-5">
          {site.shipping.map((s) => <li key={s.label}>{s.label} — {formatGBP(s.amount)} ({s.minDays}–{s.maxDays} working days)</li>)}
        </ul>
        {site.freeShippingOver && <p>Free UK delivery on orders over {formatGBP(site.freeShippingOver)}.</p>}
        <p>Orders are dispatched within [X] working days. [TODO: international shipping, customs info.]</p>
      </>
    ),
  },
  returns: {
    title: "Returns & refunds",
    body: (
      <>
        <p>Under the UK Consumer Contracts Regulations you can cancel your order within {site.returnsDays} days of receiving it, for any reason. Let us know at {site.email}, then send the items back within 14 days. We&apos;ll refund you (including standard delivery) within 14 days of getting them back.</p>
        <p>[TODO: who pays return postage, return address, exchanges, sale items.]</p>
      </>
    ),
  },
  "size-guide": { title: "Size guide", body: <p>[TODO: size chart from client — chest, length, waist in cm and inches.]</p> },
  contact: { title: "Contact", body: <p>Email us at <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>. We reply within [X] working days.</p> },
  terms: {
    title: "Terms & conditions",
    body: <p>[TODO: terms of sale. Must include seller identity ({site.legal.tradingName}, {site.legal.registeredAddress}), prices incl. VAT, how the contract is formed, cancellation rights, and governing law (England & Wales).]</p>,
  },
  privacy: {
    title: "Privacy & cookies",
    body: (
      <>
        <p>[TODO: UK GDPR privacy notice — what data we collect (name, email, address for orders), why, how long we keep it, who we share it with (Stripe for payments, the delivery carrier), and your rights. Register with the ICO if required.]</p>
        <p>Cookies: we use an essential cookie/local storage to remember your bag. Analytics cookies only with your consent.</p>
      </>
    ),
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return { title: pages[(await params).slug]?.title };
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = pages[(await params).slug];
  if (!page) notFound();
  return (
    <section className="px-4 md:px-8 pt-4 max-w-3xl">
      <GoBack fallback="/info" />
      <h1 className="h-tight text-5xl md:text-7xl mt-6 mb-8">{page.title}</h1>
      <div className="glow-card p-6 md:p-8 space-y-4 tracking-normal leading-relaxed">{page.body}</div>
    </section>
  );
}
