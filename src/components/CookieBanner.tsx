"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// UK PECR/GDPR: you need consent before setting non-essential cookies
// (analytics, ads). The site currently sets none — only the cart, which is
// essential. If the client adds analytics later, only load it when
// localStorage "cookie-consent" === "all".
export default function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try { setShow(!localStorage.getItem("cookie-consent")); } catch {}
  }, []);
  const choose = (v: string) => {
    try { localStorage.setItem("cookie-consent", v); } catch {}
    setShow(false);
  };
  if (!show) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-sm z-[45] card bg-[var(--yellow)] p-4">
      <p className="font-bold">🍪 Cookie check</p>
      <p className="text-sm mt-1">We use essential cookies to keep your bag working. With your OK we&apos;d also use analytics cookies. <Link href="/info/privacy" className="underline">More info</Link></p>
      <div className="flex gap-2 mt-3">
        <button className="btn-pill bg-[var(--paper)] text-sm" onClick={() => choose("essential")}>Essential only</button>
        <button className="btn-pill bg-[var(--green)] text-sm" onClick={() => choose("all")}>Accept all</button>
      </div>
    </div>
  );
}
