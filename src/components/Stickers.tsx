// Quirky hand-made SVG "stickers". Swap for the client's own illustrations
// later (export from Illustrator/Figma as SVG and drop them in here).
type P = { className?: string; color?: string; style?: React.CSSProperties };

export const Starburst = ({ className, color = "var(--yellow)", style }: P) => (
  <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden>
    <path fill={color} stroke="var(--ink)" strokeWidth="5" d="M100 6l17 40 38-23-8 43 44 6-34 28 34 28-44 6 8 43-38-23-17 40-17-40-38 23 8-43-44-6 34-28-34-28 44-6-8-43 38 23z" />
  </svg>
);

export const Smiley = ({ className, color = "var(--yellow)", style }: P) => (
  <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
    <circle cx="50" cy="50" r="45" fill={color} stroke="var(--ink)" strokeWidth="4" />
    <ellipse cx="36" cy="40" rx="5" ry="9" fill="var(--ink)" />
    <ellipse cx="64" cy="40" rx="5" ry="9" fill="var(--ink)" />
    <path d="M28 60 Q50 82 72 60" fill="none" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const Flower = ({ className, color = "var(--pink)", style }: P) => (
  <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
    {[0, 60, 120, 180, 240, 300].map((r) => (
      <ellipse key={r} cx="50" cy="24" rx="15" ry="22" fill={color} stroke="var(--ink)" strokeWidth="4" transform={`rotate(${r} 50 50)`} />
    ))}
    <circle cx="50" cy="50" r="13" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="4" />
  </svg>
);

export const Squiggle = ({ className, color = "var(--ink)", style }: P) => (
  <svg viewBox="0 0 200 40" className={className} style={style} aria-hidden>
    <path d="M5 20 Q 20 0 35 20 T 65 20 T 95 20 T 125 20 T 155 20 T 195 20" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const Blob = ({ className, color = "var(--purple)", style }: P) => (
  <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden>
    <path fill={color} d="M43.6,-58.8C55.6,-50.5,63.5,-36,68.7,-20.3C73.9,-4.6,76.5,12.3,70.4,25.4C64.3,38.5,49.5,47.8,34.6,55.9C19.7,64,4.6,70.9,-12.6,71.9C-29.8,72.9,-49.2,68,-60.5,55.5C-71.8,43,-75.1,22.9,-73.6,4.1C-72.1,-14.7,-65.8,-32.2,-54.1,-40.8C-42.4,-49.4,-25.3,-49.1,-9.7,-52.6C5.9,-56.1,31.6,-67.1,43.6,-58.8Z" transform="translate(100 100)" />
  </svg>
);
