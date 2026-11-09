import type { Garment } from "@/lib/products";

// Soft placeholder "product shots" until the client sends real photos.
const shapes: Record<Garment, string> = {
  tee: "M62 42 Q78 30 88 26 Q100 38 112 26 Q122 30 138 42 L162 74 L140 86 L140 168 Q100 174 60 168 L60 86 L38 74 Z",
  hoodie: "M64 46 Q74 22 100 22 Q126 22 136 46 L160 66 Q170 110 170 158 L148 160 L142 100 L142 170 Q100 176 58 170 L58 100 L52 160 L30 158 Q30 110 40 66 Z",
  cap: "M48 118 Q46 58 100 56 Q154 58 152 118 Z M44 116 L170 116 Q178 132 156 136 L44 130 Z",
  tote: "M54 78 L146 78 L152 170 Q100 175 48 170 Z M76 78 Q76 32 100 32 Q124 32 124 78",
  trousers: "M66 26 L134 26 L146 170 L112 172 L100 74 L88 172 L54 170 Z",
};
const details: Record<Garment, string> = {
  tee: "M60 160 Q100 166 140 160 M88 26 Q100 44 112 26",
  hoodie: "M76 120 L124 120 L130 150 L70 150 Z M86 46 Q100 64 114 46",
  cap: "M100 56 L100 116 M70 62 Q82 90 80 116 M130 62 Q118 90 120 116",
  tote: "M54 92 L146 92",
  trousers: "M66 40 L134 40 M100 40 L100 74 M68 96 L82 96 L82 118 L68 118 Z M118 96 L132 96 L132 118 L118 118 Z",
};

const mix = (hex: string, to: string, t: number) => {
  const a = hex.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  const b = to.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join("");
};

export default function ProductArt({ garment, colour, className }: { garment: Garment; colour: string; className?: string }) {
  const id = `pa-${garment}-${colour.slice(1)}`;
  const shade = mix(colour, "#26324d", 0.35);
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={`${garment} placeholder image`}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor={mix(colour, "#ffffff", 0.55)} />
          <stop offset="1" stopColor={mix(colour, "#26324d", 0.08)} />
        </linearGradient>
        <radialGradient id={`${id}-h`} cx="0.35" cy="0.25" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-c`}><path d={shapes[garment]} /></clipPath>
        <filter id={`${id}-s`}><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <ellipse cx="100" cy="182" rx="58" ry="7" fill="#1e3a6e" opacity="0.14" filter={`url(#${id}-s)`} />
      <path d={shapes[garment]} fill={`url(#${id}-g)`} />
      <g clipPath={`url(#${id}-c)`}>
        <rect width="200" height="200" fill={`url(#${id}-h)`} />
        <path d={details[garment]} fill="none" stroke={shade} strokeOpacity="0.35" strokeWidth="1.4" strokeDasharray="3 3" />
      </g>
      {(garment === "tee" || garment === "hoodie" || garment === "cap") && (
        <g transform={`translate(100 ${garment === "cap" ? 90 : 72})`}>
          <circle r="7" fill="#5ab0ff" />
          <circle cx="-2.4" cy="-2.6" r="1.8" fill="#fff" />
        </g>
      )}
    </svg>
  );
}
