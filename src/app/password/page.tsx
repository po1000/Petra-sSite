import { Suspense } from "react";
import DreamScene from "@/components/DreamScene";
import Cursor from "@/components/Cursor";
import PasswordForm from "./PasswordForm";

export const metadata = { title: "Password", robots: { index: false } };

export default function PasswordPage() {
  return (
    <main className="relative min-h-[100svh] flex items-center justify-center px-4">
      <Cursor />
      <DreamScene />
      <div className="relative glass rounded-[32px] p-8 md:p-10 w-full max-w-sm text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.webp" alt="logo" className="h-24 mx-auto" style={{ animation: "float 4s ease-in-out infinite" }} />
        <h1 className="h-tight text-4xl mt-6">coming soon</h1>
        <p className="mt-2 text-sm text-neutral-600 tracking-normal">This site is password protected.</p>
        <Suspense>
          <PasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
