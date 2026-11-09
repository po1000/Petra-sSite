import Link from "next/link";
import { products } from "@/lib/products";
import { site } from "@/lib/site";
import ProductCard from "@/components/ProductCard";
import DreamScene from "@/components/DreamScene";
import { navItems } from "@/components/Nav";

export default function Home() {
  return (
    <>
      <section className="relative h-[100svh] min-h-[560px] flex flex-col items-center justify-center text-center px-4">
        <DreamScene />
        <div className="relative">
          <h1 className="h-tight text-[18vw] md:text-[11vw]">{site.name}</h1>
          <p className="mt-3 font-semibold text-neutral-600">{site.tagline}</p>
        </div>
        {/* desktop-style icon dock */}
        <nav className="absolute bottom-8 md:bottom-12 inset-x-0 flex justify-center gap-6 md:gap-16 px-4" aria-label="Main">
          {navItems.slice(1).map((n, i) => (
            <Link key={n.href} href={n.href} className="dock-item group flex flex-col items-center gap-2" style={{ animation: `float 4s ease-in-out ${i * 0.4}s infinite` }}>
              <span className="h-16 md:h-24 grid place-items-center [&_.pix]:md:!w-28">{n.icon}</span>
              <span className="text-sm font-semibold px-2 rounded-full bg-white/70 opacity-80 group-hover:opacity-100">{n.label}</span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="px-4 md:px-8 mt-16 max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-8 gap-4">
          <h2 className="h-tight text-5xl md:text-7xl">new in</h2>
          <Link href="/shop" className="gloss gloss-primary">shop all →</Link>
        </div>
        <div className="grid gap-x-6 gap-y-12 grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((p, i) => <ProductCard key={p.slug} p={p} i={i} />)}
        </div>
      </section>
    </>
  );
}
