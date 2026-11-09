import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";
import Shell from "@/components/Shell";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CookieBanner from "@/components/CookieBanner";
import { site } from "@/lib/site";

const body = Inter_Tight({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className={`${body.variable} antialiased`}>
        <Loader />
        <Cursor />
        <Shell>
          <main>{children}</main>
          <Footer />
        </Shell>
        <CartDrawer />
        <CookieBanner />
      </body>
    </html>
  );
}
