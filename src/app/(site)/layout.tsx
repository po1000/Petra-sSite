import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";
import Shell from "@/components/Shell";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CookieBanner from "@/components/CookieBanner";
import { CatalogProvider } from "@/components/Catalog";
import { listProducts } from "@/lib/db";

// Product data comes from the database, so pages are built on each visit.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const products = await listProducts();
  return (
    <CatalogProvider products={products}>
      <Loader />
      <Cursor />
      <Shell>
        <main>{children}</main>
        <Footer />
      </Shell>
      <CartDrawer />
      <CookieBanner />
    </CatalogProvider>
  );
}
