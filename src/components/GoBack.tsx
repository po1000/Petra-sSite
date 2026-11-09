"use client";
import { useRouter } from "next/navigation";

export default function GoBack({ fallback = "/shop" }: { fallback?: string }) {
  const router = useRouter();
  return (
    <button
      className="gloss gloss-primary text-lg"
      onClick={() => (window.history.length > 1 ? router.back() : router.push(fallback))}
    >
      ← go back
    </button>
  );
}
