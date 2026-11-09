"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Smiley } from "./Stickers";
import { site } from "@/lib/site";

// Full-screen loading screen: counts to 100, then wipes up off the screen.
// Shows once per browser session so returning shoppers aren't slowed down.
export default function Loader() {
  const [show, setShow] = useState(true);
  const [n, setN] = useState(0);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("loaded") === "1"; } catch {}
    if (seen) { setShow(false); return; }
    const id = setInterval(() => setN((v) => Math.min(v + Math.ceil(Math.random() * 9), 100)), 60);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (n < 100) return;
    const t = setTimeout(() => {
      setShow(false);
      try { sessionStorage.setItem("loaded", "1"); } catch {}
    }, 350);
    return () => clearTimeout(t);
  }, [n]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--pink)]"
          exit={{ y: "-100%", borderBottomLeftRadius: "50% 20%", borderBottomRightRadius: "50% 20%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}>
            <Smiley className="w-28 h-28" />
          </motion.div>
          <p className="font-display mt-6 text-5xl md:text-7xl">{site.name}</p>
          <p className="font-display text-[22vw] leading-none absolute bottom-0 right-4 opacity-90">{n}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
