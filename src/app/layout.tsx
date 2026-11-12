import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const body = Inter_Tight({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className={`${body.variable} antialiased`}>{children}</body>
    </html>
  );
}
