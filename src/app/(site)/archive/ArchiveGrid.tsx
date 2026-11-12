"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { archive, archiveTags } from "@/lib/archive";
import FilterPills from "@/components/FilterPills";

const placeholders = [
  "linear-gradient(160deg, #cfe3f5, #9fb9cf 60%, #c7d6e2)",
  "linear-gradient(160deg, #f3d9e6, #c9a8bb 60%, #e8d4df)",
  "linear-gradient(160deg, #e3efd9, #a9c29b 60%, #d5e4cc)",
  "linear-gradient(160deg, #f6ecc9, #cdbb87 60%, #ebe0bd)",
];
const tilts = [-1.2, 0.8, -0.5, 1.1];

export default function ArchiveGrid() {
  const [tag, setTag] = useState<(typeof archiveTags)[number]["id"]>("all");
  const list = archive.filter((a) => tag === "all" || a.tag === tag);
  return (
    <>
      <FilterPills options={archiveTags} value={tag} onChange={setTag} />
      <div key={tag} className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-8">
        {list.map((a, i) => (
          <motion.figure
            key={a.file}
            className="glow-card p-4"
            style={{ rotate: tilts[i % tilts.length] }}
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <figcaption className="chip mb-3">{a.file}</figcaption>
            <div className="relative aspect-square rounded-2xl overflow-hidden grain" style={{ background: placeholders[i % placeholders.length] }}>
              {a.src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.src} alt={a.file} className="absolute inset-0 w-full h-full object-cover" />
              )}
            </div>
          </motion.figure>
        ))}
      </div>
    </>
  );
}
