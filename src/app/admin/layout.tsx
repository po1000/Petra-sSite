import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata = { title: "Studio", robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100svh] bg-[var(--soft)]">
      <header className="sticky top-0 z-30 glass !rounded-none flex items-center justify-between gap-4 px-4 md:px-8 py-3">
        <Link href="/admin" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-sm.png" alt="" className="h-10 w-auto" />
          <span className="h-tight text-2xl">studio</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/admin" className="gloss gloss-white !py-1.5">products</Link>
          <a href="/" target="_blank" className="gloss gloss-white !py-1.5">view site ↗</a>
          <LogoutButton />
        </nav>
      </header>
      <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto">{children}</div>
    </div>
  );
}
