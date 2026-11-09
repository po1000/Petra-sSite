import Link from "next/link";
import ClearCart from "./ClearCart";
import { Starburst } from "@/components/Stickers";

export const metadata = { title: "Order confirmed" };

export default function Success() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <ClearCart />
      <Starburst className="w-32 spin-slow" color="var(--green)" />
      <h1 className="font-display text-5xl md:text-7xl mt-6">You did it!</h1>
      <p className="mt-4 font-bold max-w-md">Order confirmed. A receipt is on its way to your inbox. We&apos;ll email again when it ships.</p>
      <Link href="/shop" className="btn-pill bg-[var(--yellow)] mt-6">Keep browsing</Link>
    </section>
  );
}
