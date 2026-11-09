export default function Marquee({ text, className = "", reverse = false }: { text: string; className?: string; reverse?: boolean }) {
  const chunk = (
    <span className="px-6 whitespace-nowrap" aria-hidden>{text}</span>
  );
  return (
    <div className={`overflow-hidden border-y-[3px] border-[var(--ink)] py-2 ${className}`} role="marquee" aria-label={text}>
      <div className={`flex w-max ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}>
        {chunk}{chunk}{chunk}{chunk}
      </div>
    </div>
  );
}
