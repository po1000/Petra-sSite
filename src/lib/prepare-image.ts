// Shrinks photos in the browser before upload so pages load fast and
// storage stays small. Keeps transparency (e.g. PNG cut-outs and icons).
function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

export async function prepareImage(file: File, maxSize: number): Promise<Blob> {
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let out = await toBlob(canvas, "image/webp", 0.86);
  // Older Safari can't make WebP: fall back to PNG (keeps transparency) or JPEG.
  if (!out || out.type !== "image/webp") out = await toBlob(canvas, file.type === "image/png" ? "image/png" : "image/jpeg", 0.88);
  if (!out) return file;
  // If the original was already small enough, keep whichever is smaller.
  return scale === 1 && file.size < out.size && /^image\/(jpeg|png|webp)$/.test(file.type) ? file : out;
}
