"use client";
import { readJson } from "@/lib/api-data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type Product } from "@/lib/catalog-types";
import { formatGBP } from "@/lib/site";
import ProductImage from "@/components/ProductImage";

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/products");
    if (res.status === 401) return router.push("/admin/login");
    const data = await readJson(res);
    if (!res.ok) return setError(data.error ?? "Couldn't load products");
    setProducts(data.products ?? []);
  };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function create() {
    setBusy(true);
    const res = await fetch("/api/admin/products", { method: "POST" });
    const data = await readJson(res);
    if (res.ok) router.push(`/admin/products/${data.product!.id}`);
    else { setError(data.error ?? "Couldn't create a product"); setBusy(false); }
  }

  async function move(i: number, dir: -1 | 1) {
    if (!products) return;
    const list = [...products];
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    setProducts(list);
    await fetch("/api/admin/reorder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: list.map((p) => p.id) }) });
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="h-tight text-5xl">products</h1>
          <p className="text-sm text-[var(--muted)] mt-1 tracking-normal">The order here is the order on the store page.</p>
        </div>
        <button onClick={create} disabled={busy} className="gloss gloss-primary text-lg">+ new product</button>
      </div>
      {error && <p className="text-[var(--red)] font-semibold mb-4">{error}</p>}
      {!products && !error && <p className="text-[var(--muted)]">loading…</p>}
      {products?.length === 0 && <p className="text-[var(--muted)]">No products yet. Click “new product” to add one.</p>}
      <ul className="space-y-3">
        {products?.map((p, i) => (
          <li key={p.id} className="bg-white rounded-3xl p-3 flex items-center gap-4 shadow-[0_10px_30px_-20px_rgba(30,70,140,0.4)]">
            <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-[var(--soft)]"><ProductImage p={p} fit="cover" /></div>
            <Link href={`/admin/products/${p.id}`} className="flex-1 min-w-0">
              <p className="font-semibold text-lg truncate">{p.name}</p>
              <p className="text-sm text-[var(--muted)] tracking-normal">
                {formatGBP(p.price)} · {p.colours.length} colour{p.colours.length === 1 ? "" : "s"} · {p.colours.reduce((n, c) => n + c.images.length, 0)} photos
              </p>
              <div className="flex gap-2 mt-1 text-xs font-semibold">
                <span className={`px-2 py-0.5 rounded-full ${p.published ? "bg-[var(--green-light)]" : "bg-[var(--line)]"}`}>{p.published ? "live" : "hidden"}</span>
                {p.soldOut && <span className="px-2 py-0.5 rounded-full bg-[var(--pink-light)]">sold out</span>}
                {p.badge && <span className="px-2 py-0.5 rounded-full bg-[var(--yellow-light)]">{p.badge.toLowerCase()}</span>}
              </div>
            </Link>
            <div className="flex flex-col gap-1">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="w-8 h-8 rounded-full hover:bg-[var(--soft)] disabled:opacity-30" aria-label={`Move ${p.name} up`}>↑</button>
              <button onClick={() => move(i, 1)} disabled={i === products.length - 1} className="w-8 h-8 rounded-full hover:bg-[var(--soft)] disabled:opacity-30" aria-label={`Move ${p.name} down`}>↓</button>
            </div>
            <Link href={`/admin/products/${p.id}`} className="gloss gloss-white !py-1.5 text-sm">edit</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
