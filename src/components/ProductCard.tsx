"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { formatGBP } from "@/lib/site";
import ProductArt from "./ProductArt";

export default function ProductCard({ p, i }: { p: Product; i: number }) {
  const tilt = i % 2 ? 2 : -2;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: tilt * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", damping: 14, delay: (i % 3) * 0.08 }}
      whileHover={{ rotate: tilt, y: -6 }}
    >
      <Link href={`/product/${p.slug}`} className="card block overflow-hidden group">
        <div className="relative aspect-square" style={{ background: `color-mix(in srgb, ${p.colour} 25%, var(--paper))` }}>
          {p.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
          ) : (
            <ProductArt garment={p.garment} colour={p.colour} className="w-full h-full p-8 group-hover:scale-110 transition-transform duration-500" />
          )}
          {(p.badge || p.soldOut) && (
            <span className="absolute top-3 left-3 btn-pill !py-1 !px-3 text-xs bg-[var(--yellow)] rotate-[-6deg]">
              {p.soldOut ? "SOLD OUT" : p.badge}
            </span>
          )}
        </div>
        <div className="flex justify-between p-3 border-t-[3px] border-[var(--ink)] font-bold">
          <span>{p.name}</span><span>{formatGBP(p.price)}</span>
        </div>
      </Link>
    </motion.div>
  );
}
