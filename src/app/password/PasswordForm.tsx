"use client";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PasswordForm() {
  const next = useSearchParams().get("next");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const res = await fetch("/api/site-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (res.ok) {
      window.location.href = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
    } else {
      setError("wrong password, try again");
      setShake((n) => n + 1);
      setBusy(false);
    }
  }

  return (
    <motion.form key={shake} onSubmit={submit} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}} className="mt-6 space-y-3">
      <input
        type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="password" autoFocus required
        aria-label="Password"
        className="w-full rounded-full border border-[var(--line)] bg-white/90 px-5 py-3 text-center outline-none focus:shadow-[0_0_0_3px_var(--accent-light)]"
      />
      {error && <p className="text-sm font-semibold text-[var(--red)]">{error}</p>}
      <button disabled={busy} className="gloss gloss-primary w-full text-xl !py-3">{busy ? "one sec…" : "enter"}</button>
    </motion.form>
  );
}
