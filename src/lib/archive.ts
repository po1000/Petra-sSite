// ARCHIVE / LOOKBOOK — campaign and behind-the-scenes photos.
// Put photos in /public/archive/ and set `src: "/archive/photo.jpg"`.
// Until then, soft gradient placeholders are shown.
export const archiveTags = [
  { id: "all", label: "all", tone: "" },
  { id: "drop-01", label: "drop 01", tone: "gloss-pink" },
  { id: "studio", label: "studio", tone: "gloss-yellow" },
  { id: "outside", label: "outside", tone: "gloss-green" },
] as const;

export type ArchiveItem = { file: string; tag: Exclude<(typeof archiveTags)[number]["id"], "all">; src?: string };

export const archive: ArchiveItem[] = [
  { file: "drop01_look1.jpg", tag: "drop-01" },
  { file: "drop01_look2.jpg", tag: "drop-01" },
  { file: "studio_01.jpg", tag: "studio" },
  { file: "studio_02.jpg", tag: "studio" },
  { file: "outside_park.jpg", tag: "outside" },
  { file: "drop01_look3.jpg", tag: "drop-01" },
  { file: "outside_bus.jpg", tag: "outside" },
  { file: "studio_03.jpg", tag: "studio" },
];
