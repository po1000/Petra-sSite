import { NextResponse } from "next/server";
import { denyUnlessAdmin } from "@/lib/admin-guard";
import { cfEnv } from "@/lib/db";

const types: Record<string, string> = {
  "image/webp": "webp", "image/png": "png", "image/jpeg": "jpg", "image/gif": "gif", "image/svg+xml": "svg",
};
const MAX = 15 * 1024 * 1024;

// Stores one image (sent as the raw request body) and returns its key.
export async function POST(req: Request) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;
  const type = (req.headers.get("content-type") ?? "").split(";")[0].trim();
  const ext = types[type];
  if (!ext) return NextResponse.json({ error: "Please upload a JPG, PNG, WebP, GIF or SVG image." }, { status: 415 });
  const body = await req.arrayBuffer();
  if (!body.byteLength) return NextResponse.json({ error: "Empty file" }, { status: 400 });
  if (body.byteLength > MAX) return NextResponse.json({ error: "That image is too big (max 15MB)." }, { status: 413 });
  const key = `${crypto.randomUUID()}.${ext}`;
  const { MEDIA } = await cfEnv();
  await MEDIA.put(key, body, { metadata: { type } });
  return NextResponse.json({ key });
}
