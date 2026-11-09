import GoBack from "@/components/GoBack";
import ArchiveGrid from "./ArchiveGrid";

export const metadata = { title: "Archive" };

export default function Archive() {
  return (
    <section className="px-4 md:px-8 pt-4">
      <GoBack fallback="/" />
      <h1 className="h-tight text-6xl md:text-8xl mt-6 mb-8">archive</h1>
      <ArchiveGrid />
    </section>
  );
}
