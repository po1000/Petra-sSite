"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { site } from "@/lib/site";
import PixelIcon from "./PixelIcon";

const accents = [
  { id: "blue", colour: "var(--blue)" },
  { id: "pink", colour: "var(--pink)" },
  { id: "yellow", colour: "var(--yellow)" },
];

// Three glossy dots that change the accent colour (cursor, glows, progress bars).
function AccentDots() {
  const [accent, setAccent] = useState("blue");
  useEffect(() => {
    try { const a = localStorage.getItem("accent"); if (a) setAccent(a); } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    try { localStorage.setItem("accent", accent); } catch {}
  }, [accent]);
  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Accent colour">
      {accents.map((a) => (
        <button
          key={a.id} role="radio" aria-checked={accent === a.id} aria-label={a.id}
          onClick={() => setAccent(a.id)}
          className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${accent === a.id ? "ring-2 ring-offset-2 ring-[var(--line)]" : ""}`}
          style={{ background: `radial-gradient(circle at 35% 30%, #fff 0 12%, ${a.colour} 45%)`, boxShadow: "inset -1px -2px 3px rgba(0,0,0,.12)" }}
        />
      ))}
    </div>
  );
}

function CartButton() {
  const items = useCart((s) => s.items);
  const setOpen = useCart((s) => s.setOpen);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? items.reduce((n, i) => n + i.qty, 0) : 0;
  return (
    <button onClick={() => setOpen(true)} className="dock-item relative shrink-0" aria-label={`Open bag, ${count} items`}>
      <PixelIcon name="cart" className="w-14 md:w-16" />
      <span className="absolute -top-2 -right-1 min-w-6 h-6 px-1 grid place-items-center rounded-full bg-white border border-[var(--line)] text-xs font-bold shadow-sm tabular-nums">{count}</span>
    </button>
  );
}

export default function TopBar({ isHome }: { isHome: boolean }) {
  if (isHome) {
    return (
      <div className="absolute right-4 top-4 md:right-8 md:top-6 z-30 flex items-center gap-5">
        <AccentDots />
        <CartButton />
      </div>
    );
  }
  const text = site.ticker.join("   ◦   ");
  return (
    <div className="sticky top-0 z-30 flex items-center gap-4 px-4 md:px-8 pt-4 pb-3 bg-gradient-to-b from-white via-white/90 to-white/0">
      <div className="flex-1 min-w-0 overflow-hidden rounded-full border-2 border-[var(--accent-light)] bg-white/70 py-2 shadow-[0_6px_20px_-12px_var(--accent-deep)] [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]" role="marquee" aria-label={site.ticker.join(", ")}>
        <div className="flex w-max animate-ticker text-sm font-semibold text-[var(--accent-deep)] opacity-80" aria-hidden>
          {[0, 1, 2, 3].map((i) => <span key={i} className="px-8 whitespace-nowrap">{text}   ◦</span>)}
        </div>
      </div>
      <div className="hidden sm:block"><AccentDots /></div>
      <CartButton />
    </div>
  );
}
