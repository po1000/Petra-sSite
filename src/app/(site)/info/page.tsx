import Link from "next/link";
import GoBack from "@/components/GoBack";

export const metadata = { title: "Info" };

const links = [
  ["about", "/info/about", "gloss-primary"], ["shipping", "/info/shipping", "gloss-pink"],
  ["returns", "/info/returns", "gloss-yellow"], ["size guide", "/info/size-guide", "gloss-green"],
  ["contact", "/info/contact", "gloss-white"], ["terms", "/info/terms", "gloss-white"], ["privacy", "/info/privacy", "gloss-white"],
];

export default function Info() {
  return (
    <section className="px-4 md:px-8 pt-4">
      <GoBack fallback="/" />
      <h1 className="h-tight text-6xl md:text-8xl mt-6 mb-10">info</h1>
      <div className="flex flex-wrap gap-4">
        {links.map(([label, href, tone]) => <Link key={href} href={href} className={`gloss ${tone} text-2xl md:text-3xl !py-4 !px-8`}>{label}</Link>)}
      </div>
    </section>
  );
}
