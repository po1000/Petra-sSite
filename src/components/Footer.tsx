import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  ["shipping", "/info/shipping"], ["returns", "/info/returns"], ["size guide", "/info/size-guide"],
  ["contact", "/info/contact"], ["terms", "/info/terms"], ["privacy", "/info/privacy"],
];

export default function Footer() {
  return (
    <footer className="mt-28 px-4 md:px-8 pb-8">
      <div className="border-t border-[var(--line)] pt-8 flex flex-col md:flex-row gap-6 md:items-end md:justify-between">
        <div>
          <p className="h-tight text-5xl">{site.name}</p>
          <p className="mt-2 text-[var(--muted)]">{site.tagline}</p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 font-semibold text-sm">
          {links.map(([l, h]) => <li key={h}><Link href={h} className="hover:text-[var(--accent-deep)]">{l}</Link></li>)}
          <li><a href={site.instagram} className="hover:text-[var(--accent-deep)]">instagram ↗</a></li>
          <li><a href={site.tiktok} className="hover:text-[var(--accent-deep)]">tiktok ↗</a></li>
        </ul>
      </div>
      <p className="mt-6 text-xs text-[var(--muted)] tracking-normal">
        © {new Date().getFullYear()} {site.legal.tradingName}
        {site.legal.companyNumber && ` · Registered in England & Wales no. ${site.legal.companyNumber}`}
        {` · ${site.legal.registeredAddress}`}
        {site.legal.vatNumber && ` · VAT ${site.legal.vatNumber}`}
      </p>
    </footer>
  );
}
