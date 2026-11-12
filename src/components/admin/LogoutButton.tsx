"use client";
import { usePathname } from "next/navigation";

export default function LogoutButton() {
  if (usePathname() === "/admin/login") return null;
  return (
    <button className="gloss gloss-white !py-1.5" onClick={async () => { await fetch("/api/admin/login", { method: "DELETE" }); window.location.href = "/admin/login"; }}>
      log out
    </button>
  );
}
