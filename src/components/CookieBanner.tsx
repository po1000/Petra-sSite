"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// UK PECR/GDPR: you need consent before setting non-essential cookies
// (analytics, ads). The site currently sets none — only the bag, which is
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
    <div className="fixed bottom-24 md:bottom-5 left-3 right-3 md:left-auto md:right-5 md:max-w-sm z-[45] glass rounded-[26px] p-5">
      <p className="font-semibold">cookies?</p>
      <p className="text-sm mt-1 text-neutral-700 tracking-normal">We use essential cookies to keep your bag working. With your OK we&apos;d also use analytics cookies. <Link href="/info/privacy" className="underline">More info</Link></p>
      <div className="flex gap-2 mt-4">
        <button className="gloss gloss-white text-sm" onClick={() => choose("essential")}>essential only</button>
        <button className="gloss gloss-primary text-sm" onClick={() => choose("all")}>accept all</button>
      </div>
    </div>
  );
}
