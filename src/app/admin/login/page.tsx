"use client";
import { readJson } from "@/lib/api-data";
import { useState } from "react";

export default function AdminLogin() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (res.ok) {
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.href = next && next.startsWith("/admin") ? next : "/admin";
    } else {
      setError((await readJson(res)).error ?? "Couldn't log in");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="glass rounded-[32px] p-8 max-w-sm mx-auto mt-16 text-center space-y-4">
      <h1 className="h-tight text-4xl">studio login</h1>
      <p className="text-sm text-neutral-600 tracking-normal">Edit products, prices, colours and photos.</p>
      <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="admin password" autoFocus required aria-label="Admin password"
        className="w-full rounded-full border border-[var(--line)] bg-white px-5 py-3 text-center outline-none focus:shadow-[0_0_0_3px_var(--accent-light)]" />
      {error && <p className="text-sm font-semibold text-[var(--red)]">{error}</p>}
      <button disabled={busy} className="gloss gloss-primary w-full text-lg !py-3">{busy ? "one sec…" : "log in"}</button>
    </form>
  );
}
