"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { getProduct } from "@/lib/products";
import { formatGBP, site } from "@/lib/site";
import ProductArt from "./ProductArt";

export default function CartDrawer() {
  const { items, open, setOpen, setQty } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lines = items.map((i) => ({ ...i, product: getProduct(i.slug) })).filter((l) => l.product);
  const subtotal = lines.reduce((t, l) => t + l.product!.price * l.qty, 0);

  async function checkout() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url; // off to Stripe's secure payment page
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-[var(--paper)] border-l-[3px] border-[var(--ink)] flex flex-col"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            aria-label="Shopping bag"
          >
            <div className="flex justify-between items-center p-5 border-b-[3px] border-[var(--ink)]">
              <h2 className="font-display text-3xl">Your bag</h2>
              <button onClick={() => setOpen(false)} className="text-3xl leading-none" aria-label="Close bag">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {lines.length === 0 && <p className="font-bold">It&apos;s empty in here… spooky 👻</p>}
              {lines.map((l) => (
                <div key={l.slug + l.size} className="flex gap-3 items-center card p-2">
                  <ProductArt garment={l.product!.garment} colour={l.product!.colour} className="w-20 h-20 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold">{l.product!.name}</p>
                    <p className="text-sm">Size {l.size} · {formatGBP(l.product!.price)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button className="qty" onClick={() => setQty(l.slug, l.size, l.qty - 1)} aria-label="Decrease">−</button>
                      <span className="font-bold w-5 text-center">{l.qty}</span>
                      <button className="qty" onClick={() => setQty(l.slug, l.size, l.qty + 1)} aria-label="Increase">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 border-t-[3px] border-[var(--ink)] space-y-3">
              <div className="flex justify-between font-bold text-lg"><span>Subtotal</span><span>{formatGBP(subtotal)}</span></div>
              <p className="text-xs">Shipping calculated at checkout{site.freeShippingOver ? ` · free UK delivery over ${formatGBP(site.freeShippingOver)}` : ""}. Prices include VAT where applicable.</p>
              {error && <p className="text-sm text-red-600 font-bold">{error}</p>}
              <button disabled={!lines.length || loading} onClick={checkout} className="btn-pill w-full bg-[var(--pink)] text-lg disabled:opacity-50">
                {loading ? "Hold tight…" : "Checkout →"}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
