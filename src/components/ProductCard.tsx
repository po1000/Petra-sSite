"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { coverImage, hasColourChoice, type Product } from "@/lib/catalog-types";
import { formatGBP } from "@/lib/site";
import ProductImage, { ColourIcon } from "./ProductImage";

export default function ProductCard({ p, i }: { p: Product; i: number }) {
  const label = p.soldOut ? "SOLD OUT" : p.badge;
  const hasPhoto = !!coverImage(p);
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
          {/* every photo fills the same size box here (edges are cropped if needed) */}
          <div className={`relative h-full transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.03] ${hasPhoto ? "rounded-[20px] overflow-hidden" : ""}`}>
            <ProductImage p={p} fit="cover" artClass="p-4" />
          </div>
          {label && <span className="stamp absolute left-[6%] top-[22%]">{label}</span>}
        </div>
        <p className="h-tight text-xl md:text-2xl mt-2">{p.name}</p>
        <p className="font-semibold">{formatGBP(p.price)}</p>
        {hasColourChoice(p) && (
          <div className="flex justify-center gap-1.5 mt-2" aria-label={`${p.colours.length} colours`}>
            {p.colours.slice(0, 8).map((c) => <ColourIcon key={c.id} c={c} size={16} />)}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
