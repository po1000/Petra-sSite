"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/store/cart";

export default function AddToBag({ slug, sizes, soldOut }: { slug: string; sizes: string[]; soldOut: boolean }) {
  const [size, setSize] = useState(sizes.length === 1 ? sizes[0] : "");
  const [nudge, setNudge] = useState(0);
  const add = useCart((s) => s.add);

  return (
    <div className="mt-6">
      <p className="font-bold mb-2">Size</p>
      <motion.div key={nudge} animate={nudge ? { x: [0, -8, 8, -6, 6, 0] } : {}} className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button key={s} onClick={() => setSize(s)} disabled={soldOut}
            className={`btn-pill !px-4 ${size === s ? "bg-[var(--ink)] text-[var(--paper)]" : "bg-[var(--paper)]"}`}>{s}</button>
        ))}
      </motion.div>
      <button
        disabled={soldOut}
        onClick={() => (size ? add(slug, size) : setNudge((n) => n + 1))}
        className="btn-pill w-full md:w-auto mt-6 bg-[var(--pink)] text-lg disabled:opacity-50"
      >
        {soldOut ? "Sold out" : size ? "Add to bag ✶" : "Pick a size"}
      </button>
    </div>
  );
}
