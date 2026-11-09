"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/store/cart";

export default function AddToBag({ slug, sizes, soldOut, preorder }: { slug: string; sizes: string[]; soldOut: boolean; preorder: boolean }) {
  const [size, setSize] = useState(sizes.length === 1 ? sizes[0] : "");
  const [nudge, setNudge] = useState(0);
  const add = useCart((s) => s.add);

  return (
    <div className="mt-8 flex flex-col items-center">
      {sizes.length > 1 && (
        <motion.div key={nudge} animate={nudge ? { x: [0, -8, 8, -6, 6, 0] } : {}} className="flex flex-wrap justify-center gap-1" role="radiogroup" aria-label="Size">
          {sizes.map((s) => (
            <button key={s} role="radio" aria-checked={size === s} onClick={() => setSize(s)} disabled={soldOut}
              className={`h-tight !normal-case text-2xl md:text-3xl px-3 md:px-4 py-2 rounded-full transition ${size === s ? "bg-white shadow-[0_0_0_2px_var(--accent-light),0_8px_20px_-8px_var(--accent-deep)]" : "text-neutral-500 hover:text-[var(--ink)]"}`}>
              {s}
            </button>
          ))}
        </motion.div>
      )}
      <button
        disabled={soldOut}
        onClick={() => (size ? add(slug, size) : setNudge((n) => n + 1))}
        className="gloss gloss-primary w-full max-w-md mt-8 text-3xl md:text-4xl !py-4"
      >
        {soldOut ? "sold out" : !size ? "select a size" : preorder ? "pre order" : "add to bag"}
      </button>
    </div>
  );
}
