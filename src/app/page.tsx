import Link from "next/link";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Marquee from "@/components/Marquee";
import { Blob, Flower, Smiley, Squiggle, Starburst } from "@/components/Stickers";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* HERO — swap the stickers for a campaign photo/video when the client has one */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <Blob className="absolute -left-20 top-10 w-80 opacity-80 spin-slow" />
        <Starburst className="absolute right-[5%] top-[12%] w-28 md:w-40 bob" />
        <Smiley className="absolute left-[8%] bottom-[12%] w-20 md:w-28 bob" color="var(--blue)" style={{ animationDelay: "1s" }} />
        <Flower className="absolute right-[12%] bottom-[8%] w-24 md:w-32 spin-slow" />
        <h1 className="font-display relative text-[15vw] md:text-[11vw] leading-[0.85]">
          Dress<br /><span className="text-[var(--pink)] [-webkit-text-stroke:3px_var(--ink)]">weird</span><br />feel good
        </h1>
        <Squiggle className="w-48 mt-4 relative" color="var(--purple)" />
        <p className="relative mt-4 max-w-md font-bold">{site.tagline}</p>
        <Link href="/shop" className="btn-pill relative mt-6 bg-[var(--yellow)] text-lg">Shop the drop →</Link>
      </section>

      <Marquee text="NEW DROP ✶ NEW DROP ✶ NEW DROP ✶ NEW DROP ✶" className="bg-[var(--green)] font-display text-2xl md:text-4xl -rotate-2 scale-105" />
      <Marquee text="SMALL BATCH ✿ UK BASED ✿ NO BORING CLOTHES ✿" reverse className="bg-[var(--purple)] text-[var(--paper)] font-display text-2xl md:text-4xl rotate-1 scale-105" />

      <section className="px-4 md:px-8 mt-20">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-4xl md:text-6xl">Fresh out</h2>
          <Link href="/shop" className="font-bold underline wiggle">See all</Link>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((p, i) => <ProductCard key={p.slug} p={p} i={i} />)}
        </div>
      </section>

      <section className="px-4 md:px-8 mt-24">
        <div className="card bg-[var(--blue)] p-8 md:p-16 relative overflow-hidden">
          <Starburst className="absolute -right-8 -bottom-8 w-48 spin-slow" color="var(--pink)" />
          <h2 className="font-display text-3xl md:text-5xl max-w-2xl relative">Made in tiny batches by real humans in the UK</h2>
          <p className="mt-4 max-w-xl font-bold relative">{/* TODO: client's brand story */}Placeholder for the brand story — who makes it, why it exists, what makes it different.</p>
          <Link href="/info/about" className="btn-pill inline-block mt-6 bg-[var(--paper)] relative">Our story</Link>
        </div>
      </section>
    </>
  );
}
