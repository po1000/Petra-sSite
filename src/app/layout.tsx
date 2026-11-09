import type { Metadata } from "next";
import { Bricolage_Grotesque, Rubik_Mono_One } from "next/font/google";
import "./globals.css";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CookieBanner from "@/components/CookieBanner";
import { site } from "@/lib/site";

const body = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-body" });
const display = Rubik_Mono_One({ subsets: ["latin"], weight: "400", variable: "--font-display" });

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className={`${body.variable} ${display.variable} antialiased`}>
        <Loader />
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <CookieBanner />
      </body>
    </html>
  );
}
