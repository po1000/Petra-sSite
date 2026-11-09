import Link from "next/link";
import { Smiley } from "@/components/Stickers";

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <Smiley className="w-28 rotate-180" color="var(--blue)" />
      <h1 className="font-display text-6xl mt-6">404</h1>
      <p className="font-bold mt-2">This page wandered off.</p>
      <Link href="/" className="btn-pill bg-[var(--pink)] mt-6">Go home</Link>
    </section>
  );
}
