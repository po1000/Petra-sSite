import type { Product } from "./catalog-types";

// Demo products added the very first time the database is used, so the shop
// isn't empty. The client can edit or delete them in /admin.
type Seed = Omit<Product, "id" | "sort" | "published">;

export const seedProducts: Seed[] = [
  { slug: "cloud-zip-hoodie", name: "cloud zip hoodie", price: 6800, collection: "drop-01", placeholder: "hoodie", sizes: ["XS", "S", "M", "L", "XL", "2XL"], badge: "PRE ORDER", description: "Brushed-back heavyweight fleece with a tonal puff print. Boxy, slightly cropped fit.", care: "Wash cold inside out. Don't tumble dry.",
    colours: [{ id: "sky", name: "sky", swatch: "#a9d4ff", images: [] }, { id: "lilac", name: "lilac", swatch: "#d6c8ff", images: [] }] },
  { slug: "blossom-baby-tee", name: "blossom baby tee", price: 3400, collection: "drop-01", placeholder: "tee", sizes: ["XS", "S", "M", "L", "XL"], badge: "NEW", description: "Stretchy rib baby tee with an all-over floral print. Fitted.", care: "Wash at 30°. Hang dry.",
    colours: [{ id: "pink", name: "pink", swatch: "#ffbfdf", images: [] }, { id: "cream", name: "cream", swatch: "#fff0cf", images: [] }] },
  { slug: "dew-cargos", name: "dew cargos", price: 7800, collection: "essentials", placeholder: "trousers", sizes: ["XS", "S", "M", "L", "XL"], description: "Relaxed parachute cargos with toggle hems and six pockets.", care: "Wash at 30°.",
    colours: [{ id: "sage", name: "sage", swatch: "#c4e6bd", images: [] }, { id: "stone", name: "stone", swatch: "#e2dccf", images: [] }] },
  { slug: "halo-cap", name: "halo cap", price: 2600, collection: "essentials", placeholder: "cap", sizes: ["One size"], description: "Six-panel washed cotton cap with a tiny embroidered bubble. Adjustable strap.", care: "Spot clean.",
    colours: [{ id: "butter", name: "butter", swatch: "#ffe28f", images: [] }] },
  { slug: "mist-tote", name: "mist tote", price: 2000, collection: "limited", placeholder: "tote", sizes: ["One size"], badge: "LOW STOCK", description: "Oversized canvas tote. Fits a laptop, three snacks and a spare hoodie.", care: "Wash cold.",
    colours: [{ id: "lilac", name: "lilac", swatch: "#d6d0ff", images: [] }] },
  { slug: "static-tee", name: "static tee", price: 3400, collection: "limited", placeholder: "tee", sizes: ["XS", "S", "M", "L", "XL"], soldOut: true, description: "Our best seller is back soon. Organic cotton, regular fit.", care: "Wash at 30°.",
    colours: [{ id: "grey", name: "grey", swatch: "#dfe4ec", images: [] }] },
];
