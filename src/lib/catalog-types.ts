// Shapes of the product data stored by the CMS (/admin). Safe to use anywhere.

export type Garment = "tee" | "hoodie" | "cap" | "tote" | "trousers";

// Collections = the coloured filter pills on the store page.
export const collections = [
  { id: "all", label: "all", tone: "" },
  { id: "limited", label: "limited", tone: "gloss-pink" },
  { id: "drop-01", label: "drop 01", tone: "gloss-yellow", isNew: true },
  { id: "essentials", label: "essentials", tone: "gloss-green" },
] as const;
export type CollectionId = Exclude<(typeof collections)[number]["id"], "all">;
export const collectionIds = collections.filter((c) => c.id !== "all").map((c) => c.id) as CollectionId[];

export const badges = ["PRE ORDER", "NEW", "LOW STOCK"] as const;
export type Badge = (typeof badges)[number];

export type Colour = {
  id: string;
  name: string; // e.g. "brown"
  icon?: string; // uploaded icon (media key), e.g. a brown circle
  swatch?: string; // hex colour used when there's no icon
  images: string[]; // media keys, in display order
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number; // pence
  collection: CollectionId;
  sizes: string[];
  description: string;
  care?: string;
  badge?: Badge;
  soldOut?: boolean;
  published: boolean;
  colours: Colour[];
  placeholder?: Garment; // demo drawing shown when a colour has no photos
  sort: number;
  updatedAt?: string;
};

export const mediaUrl = (key: string) => `/media/${key}`;
export const MEDIA_KEY = /^[a-z0-9-]{8,64}\.(webp|png|jpg|jpeg|gif|svg)$/i;

/** First photo of the product (first colour that has one). */
export const coverImage = (p: Product) => p.colours.find((c) => c.images.length)?.images[0];
export const colourOf = (p: Product, id?: string) => p.colours.find((c) => c.id === id) ?? p.colours[0];
/** One colour only → no colour picker, colour isn't mentioned in the bag. */
export const hasColourChoice = (p: Product) => p.colours.length > 1;

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "product";
