"use client";
import { readJson } from "@/lib/api-data";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { badges, collections, mediaUrl, slugify, type Colour, type Product } from "@/lib/catalog-types";
import { prepareImage } from "@/lib/prepare-image";
import { ColourIcon } from "@/components/ProductImage";

const field = "w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-2.5 outline-none focus:shadow-[0_0_0_3px_var(--accent-light)] tracking-normal";
const card = "bg-white rounded-3xl p-5 md:p-6 shadow-[0_10px_30px_-20px_rgba(30,70,140,0.4)]";
const label = "block text-sm font-semibold mb-1.5";
const sizePresets: Record<string, string[]> = {
  "XS–XL": ["XS", "S", "M", "L", "XL"],
  "XS–2XL": ["XS", "S", "M", "L", "XL", "2XL"],
  "one size": ["One size"],
};
const newId = () => crypto.randomUUID();

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [p, setP] = useState<Product | null>(null);
  const [priceText, setPriceText] = useState("");
  const [slugLocked, setSlugLocked] = useState(true);
  const [sizeInput, setSizeInput] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const loaded = (prod: Product) => {
    setP(prod);
    setPriceText((prod.price / 100).toFixed(2));
    setSlugLocked(prod.slug !== slugify(prod.name) && prod.slug !== "new-product");
  };

  useEffect(() => {
    fetch(`/api/admin/products/${id}`).then(async (res) => {
      if (res.status === 401) return router.push(`/admin/login?next=/admin/products/${id}`);
      const data = await readJson(res);
      if (res.ok && data.product) loaded(data.product);
      else setError(data.error ?? "Couldn't load this product");
    });
  }, [id, router]);

  // ── editing helpers ──
  const update = (patch: Partial<Product>) => { setP((prev) => (prev ? { ...prev, ...patch } : prev)); setDirty(true); };
  const updateColours = (fn: (cs: Colour[]) => Colour[]) => { setP((prev) => (prev ? { ...prev, colours: fn(prev.colours) } : prev)); setDirty(true); };
  const updateColour = (cid: string, fn: (c: Colour) => Colour) => updateColours((cs) => cs.map((c) => (c.id === cid ? fn(c) : c)));
  const move = <T,>(list: T[], i: number, dir: number) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return list;
    const copy = [...list];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return copy;
  };

  const save = useCallback(async () => {
    if (!p || saving) return;
    setSaving(true); setError("");
    const res = await fetch(`/api/admin/products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product: p }) });
    const data = await readJson(res);
    setSaving(false);
    if (res.status === 401) return setError("You've been logged out. Open the login page in a new tab, log in, then save again.");
    if (!res.ok) return setError(data.error ?? "Couldn't save");
    if (data.product) loaded(data.product);
    setDirty(false);
    setStatus(`saved ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`);
  }, [p, saving, id]);

  // Ctrl/Cmd + S saves; warn before leaving with unsaved changes.
  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") { e.preventDefault(); saveRef.current(); }
    };
    const onLeave = (e: BeforeUnloadEvent) => { if (dirty || uploading) e.preventDefault(); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("beforeunload", onLeave); };
  }, [dirty, uploading]);

  async function upload(files: FileList | File[], cid: string, kind: "photo" | "icon") {
    const list = [...files].filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    setError("");
    for (const file of kind === "icon" ? list.slice(0, 1) : list) {
      setUploading((n) => n + 1);
      try {
        const blob = await prepareImage(file, kind === "icon" ? 400 : 2400);
        const res = await fetch("/api/admin/upload", { method: "POST", headers: { "Content-Type": blob.type || file.type }, body: blob });
        const data = await readJson(res);
        if (!res.ok) throw new Error(data.error ?? `Couldn't upload ${file.name}`);
        const key = data.key!;
        updateColour(cid, (c) => (kind === "icon" ? { ...c, icon: key } : { ...c, images: [...c.images, key] }));
      } catch (e) {
        setError(e instanceof Error ? e.message : `Couldn't upload ${file.name}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
  }

  async function remove() {
    if (!p || !confirm(`Delete “${p.name}” and all its photos? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) { setDirty(false); router.push("/admin"); } else setError("Couldn't delete");
  }

  if (!p) return <p className="text-[var(--muted)]">{error || "loading…"}</p>;

  const addSize = (s: string) => {
    const v = s.trim();
    if (v && !p.sizes.includes(v)) update({ sizes: [...p.sizes, v] });
    setSizeInput("");
  };

  return (
    <div className="pb-28 space-y-6">
      <Link href="/admin" className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]">← all products</Link>
      <h1 className="h-tight text-5xl">{p.name || "untitled"}</h1>

      {/* basics */}
      <section className={`${card} grid gap-5 md:grid-cols-2`}>
        <div className="md:col-span-2">
          <label className={label} htmlFor="name">product title</label>
          <input id="name" className={field} value={p.name} onChange={(e) => update({ name: e.target.value, ...(slugLocked ? {} : { slug: slugify(e.target.value) }) })} />
        </div>
        <div>
          <label className={label} htmlFor="price">price (£)</label>
          <input id="price" className={field} inputMode="decimal" value={priceText}
            onChange={(e) => { setPriceText(e.target.value); update({ price: Math.round((parseFloat(e.target.value.replace(/[£,\s]/g, "")) || 0) * 100) }); }} />
        </div>
        <div>
          <label className={label} htmlFor="slug">web address</label>
          <div className="flex items-center gap-1 text-sm text-[var(--muted)]">
            <span>/product/</span>
            <input id="slug" className={field} value={p.slug} onChange={(e) => { setSlugLocked(true); update({ slug: e.target.value }); }} onBlur={() => update({ slug: slugify(p.slug) })} />
          </div>
        </div>
        <div>
          <label className={label} htmlFor="collection">collection</label>
          <select id="collection" className={field} value={p.collection} onChange={(e) => update({ collection: e.target.value as Product["collection"] })}>
            {collections.filter((c) => c.id !== "all").map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="badge">stamp on photo</label>
          <select id="badge" className={field} value={p.badge ?? ""} onChange={(e) => update({ badge: (e.target.value || undefined) as Product["badge"] })}>
            <option value="">none</option>
            {badges.map((b) => <option key={b} value={b}>{b.toLowerCase()}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-3 font-semibold">
          <input type="checkbox" className="w-5 h-5 accent-[var(--blue-deep)]" checked={p.published} onChange={(e) => update({ published: e.target.checked })} />
          visible on the site
        </label>
        <label className="flex items-center gap-3 font-semibold">
          <input type="checkbox" className="w-5 h-5 accent-[var(--blue-deep)]" checked={!!p.soldOut} onChange={(e) => update({ soldOut: e.target.checked })} />
          sold out
        </label>
      </section>

      {/* sizes */}
      <section className={card}>
        <p className={label}>sizes</p>
        <div className="flex flex-wrap gap-2 items-center">
          {p.sizes.map((s, i) => (
            <span key={s} className="inline-flex items-center gap-1 rounded-full bg-[var(--soft)] pl-3 pr-1 py-1 font-semibold">
              {s}
              <button onClick={() => update({ sizes: move(p.sizes, i, -1) })} className="w-6 h-6 rounded-full hover:bg-white text-xs" aria-label={`Move ${s} left`}>←</button>
              <button onClick={() => update({ sizes: p.sizes.filter((x) => x !== s) })} className="w-6 h-6 rounded-full hover:bg-white" aria-label={`Remove size ${s}`}>×</button>
            </span>
          ))}
          <input className={`${field} !w-32 !py-1.5`} placeholder="add size…" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSize(sizeInput); } }} onBlur={() => sizeInput && addSize(sizeInput)} aria-label="Add a size" />
        </div>
        <div className="flex gap-2 mt-3 text-sm">
          <span className="text-[var(--muted)]">quick fill:</span>
          {Object.entries(sizePresets).map(([name, sizes]) => (
            <button key={name} onClick={() => update({ sizes })} className="underline hover:text-[var(--accent-deep)]">{name}</button>
          ))}
        </div>
      </section>

      {/* colours + photos */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="h-tight text-3xl">colours & photos</h2>
            <p className="text-sm text-[var(--muted)] tracking-normal mt-1">Each colour has its own icon and photos. Any photo shape is fine: the store grid crops them to the same size, and the product page shows them in full. The first photo of the first colour is the main photo.</p>
          </div>
          <button className="gloss gloss-white shrink-0" onClick={() => updateColours((cs) => [...cs, { id: newId(), name: "", images: [] }])}>+ add colour</button>
        </div>

        {p.colours.map((c, ci) => (
          <div key={c.id} className={card}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); upload(e.dataTransfer.files, c.id, "photo"); }}>
            <div className="flex flex-wrap items-end gap-4">
              {/* icon */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-[var(--soft)] grid place-items-center"><ColourIcon c={c} size={44} /></div>
                <div className="flex flex-col gap-1 text-sm">
                  <label className="gloss gloss-white !py-1 text-sm">
                    {c.icon ? "change icon" : "upload icon"}
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => { if (e.target.files) upload(e.target.files, c.id, "icon"); e.target.value = ""; }} />
                  </label>
                  {c.icon ? (
                    <button className="underline text-[var(--muted)]" onClick={() => updateColour(c.id, (x) => ({ ...x, icon: undefined }))}>remove icon</button>
                  ) : (
                    <label className="flex items-center gap-2 text-[var(--muted)]">
                      or dot colour
                      <input type="color" value={c.swatch ?? "#dfe4ec"} onChange={(e) => updateColour(c.id, (x) => ({ ...x, swatch: e.target.value }))} className="w-7 h-7 rounded-full" aria-label="Dot colour" />
                    </label>
                  )}
                </div>
              </div>
              {/* name */}
              <div className="flex-1 min-w-48">
                <label className={label} htmlFor={`cname-${c.id}`}>colour name</label>
                <input id={`cname-${c.id}`} className={field} placeholder="e.g. brown" value={c.name} onChange={(e) => updateColour(c.id, (x) => ({ ...x, name: e.target.value }))} />
              </div>
              <div className="flex gap-1">
                <button onClick={() => updateColours((cs) => move(cs, ci, -1))} disabled={ci === 0} className="w-9 h-9 rounded-full hover:bg-[var(--soft)] disabled:opacity-30" aria-label="Move colour up">↑</button>
                <button onClick={() => updateColours((cs) => move(cs, ci, 1))} disabled={ci === p.colours.length - 1} className="w-9 h-9 rounded-full hover:bg-[var(--soft)] disabled:opacity-30" aria-label="Move colour down">↓</button>
                <button disabled={p.colours.length === 1}
                  onClick={() => { if (!c.images.length || confirm(`Remove the colour “${c.name}” and its ${c.images.length} photos?`)) updateColours((cs) => cs.filter((x) => x.id !== c.id)); }}
                  className="px-3 h-9 rounded-full text-sm font-semibold text-[var(--red)] hover:bg-[var(--pink-light)] disabled:opacity-30">remove colour</button>
              </div>
            </div>

            {/* photos */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-5">
              {c.images.map((key, ii) => (
                <div key={key} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mediaUrl(key)} alt="" className="w-full aspect-square object-cover rounded-2xl bg-[var(--soft)]" />
                  {ii === 0 && <span className="absolute top-1.5 left-1.5 chip !text-[10px] !px-2">first</span>}
                  <div className="absolute inset-x-1 bottom-1 flex justify-between opacity-100 md:opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => updateColour(c.id, (x) => ({ ...x, images: move(x.images, ii, -1) }))} disabled={ii === 0} className="w-7 h-7 rounded-full bg-white/90 shadow disabled:opacity-0" aria-label="Move photo left">←</button>
                    <button onClick={() => updateColour(c.id, (x) => ({ ...x, images: x.images.filter((k) => k !== key) }))} className="w-7 h-7 rounded-full bg-white/90 shadow text-[var(--red)]" aria-label="Remove photo">×</button>
                    <button onClick={() => updateColour(c.id, (x) => ({ ...x, images: move(x.images, ii, 1) }))} disabled={ii === c.images.length - 1} className="w-7 h-7 rounded-full bg-white/90 shadow disabled:opacity-0" aria-label="Move photo right">→</button>
                  </div>
                </div>
              ))}
              <label className="aspect-square rounded-2xl border-2 border-dashed border-[var(--line)] grid place-items-center text-center text-sm font-semibold text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent-deep)] p-2">
                + add photos<br /><span className="font-normal text-xs">or drop them here</span>
                <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { if (e.target.files) upload(e.target.files, c.id, "photo"); e.target.value = ""; }} />
              </label>
            </div>
          </div>
        ))}
      </section>

      {/* text */}
      <section className={`${card} space-y-5`}>
        <div>
          <label className={label} htmlFor="desc">description</label>
          <textarea id="desc" rows={5} className={field} value={p.description} onChange={(e) => update({ description: e.target.value })} />
        </div>
        <div>
          <label className={label} htmlFor="care">care (shown under “shipping + care”)</label>
          <textarea id="care" rows={2} className={field} value={p.care ?? ""} onChange={(e) => update({ care: e.target.value })} />
        </div>
      </section>

      <button onClick={remove} className="text-sm font-semibold text-[var(--red)] underline">delete this product</button>

      {/* save bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 glass !rounded-none px-4 md:px-8 py-3 flex items-center justify-end gap-4">
        <p className="mr-auto text-sm font-semibold tracking-normal">
          {error ? <span className="text-[var(--red)]">{error}</span>
            : uploading ? <span className="text-[var(--accent-deep)]">uploading {uploading} photo{uploading > 1 ? "s" : ""}…</span>
            : dirty ? <span className="text-[var(--yellow-deep)]">unsaved changes</span>
            : <span className="text-[var(--green-deep)]">{status || "all saved"}</span>}
        </p>
        {p.published && <a href={`/product/${p.slug}`} target="_blank" className="text-sm font-semibold underline hidden sm:inline">view on site ↗</a>}
        <button onClick={save} disabled={saving || !!uploading || !dirty} className="gloss gloss-primary text-lg">{saving ? "saving…" : "save"}</button>
      </div>
    </div>
  );
}
