import Link from "next/link";
import { site } from "@/lib/site";
import { Flower } from "./Stickers";

export default function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-[var(--paper)] mt-24 relative overflow-hidden">
      <Flower className="absolute -top-10 -right-10 w-48 h-48 spin-slow opacity-90" />
      <div className="px-4 md:px-8 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-display text-5xl">{site.name}</p>
          <p className="mt-2 opacity-80">{site.tagline}</p>
        </div>
        <ul className="space-y-1 font-bold">
          <li><Link href="/info/shipping" className="wiggle">Shipping</Link></li>
          <li><Link href="/info/returns" className="wiggle">Returns & refunds</Link></li>
          <li><Link href="/info/size-guide" className="wiggle">Size guide</Link></li>
          <li><Link href="/info/contact" className="wiggle">Contact</Link></li>
          <li><Link href="/info/terms" className="wiggle">Terms</Link></li>
          <li><Link href="/info/privacy" className="wiggle">Privacy & cookies</Link></li>
        </ul>
        <div className="space-y-1">
          <a href={site.instagram} className="block font-bold wiggle">Instagram ↗</a>
          <a href={site.tiktok} className="block font-bold wiggle">TikTok ↗</a>
          <a href={`mailto:${site.email}`} className="block wiggle">{site.email}</a>
        </div>
      </div>
      <p className="px-4 md:px-8 pb-6 text-xs opacity-70">
        © {new Date().getFullYear()} {site.legal.tradingName}
        {site.legal.companyNumber && ` · Registered in England & Wales no. ${site.legal.companyNumber}`}
        {` · ${site.legal.registeredAddress}`}
        {site.legal.vatNumber && ` · VAT ${site.legal.vatNumber}`}
      </p>
    </footer>
  );
}
