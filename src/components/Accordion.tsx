// Expandable sections with a sparkle "+" that spins when opened.
export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 1 C12.6 8 16 11.4 23 12 C16 12.6 12.6 16 12 23 C11.4 16 8 12.6 1 12 C8 11.4 11.4 8 12 1Z" fill="currentColor" />
    </svg>
  );
}

export default function Accordion({ items }: { items: { title: string; body: React.ReactNode }[] }) {
  return (
    <div className="divide-y divide-[var(--line)]">
      {items.map((it) => (
        <details key={it.title} className="group py-4">
          <summary className="flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
            <span className="h-tight text-2xl md:text-3xl">{it.title}</span>
            <Sparkle className="w-5 h-5 text-[var(--accent-deep)] transition-transform duration-500 group-open:rotate-[135deg]" />
          </summary>
          <div className="pt-3 text-[15px] leading-relaxed text-neutral-700 tracking-normal">{it.body}</div>
        </details>
      ))}
    </div>
  );
}
