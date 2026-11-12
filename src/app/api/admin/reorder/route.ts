import { NextResponse } from "next/server";
import { denyUnlessAdmin } from "@/lib/admin-guard";
import { reorderProducts } from "@/lib/db";

export async function POST(req: Request) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;
  const { ids } = (await req.json().catch(() => ({}))) as { ids?: string[] };
  if (!Array.isArray(ids)) return NextResponse.json({ error: "Missing ids" }, { status: 400 });
  await reorderProducts(ids);
  return NextResponse.json({ ok: true });
}
