import Link from "next/link";
import ClearCart from "./ClearCart";

export const metadata = { title: "Order confirmed" };

export default function Success() {
  return (
    <section className="min-h-[65vh] flex flex-col items-center justify-center text-center px-4">
      <ClearCart />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.webp" alt="" className="h-28 w-auto" style={{ animation: "float 2.4s ease-in-out infinite" }} />
      <h1 className="h-tight text-6xl md:text-8xl mt-8">thank you!</h1>
      <p className="mt-4 font-semibold max-w-md text-neutral-600">Order confirmed. A receipt is on its way to your inbox, and we&apos;ll email again when it ships.</p>
      <Link href="/shop" className="gloss gloss-primary text-xl mt-8">keep browsing</Link>
    </section>
  );
}
