// ─────────────────────────────────────────────────────────────
//  PRODUCTS — placeholder catalogue. Prices are in PENCE (2500 = £25).
//  Replace with the client's real products. For real photos, drop them in
//  /public/products/ and set `images: ["/products/x.jpg", ...]` — the
//  product page shows dots to flick between them. Photos on a plain white
//  background look best with this design.
//  Prices are checked on the server at checkout, so nobody can
//  tamper with them in the browser.
// ─────────────────────────────────────────────────────────────
export type Garment = "tee" | "hoodie" | "cap" | "tote" | "trousers";

// Collections = the coloured filter pills on the store page.
export const collections = [
  { id: "all", label: "all", tone: "" },
  { id: "limited", label: "limited", tone: "gloss-pink" },
  { id: "drop-01", label: "drop 01", tone: "gloss-yellow", isNew: true },
  { id: "essentials", label: "essentials", tone: "gloss-green" },
] as const;
export type CollectionId = Exclude<(typeof collections)[number]["id"], "all">;

export type Product = {
  slug: string;
  name: string;
  price: number;
  collection: CollectionId;
  garment: Garment; // used for the placeholder illustration
  colour: string; // placeholder illustration colour
  sizes: string[];
  description: string;
  care?: string;
  images?: string[];
  badge?: "PRE ORDER" | "NEW" | "LOW STOCK";
  soldOut?: boolean;
};

export const products: Product[] = [
  { slug: "cloud-zip-hoodie", name: "cloud zip hoodie", price: 6800, collection: "drop-01", garment: "hoodie", colour: "#a9d4ff", sizes: ["XS", "S", "M", "L", "XL", "2XL"], badge: "PRE ORDER", description: "Brushed-back heavyweight fleece with a tonal puff print. Boxy, slightly cropped fit.", care: "Wash cold inside out. Don't tumble dry." },
  { slug: "blossom-baby-tee", name: "blossom baby tee", price: 3400, collection: "drop-01", garment: "tee", colour: "#ffbfdf", sizes: ["XS", "S", "M", "L", "XL"], badge: "NEW", description: "Stretchy rib baby tee with an all-over floral print. Fitted.", care: "Wash at 30°. Hang dry." },
  { slug: "dew-cargos", name: "dew cargos", price: 7800, collection: "essentials", garment: "trousers", colour: "#c4e6bd", sizes: ["XS", "S", "M", "L", "XL"], description: "Relaxed parachute cargos with toggle hems and six pockets.", care: "Wash at 30°." },
  { slug: "halo-cap", name: "halo cap", price: 2600, collection: "essentials", garment: "cap", colour: "#ffe28f", sizes: ["One size"], description: "Six-panel washed cotton cap with a tiny embroidered bubble. Adjustable strap.", care: "Spot clean." },
  { slug: "mist-tote", name: "mist tote", price: 2000, collection: "limited", garment: "tote", colour: "#d6d0ff", sizes: ["One size"], badge: "LOW STOCK", description: "Oversized canvas tote. Fits a laptop, three snacks and a spare hoodie.", care: "Wash cold." },
  { slug: "static-tee", name: "static tee", price: 3400, collection: "limited", garment: "tee", colour: "#dfe4ec", sizes: ["XS", "S", "M", "L", "XL"], soldOut: true, description: "Our best seller is back soon. Organic cotton, regular fit.", care: "Wash at 30°." },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
