"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./Nav";

export default function Sidebar() {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href) || (href === "/shop" && path.startsWith("/product")));
  return (
    <>
      {/* desktop: column of icons on the left */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-[160px] flex-col items-center justify-center gap-8 z-30" aria-label="Main">
        {navItems.map((n) => (
          <Link key={n.href} href={n.href} className="dock-item flex flex-col items-center gap-2">
            <span className="h-20 grid place-items-center">{n.icon}</span>
            <span className={`text-sm font-semibold px-2 rounded-full ${active(n.href) ? "bg-[var(--accent-light)]" : ""}`}>{n.label}</span>
          </Link>
        ))}
      </nav>
      {/* mobile: floating glass dock at the bottom */}
      <nav className="md:hidden fixed bottom-3 inset-x-3 z-30 glass rounded-[28px] flex justify-around items-end px-2 py-2" aria-label="Main">
        {navItems.map((n) => (
          <Link key={n.href} href={n.href} className="dock-item flex flex-col items-center gap-1 [&_.pix]:!w-9 [&_.pix]:!h-auto [&_.bubble]:!h-9">
            <span className="h-10 grid place-items-center">{n.icon}</span>
            <span className={`text-[11px] font-semibold px-1.5 rounded-full ${active(n.href) ? "bg-[var(--accent-light)]" : ""}`}>{n.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
