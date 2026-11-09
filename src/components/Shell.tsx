"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Shell({ children }: { children: React.ReactNode }) {
  const isHome = usePathname() === "/";
  return (
    <>
      {!isHome && <Sidebar />}
      <div className={isHome ? "relative" : "md:pl-[160px] pb-28 md:pb-0"}>
        <TopBar isHome={isHome} />
        {children}
      </div>
    </>
  );
}
