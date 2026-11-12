"use client";
import { motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { hasColourChoice, mediaUrl, type Product } from "@/lib/catalog-types";
import { useCart } from "@/store/cart";
import { ColourIcon, Placeholder } from "@/components/ProductImage";

const dotColours = ["var(--blue)", "var(--pink)", "var(--yellow)", "var(--green)", "#ff8f8f", "#ffb07a"];

export default function ProductView({ p, header, children }: { p: Product; header: React.ReactNode; children: React.ReactNode }) {
  // One long carousel: every colour's photos, grouped colour by colour.
  const slides = useMemo(
    () => p.colours.flatMap((c) => (c.images.length ? c.images : [null]).map((img, n) => ({ colour: c, img, n }))),
    [p]
  );
  const firstSlide = (colourId: string) => Math.max(0, slides.findIndex((s) => s.colour.id === colourId));

  const track = useRef<HTMLDivElement>(null);
  const lockUntil = useRef(0);
  const [index, setIndex] = useState(0);
  const [colourId, setColourId] = useState(p.colours[0]?.id);
  const colour = p.colours.find((c) => c.id === colourId) ?? p.colours[0];

  const goTo = (i: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  // Picking a colour scrolls its first photo into view.
  const pickColour = (id: string) => {
    setColourId(id);
    lockUntil.current = Date.now() + 900;
    goTo(firstSlide(id));
  };

  // Swiping through photos updates the selected colour to match.
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
    if (Date.now() > lockUntil.current && slides[i] && slides[i].colour.id !== colourId) setColourId(slides[i].colour.id);
  };

  const [size, setSize] = useState(p.sizes.length === 1 ? p.sizes[0] : "");
  const [nudge, setNudge] = useState(0);
  const add = useCart((s) => s.add);
  const preorder = p.badge === "PRE ORDER";

  return (
    <div className="grid gap-8 md:gap-16 md:grid-cols-[1.2fr_1fr] mt-6 items-start">
      {/* photos: shown in full, any shape */}
      <div className="relative min-w-0">
        <div ref={track} onScroll={onScroll} className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Product photos">
          {slides.map((s, i) => (
            <div key={i} className="snap-center shrink-0 w-full h-[min(72vh,680px)] flex items-center justify-center" aria-roledescription="slide" aria-label={`${s.colour.name}, photo ${s.n + 1}`}>
              {s.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl(s.img)} alt={`${p.name}${hasColourChoice(p) ? ` in ${s.colour.name}` : ""}, photo ${s.n + 1}`} loading={i < 2 ? "eager" : "lazy"} className="max-w-full max-h-full object-contain rounded-2xl" />
              ) : (
                <Placeholder p={p} colour={s.colour} />
              )}
            </div>
          ))}
        </div>
        {slides.length > 1 && (
          <>
            <button onClick={() => goTo(Math.max(index - 1, 0))} disabled={index === 0} aria-label="Previous photo" className="gloss gloss-white absolute left-1 top-1/2 -translate-y-1/2 !w-11 !h-11 !p-0 text-lg disabled:!opacity-0">←</button>
            <button onClick={() => goTo(Math.min(index + 1, slides.length - 1))} disabled={index === slides.length - 1} aria-label="Next photo" className="gloss gloss-white absolute right-1 top-1/2 -translate-y-1/2 !w-11 !h-11 !p-0 text-lg disabled:!opacity-0">→</button>
            <div className="flex justify-center flex-wrap gap-3 mt-4">
              {slides.map((s, n) => (
                <button key={n} onClick={() => goTo(n)} aria-label={`Show photo ${n + 1}`}
                  className={`w-4 h-4 rounded-full transition-transform hover:scale-110 ${index === n ? "ring-2 ring-offset-2 ring-[var(--line)] scale-110" : ""}`}
                  style={{ background: `radial-gradient(circle at 35% 30%, #fff 0 12%, ${s.colour.swatch ?? dotColours[p.colours.indexOf(s.colour) % dotColours.length]} 45%)` }} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="md:sticky md:top-28">
        {header}

        {hasColourChoice(p) && (
          <div className="mt-8 flex flex-col items-center">
            <p className="text-sm font-semibold text-[var(--muted)]">colour: <span className="text-[var(--ink)]">{colour.name}</span></p>
            <div className="flex flex-wrap justify-center gap-2 mt-3" role="radiogroup" aria-label="Colour">
              {p.colours.map((c) => (
                <button key={c.id} role="radio" aria-checked={c.id === colourId} aria-label={c.name} title={c.name} onClick={() => pickColour(c.id)}
                  className={`w-14 h-14 grid place-items-center rounded-2xl bg-white transition ${c.id === colourId ? "shadow-[0_0_0_2px_var(--accent-light),0_8px_20px_-8px_var(--accent-deep)]" : "hover:bg-[var(--soft)]"}`}>
                  <ColourIcon c={c} size={36} />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center">
          {p.sizes.length > 1 && (
            <motion.div key={nudge} animate={nudge ? { x: [0, -8, 8, -6, 6, 0] } : {}} className="flex flex-wrap justify-center gap-1" role="radiogroup" aria-label="Size">
              {p.sizes.map((s) => (
                <button key={s} role="radio" aria-checked={size === s} onClick={() => setSize(s)} disabled={p.soldOut}
                  className={`h-tight !normal-case text-2xl md:text-3xl px-3 md:px-4 py-2 rounded-full transition ${size === s ? "bg-white shadow-[0_0_0_2px_var(--accent-light),0_8px_20px_-8px_var(--accent-deep)]" : "text-neutral-500 hover:text-[var(--ink)]"}`}>
                  {s}
                </button>
              ))}
            </motion.div>
          )}
          <button
            disabled={p.soldOut}
            onClick={() => (size ? add(p.slug, size, colour.id) : setNudge((n) => n + 1))}
            className="gloss gloss-primary w-full max-w-md mt-8 text-3xl md:text-4xl !py-4"
          >
            {p.soldOut ? "sold out" : !size ? "select a size" : preorder ? "pre order" : "add to bag"}
          </button>
        </div>

        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}
