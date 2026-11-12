import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { badges, collectionIds, MEDIA_KEY, slugify, type Colour, type Product } from "./catalog-types";
import { seedProducts } from "./seed";

// Products live in a Cloudflare D1 database (one row per product, details as
// JSON). Photos live in Cloudflare KV (see /api/admin/upload and /media).

export async function cfEnv() {
  return (await getCloudflareContext({ async: true })).env;
}

let ready: Promise<void> | null = null;

async function setup(DB: D1Database) {
  await DB.batch([
    DB.prepare("CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, sort INTEGER NOT NULL DEFAULT 0, published INTEGER NOT NULL DEFAULT 1, data TEXT NOT NULL, updated_at TEXT NOT NULL)"),
    DB.prepare("CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT)"),
  ]);
  const seeded = await DB.prepare("SELECT value FROM meta WHERE key = 'seeded'").first();
  if (!seeded) {
    const now = new Date().toISOString();
    await DB.batch([
      ...seedProducts.map((s, i) =>
        DB.prepare("INSERT OR IGNORE INTO products (id, slug, sort, published, data, updated_at) VALUES (?, ?, ?, 1, ?, ?)")
          .bind(crypto.randomUUID(), s.slug, i, JSON.stringify(s), now)
      ),
      DB.prepare("INSERT OR IGNORE INTO meta (key, value) VALUES ('seeded', ?)").bind(now),
    ]);
  }
}

async function db() {
  const { DB } = await cfEnv();
  ready ??= setup(DB).catch((e) => { ready = null; throw e; });
  await ready;
  return DB;
}

type Row = { id: string; slug: string; sort: number; published: number; data: string; updated_at: string };

const fromRow = (r: Row): Product => ({
  ...(JSON.parse(r.data) as Product),
  id: r.id, slug: r.slug, sort: r.sort, published: !!r.published, updatedAt: r.updated_at,
});

export async function listProducts({ includeHidden = false } = {}) {
  const DB = await db();
  const sql = `SELECT * FROM products ${includeHidden ? "" : "WHERE published = 1"} ORDER BY sort, updated_at`;
  const { results } = await DB.prepare(sql).all<Row>();
  return results.map(fromRow);
}

export async function getProductBySlug(slug: string, { includeHidden = false } = {}) {
  const DB = await db();
  const r = await DB.prepare(`SELECT * FROM products WHERE slug = ? ${includeHidden ? "" : "AND published = 1"}`).bind(slug).first<Row>();
  return r ? fromRow(r) : null;
}

export async function getProductById(id: string) {
  const DB = await db();
  const r = await DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first<Row>();
  return r ? fromRow(r) : null;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const mediaKey = (v: unknown) => (typeof v === "string" && MEDIA_KEY.test(v) ? v : undefined);

/** Turns whatever the editor sent into a safe, complete product. */
function clean(input: Partial<Product>, existing: Product): Product {
  const name = str(input.name, 120) || "untitled";
  const sizes = Array.isArray(input.sizes) ? [...new Set(input.sizes.map((s) => str(s, 20)).filter(Boolean))].slice(0, 20) : existing.sizes;
  const colours: Colour[] = (Array.isArray(input.colours) ? input.colours : existing.colours).slice(0, 30).map((c, i) => ({
    id: /^[\w-]{1,64}$/.test(String(c?.id)) ? String(c.id) : crypto.randomUUID(),
    name: str(c?.name, 40) || `colour ${i + 1}`,
    icon: mediaKey(c?.icon),
    swatch: /^#[0-9a-f]{6}$/i.test(String(c?.swatch)) ? String(c.swatch) : undefined,
    images: (Array.isArray(c?.images) ? c.images : []).map(mediaKey).filter((k): k is string => !!k).slice(0, 40),
  }));
  return {
    ...existing,
    name,
    slug: slugify(str(input.slug, 80) || name),
    price: Math.max(0, Math.min(10_000_000, Math.round(Number(input.price) || 0))),
    collection: collectionIds.includes(input.collection as never) ? input.collection! : existing.collection,
    sizes: sizes.length ? sizes : ["One size"],
    description: str(input.description, 5000),
    care: str(input.care, 2000) || undefined,
    badge: badges.includes(input.badge as never) ? input.badge : undefined,
    soldOut: !!input.soldOut,
    published: !!input.published,
    colours: colours.length ? colours : [{ id: crypto.randomUUID(), name: "default", images: [] }],
  };
}

const mediaKeys = (p: Product) => new Set(p.colours.flatMap((c) => [...c.images, ...(c.icon ? [c.icon] : [])]));

async function uniqueSlug(DB: D1Database, slug: string, id: string) {
  for (let n = 1; ; n++) {
    const candidate = n === 1 ? slug : `${slug}-${n}`;
    const taken = await DB.prepare("SELECT id FROM products WHERE slug = ? AND id != ?").bind(candidate, id).first();
    if (!taken) return candidate;
  }
}

export async function createProduct() {
  const DB = await db();
  const id = crypto.randomUUID();
  const max = await DB.prepare("SELECT COALESCE(MAX(sort), -1) AS m FROM products").first<{ m: number }>();
  const p: Product = {
    id, slug: await uniqueSlug(DB, "new-product", id), name: "new product", price: 0, collection: collectionIds[0],
    sizes: ["XS", "S", "M", "L", "XL"], description: "", published: false, sort: (max?.m ?? -1) + 1,
    colours: [{ id: crypto.randomUUID(), name: "default", images: [] }],
  };
  await write(DB, p);
  return p;
}

async function write(DB: D1Database, p: Product) {
  const { id, slug, sort, published, updatedAt: _u, ...rest } = p;
  void _u;
  await DB.prepare(
    "INSERT INTO products (id, slug, sort, published, data, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET slug = excluded.slug, sort = excluded.sort, published = excluded.published, data = excluded.data, updated_at = excluded.updated_at"
  ).bind(id, slug, sort, published ? 1 : 0, JSON.stringify(rest), new Date().toISOString()).run();
}

export async function saveProduct(id: string, input: Partial<Product>) {
  const DB = await db();
  const existing = await getProductById(id);
  if (!existing) return null;
  const p = clean(input, existing);
  p.slug = await uniqueSlug(DB, p.slug, id);
  await write(DB, p);
  // Delete photos that were removed from the product.
  const keep = mediaKeys(p);
  await deleteMedia([...mediaKeys(existing)].filter((k) => !keep.has(k)));
  return getProductById(id);
}

export async function deleteProduct(id: string) {
  const DB = await db();
  const existing = await getProductById(id);
  if (!existing) return false;
  await DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
  await deleteMedia([...mediaKeys(existing)]);
  return true;
}

export async function reorderProducts(ids: string[]) {
  const DB = await db();
  await DB.batch(ids.slice(0, 500).map((id, i) => DB.prepare("UPDATE products SET sort = ? WHERE id = ?").bind(i, String(id))));
}

async function deleteMedia(keys: string[]) {
  if (!keys.length) return;
  const { MEDIA } = await cfEnv();
  await Promise.allSettled(keys.map((k) => MEDIA.delete(k)));
}
