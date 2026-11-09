import type { Garment } from "@/lib/products";

// Placeholder product "photos" drawn in SVG until the client sends real ones.
const shapes: Record<Garment, string> = {
  tee: "M60 40 L90 25 Q100 40 110 25 L140 40 L165 75 L140 88 L140 170 L60 170 L60 88 L35 75 Z",
  hoodie: "M62 45 Q75 20 100 22 Q125 20 138 45 L165 70 L172 160 L148 162 L142 95 L142 172 L58 172 L58 95 L52 162 L28 160 L35 70 Z",
  cap: "M45 120 Q45 55 100 55 Q155 55 155 120 Z M40 118 L175 118 Q180 132 160 135 L40 132 Z",
  tote: "M55 75 L145 75 L150 172 L50 172 Z M75 75 Q75 30 100 30 Q125 30 125 75",
  trousers: "M65 25 L135 25 L145 172 L110 172 L100 70 L90 172 L55 172 Z",
};

export default function ProductArt({ garment, colour, className }: { garment: Garment; colour: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={`${garment} illustration`}>
      <path d={shapes[garment]} fill={colour} stroke="var(--ink)" strokeWidth="5" strokeLinejoin="round" />
      {garment !== "tote" && garment !== "trousers" && (
        <g transform="translate(100 105)">
          <circle r="16" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
          <circle cx="-5" cy="-3" r="2.5" fill="var(--ink)" />
          <circle cx="5" cy="-3" r="2.5" fill="var(--ink)" />
          <path d="M-6 5 Q0 11 6 5" stroke="var(--ink)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      )}
      {garment === "tote" && <text x="100" y="135" textAnchor="middle" fontSize="18" fontWeight="900" fill="var(--ink)">BIG ♥</text>}
    </svg>
  );
}
