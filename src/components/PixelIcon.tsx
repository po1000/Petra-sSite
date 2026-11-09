// Little pixel-art "desktop icons" for the navigation. Each letter is one
// pixel; colours are in `palette`. Swap these for the client's own icons
// later (e.g. low-res 3D renders as PNGs) — just change the nav in Nav.tsx.
const palette: Record<string, string> = {
  D: "#6f7889", M: "#aab3c2", L: "#d6dde8", W: "#ffffff",
  b: "#a7d6ff", B: "#4b9df5", N: "#2a63c8",
  p: "#ff9fd0", y: "#ffd75e", g: "#86d96c", r: "#ff6b6b",
};

const icons = {
  cart: [
    "DD..................",
    ".D..................",
    ".DMMMMMMMMMMMMMMMMD.",
    ".DLWLWLWLWLWLWLWLMD.",
    "..DMLMLMLMLMLMLMLD..",
    "..DLWLWLWLWLWLWLMD..",
    "...DMLMLMLMLMLMLD...",
    "...DLWLWLWLWLWLMD...",
    "....DMMMMMMMMMMD....",
    "....D...............",
    "....DMMMMMMMMMMMD...",
    ".....D.........D....",
    "....bBN.......bBN...",
    "....BNN.......BNN...",
  ],
  camera: [
    ".......DDDDDDDDDD.....",
    "......DMMMMMMMMMMD....",
    "..DDDDDLLLLLLLLLLMD...",
    ".DbbbbDLWWLLLLLLLMDDD.",
    "DbWbbBDLWLLLLLLLLMDpD.",
    "DbbbBNDLLLLLLLLLLMDyD.",
    "DbbBBNDLLLLLLLLLLMDgD.",
    ".DNNNDDMMMMMMMMMMMDDD.",
    "..DDDDDDDDMMMMMMMD....",
    ".........DMMMMMMD.....",
    ".........DDDDDDDD.....",
  ],
  papers: [
    "....DDDDDDDDD...",
    "...DLWWWWWWWLD..",
    "...DWMMMMMMMWD..",
    ".DDDDDDDDDDLWD..",
    "DLWWWWWWWWLDWD..",
    "DWMMMMMMMMWDWD..",
    "DWWWWWWWWWWDWD..",
    "DWMMMMMMWWWDMD..",
    "DWWWWWWWWWWDD...",
    "DWMMMMMMMMWD....",
    "DWWWWWWWWWWD....",
    "DWMMMMMWWWWD....",
    "DLWWWWWWWWLD....",
    ".DDDDDDDDDD.....",
  ],
};

export type IconName = keyof typeof icons;

export default function PixelIcon({ name, className }: { name: IconName; className?: string }) {
  const rows = icons[name];
  const w = Math.max(...rows.map((r) => r.length));
  const rects: React.ReactNode[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      let run = 1;
      while (row[x + run] === c) run++;
      if (palette[c]) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={palette[c]} />);
      x += run;
    }
  });
  return (
    <svg viewBox={`0 0 ${w} ${rows.length}`} className={`pix ${className ?? ""}`} shapeRendering="crispEdges" aria-hidden>
      {rects}
    </svg>
  );
}
