import { cfEnv } from "@/lib/db";
import { MEDIA_KEY } from "@/lib/catalog-types";

// Serves uploaded product photos and colour icons from Cloudflare KV.
export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!MEDIA_KEY.test(key)) return new Response("Not found", { status: 404 });
  const { MEDIA } = await cfEnv();
  const { value, metadata } = await MEDIA.getWithMetadata<{ type?: string }>(key, "arrayBuffer");
  if (!value) return new Response("Not found", { status: 404 });
  return new Response(value, {
    headers: {
      "Content-Type": metadata?.type ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    },
  });
}
