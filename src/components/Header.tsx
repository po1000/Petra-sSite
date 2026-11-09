"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { site } from "@/lib/site";
import Marquee from "./Marquee";

export default function Header() {
  const items = useCart((s) => s.items);
  const setOpen = useCart((s) => s.setOpen);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? items.reduce((n, i) => n + i.qty, 0) : 0;

  return (
    <header className="sticky top-0 z-40 bg-[var(--paper)]">
      <Marquee text={site.announcement} className="bg-[var(--ink)] text-[var(--paper)] text-xs font-bold tracking-widest" />
      <nav className="flex items-center justify-between px-4 md:px-8 py-3 border-b-[3px] border-[var(--ink)]">
        <div className="flex gap-4 font-bold text-sm uppercase">
          <Link href="/shop" className="wiggle">Shop</Link>
          <Link href="/info/about" className="wiggle hidden sm:inline">About</Link>
        </div>
        <Link href="/" className="font-display text-xl sm:text-2xl md:text-4xl text-center leading-none hover:rotate-[-3deg] transition-transform">{site.name}</Link>
        <button onClick={() => setOpen(true)} className="btn-pill bg-[var(--green)] text-sm whitespace-nowrap !px-3 sm:!px-5">
          Bag ({count})
        </button>
      </nav>
    </header>
  );
}
