import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[100svh] flex flex-col items-center justify-center text-center px-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.webp" alt="" className="h-28 w-auto" style={{ animation: "float 3s ease-in-out infinite" }} />
      <h1 className="h-tight text-8xl mt-6">404</h1>
      <p className="font-semibold mt-2 text-neutral-600">this page floated away.</p>
      <Link href="/" className="gloss gloss-primary text-xl mt-8">go home</Link>
    </main>
  );
}
