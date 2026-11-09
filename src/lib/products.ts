// ─────────────────────────────────────────────────────────────
//  PRODUCTS — placeholder catalogue. Prices are in PENCE (2500 = £25).
//  Replace with the client's real products. To use real photos, drop
//  them in /public/products/ and set `images: ["/products/x.jpg"]`.
//  Prices are checked on the server at checkout, so nobody can
//  tamper with them in the browser.
// ─────────────────────────────────────────────────────────────
export type Garment = "tee" | "hoodie" | "cap" | "tote" | "trousers";

export type Product = {
  slug: string;
  name: string;
  price: number;
  garment: Garment; // used for the placeholder illustration
  colour: string; // placeholder illustration colour
  sizes: string[];
  description: string;
  images?: string[];
  badge?: string;
  soldOut?: boolean;
};

export const products: Product[] = [
  { slug: "brain-rot-tee", name: "Brain Rot Tee", price: 3200, garment: "tee", colour: "#ff5fa2", sizes: ["XS", "S", "M", "L", "XL"], badge: "NEW", description: "Heavyweight 240gsm cotton tee with a puff-print graphic. Boxy fit — size down for a regular fit." },
  { slug: "sunny-side-hoodie", name: "Sunny Side Hoodie", price: 6500, garment: "hoodie", colour: "#ffd23f", sizes: ["S", "M", "L", "XL"], description: "Brushed-back fleece hoodie with an embroidered egg. Very cosy, very yolk." },
  { slug: "touch-grass-cap", name: "Touch Grass Cap", price: 2400, garment: "cap", colour: "#3bce85", sizes: ["One size"], description: "Six-panel washed cotton cap. Adjustable strap. A gentle reminder." },
  { slug: "big-feelings-tote", name: "Big Feelings Tote", price: 1800, garment: "tote", colour: "#7b6cff", sizes: ["One size"], badge: "LOW STOCK", description: "Oversized canvas tote. Fits a laptop, three snacks and your emotional baggage." },
  { slug: "wobble-cargo", name: "Wobble Cargos", price: 7200, garment: "trousers", colour: "#ff7a3d", sizes: ["XS", "S", "M", "L", "XL"], description: "Relaxed parachute cargos with toggle hems and six pockets." },
  { slug: "alien-mum-tee", name: "Alien Mum Tee", price: 3200, garment: "tee", colour: "#4fc3ff", sizes: ["XS", "S", "M", "L", "XL"], soldOut: true, description: "Our best seller is back soon. Organic cotton, regular fit." },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
