"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Product } from "@/lib/products";
import ProductArt from "@/components/ProductArt";

const dotColours = ["var(--blue)", "var(--pink)", "var(--yellow)", "var(--green)", "#ff8f8f", "#ffb07a"];

export default function Gallery({ p }: { p: Product }) {
  const imgs = p.images?.length ? p.images : [null];
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="relative aspect-square">
        <AnimatePresence mode="wait">
          <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0, filter: "blur(12px)", scale: 0.97 }} animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }} exit={{ opacity: 0, filter: "blur(12px)" }} transition={{ duration: 0.35 }}>
            {imgs[i] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imgs[i]!} alt={`${p.name} photo ${i + 1}`} className="w-full h-full object-contain" />
            ) : (
              <ProductArt garment={p.garment} colour={p.colour} className="w-full h-full" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {imgs.length > 1 && (
        <div className="flex justify-center gap-3 mt-4">
          {imgs.map((_, n) => (
            <button key={n} onClick={() => setI(n)} aria-label={`Show photo ${n + 1}`}
              className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${i === n ? "ring-2 ring-offset-2 ring-[var(--line)]" : ""}`}
              style={{ background: `radial-gradient(circle at 35% 30%, #fff 0 12%, ${dotColours[n % dotColours.length]} 45%)` }} />
          ))}
        </div>
      )}
    </div>
  );
}
