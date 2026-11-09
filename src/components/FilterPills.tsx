"use client";
import { motion } from "framer-motion";

// Row of glossy coloured pills used to filter the store and archive.
export default function FilterPills<T extends string>({
  options, value, onChange, big = false,
}: {
  options: readonly { id: T; label: string; tone: string; isNew?: boolean }[];
  value: T;
  onChange: (v: T) => void;
  big?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((o) => (
        <motion.button
          key={o.id}
          whileTap={{ scale: 0.94 }}
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={`gloss ${o.tone} relative !overflow-visible ${big ? "text-xl md:text-3xl md:min-w-48 !py-3 md:!py-5" : "text-base"} ${value === o.id ? "ring-4 ring-[var(--accent-light)]" : "opacity-85"}`}
        >
          {o.label}
          {o.isNew && <span className="gloss gloss-primary absolute -top-3 -right-2 text-xs !px-2.5 !py-0.5">new</span>}
        </motion.button>
      ))}
    </div>
  );
}
