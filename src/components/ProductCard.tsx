"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { formatGBP } from "@/lib/site";
import ProductArt from "./ProductArt";

export default function ProductCard({ p, i }: { p: Product; i: number }) {
  const label = p.soldOut ? "SOLD OUT" : p.badge;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/product/${p.slug}`} className="group block text-center">
        <div className="relative aspect-[4/5]">
          {/* soft glow that appears on hover */}
          <div className="absolute inset-x-[15%] bottom-[8%] h-1/3 rounded-full blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" style={{ background: "var(--accent)" }} />
          <div className="relative h-full transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.03]">
            {p.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain" />
            ) : (
              <ProductArt garment={p.garment} colour={p.colour} className="w-full h-full p-4" />
            )}
          </div>
          {label && <span className="stamp absolute left-[6%] top-[22%]">{label}</span>}
        </div>
        <p className="h-tight text-xl md:text-2xl mt-2">{p.name}</p>
        <p className="font-semibold">{formatGBP(p.price)}</p>
      </Link>
    </motion.div>
  );
}
