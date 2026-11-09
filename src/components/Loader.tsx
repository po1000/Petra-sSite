"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

// Loading screen: a wobbling bubble and a glossy progress bar, then the whole
// thing blurs away. Shows once per browser session.
export default function Loader() {
  const [show, setShow] = useState(true);
  const [n, setN] = useState(0);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("loaded") === "1"; } catch {}
    if (seen) { setShow(false); return; }
    const id = setInterval(() => setN((v) => Math.min(v + Math.ceil(Math.random() * 8), 100)), 70);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (n < 100) return;
    const t = setTimeout(() => {
      setShow(false);
      try { sessionStorage.setItem("loaded", "1"); } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [n]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-white"
          exit={{ opacity: 0, filter: "blur(24px)", scale: 1.06 }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="bubble w-24 h-24" style={{ animation: "wobble 2.4s ease-in-out infinite" }} />
          <p className="h-tight text-4xl md:text-5xl mt-8">{site.name}</p>
          <div className="mt-6 w-56 h-3 rounded-full bg-[var(--soft)] overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="h-full rounded-full transition-[width] duration-150" style={{ width: `${n}%`, background: "linear-gradient(180deg, #bfe1ff, var(--accent) 60%, var(--accent-deep))" }} />
          </div>
          <p className="mt-3 text-sm font-semibold text-[var(--muted)] tabular-nums">loading {n}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
