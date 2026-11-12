import { colourOf, hasColourChoice, mediaUrl, type Colour, type Product } from "@/lib/catalog-types";
import ProductArt from "./ProductArt";

/** Shown when a colour has no photos yet. */
export function Placeholder({ p, colour, className = "" }: { p: Product; colour?: Colour; className?: string }) {
  if (p.placeholder) return <ProductArt garment={p.placeholder} colour={colour?.swatch ?? "#dfe4ec"} className={`w-full h-full ${className}`} />;
  return (
    <div className={`w-full h-full rounded-3xl grid place-items-center text-sm font-semibold text-[var(--muted)] ${className}`} style={{ background: `linear-gradient(160deg, #fff, ${colour?.swatch ?? "#eef2f7"})` }}>
      no photo yet
    </div>
  );
}

/**
 * The main photo for a product (or a given colour of it).
 * fit="cover" crops to fill the box (store grid); "contain" shows the whole photo.
 */
export default function ProductImage({ p, colourId, fit = "contain", className = "", artClass = "" }: {
  p: Product; colourId?: string; fit?: "cover" | "contain"; className?: string; artClass?: string;
}) {
  const c = colourId ? colourOf(p, colourId) : p.colours.find((x) => x.images.length) ?? p.colours[0];
  const key = c?.images[0];
  if (!key) return <Placeholder p={p} colour={c} className={artClass} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={mediaUrl(key)} alt={hasColourChoice(p) ? `${p.name} in ${c.name}` : p.name} loading="lazy" className={`w-full h-full ${fit === "cover" ? "object-cover" : "object-contain"} ${className}`} />
  );
}

/** Small colour icon: the uploaded icon, or a glossy dot in the swatch colour. */
export function ColourIcon({ c, size = 28 }: { c: Colour; size?: number }) {
  if (c.icon) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={mediaUrl(c.icon)} alt="" className="object-contain shrink-0" style={{ width: size, height: size }} />;
  }
  return (
    <span className="inline-block rounded-full shrink-0" style={{ width: size, height: size, background: `radial-gradient(circle at 35% 30%, #fff 0 12%, ${c.swatch ?? "#dfe4ec"} 45%)`, boxShadow: "inset -1px -2px 3px rgba(0,0,0,.12)" }} />
  );
}
