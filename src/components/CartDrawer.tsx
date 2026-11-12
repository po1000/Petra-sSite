"use client";
import { readJson } from "@/lib/api-data";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { colourOf, hasColourChoice, type Product } from "@/lib/catalog-types";
import { formatGBP, site } from "@/lib/site";
import ProductImage from "./ProductImage";
import { useCatalog } from "./Catalog";

function Suggestion({ p }: { p: Product }) {
  const add = useCart((s) => s.add);
  const [size, setSize] = useState(p.sizes[0]);
  return (
    <div className="rounded-2xl border border-[var(--line)] p-3 flex flex-col gap-2 min-w-0">
      <div className="flex gap-2 items-center">
        <div className="w-14 h-14 shrink-0"><ProductImage p={p} /></div>
        <div className="min-w-0">
          <p className="font-semibold text-sm leading-tight">{p.name}</p>
          <p className="text-sm">{formatGBP(p.price)}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {p.sizes.length > 1 && (
          <select value={size} onChange={(e) => setSize(e.target.value)} className="rounded-full border border-[var(--line)] px-2 text-sm bg-[var(--soft)]" aria-label={`Size for ${p.name}`}>
            {p.sizes.map((s) => <option key={s}>{s}</option>)}
          </select>
        )}
        <button className="gloss gloss-white text-sm flex-1 !py-1.5" onClick={() => add(p.slug, size, p.colours[0].id)}>add</button>
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { items, open, setOpen, setQty } = useCart();
  const { products, get } = useCatalog();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lines = items.map((i) => ({ ...i, product: get(i.slug) })).filter((l) => l.product);
  const subtotal = lines.reduce((t, l) => t + l.product!.price * l.qty, 0);
  const goal = site.freeShippingOver;
  const left = goal ? Math.max(goal - subtotal, 0) : 0;
  const suggestions = products.filter((p) => !p.soldOut && !items.some((i) => i.slug === p.slug)).slice(0, 2);

  async function checkout() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await readJson(res);
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
          <motion.div className="fixed inset-0 z-50 bg-[#9fb6d6]/30 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            className="fixed right-0 top-0 md:top-3 md:right-3 md:bottom-3 z-50 h-full md:h-auto w-full max-w-md bg-white md:rounded-[32px] shadow-[0_30px_80px_-20px_rgba(30,70,140,0.4)] flex flex-col overflow-hidden"
            initial={{ x: "105%" }} animate={{ x: 0 }} exit={{ x: "105%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            aria-label="Shopping bag"
          >
            <div className="flex justify-between items-center px-6 pt-6 pb-4">
              <h2 className="h-tight text-4xl">your bag</h2>
              <button onClick={() => setOpen(false)} className="text-3xl leading-none w-10 h-10 rounded-full hover:bg-[var(--soft)]" aria-label="Close bag">×</button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 space-y-5">
              {goal && (
                <div className="rounded-2xl bg-[var(--soft)] p-4">
                  <p className="text-sm">
                    {left > 0 ? <>add <b>{formatGBP(left)}</b> to unlock free uk shipping</> : <>you&apos;ve unlocked <b>free uk shipping</b> ✨</>}
                  </p>
                  <div className="mt-3 h-2 rounded-full bg-[var(--line)] overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-deep))" }} animate={{ width: `${Math.min((subtotal / goal) * 100, 100)}%` }} />
                  </div>
                </div>
              )}

              {lines.length === 0 && (
                <div className="text-center py-10">
                  <div className="bubble w-14 h-14 mx-auto" style={{ animation: "float 3s ease-in-out infinite" }} />
                  <p className="mt-4 font-semibold">your bag is empty</p>
                </div>
              )}

              {lines.map((l) => (
                <div key={l.slug + l.size + l.colour} className="flex gap-4 items-center">
                  <div className="w-24 h-24 shrink-0 rounded-2xl bg-[var(--soft)] p-1 overflow-hidden"><ProductImage p={l.product!} colourId={l.colour} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <p className="font-semibold text-lg leading-tight">{l.product!.name}</p>
                      <p className="font-semibold">{formatGBP(l.product!.price * l.qty)}</p>
                    </div>
                    <p className="text-sm text-[var(--muted)]">{hasColourChoice(l.product!) && <>colour: {colourOf(l.product!, l.colour).name} · </>}size: {l.size}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center rounded-full bg-white shadow-[0_4px_14px_-6px_rgba(30,70,140,0.35)] border border-[var(--line)]">
                        <button className="w-9 h-9 text-lg text-[var(--accent-deep)]" onClick={() => setQty(l.slug, l.size, l.colour, l.qty - 1)} aria-label="Decrease quantity">−</button>
                        <span className="w-6 text-center font-semibold tabular-nums">{l.qty}</span>
                        <button className="w-9 h-9 text-lg text-[var(--accent-deep)]" onClick={() => setQty(l.slug, l.size, l.colour, l.qty + 1)} aria-label="Increase quantity">+</button>
                      </div>
                      <button className="w-9 h-9 grid place-items-center rounded-full border border-[var(--line)] hover:bg-[var(--soft)]" onClick={() => setQty(l.slug, l.size, l.colour, 0)} aria-label={`Remove ${l.product!.name}`}>
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {lines.length > 0 && suggestions.length > 0 && (
                <div className="rounded-2xl border border-[var(--line)] p-4 mb-4">
                  <p className="font-semibold mb-3">you may also like</p>
                  <div className="grid grid-cols-2 gap-3">
                    {suggestions.map((p) => <Suggestion key={p.slug} p={p} />)}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 pt-4 pb-6 border-t border-[var(--line)] space-y-3">
              <div className="flex justify-between font-semibold text-lg"><span>estimated total</span><span>{formatGBP(subtotal)} GBP</span></div>
              <p className="text-xs text-[var(--muted)]">Shipping and discount codes calculated at checkout. Prices include VAT where applicable.</p>
              {error && <p className="text-sm text-[var(--red)] font-semibold">{error}</p>}
              <button disabled={!lines.length || loading} onClick={checkout} className="gloss gloss-primary w-full text-xl !py-3">
                {loading ? "one sec…" : "check out"}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
