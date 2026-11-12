import { NextResponse } from "next/server";
import { denyUnlessAdmin } from "@/lib/admin-guard";
import type { Product } from "@/lib/catalog-types";
import { deleteProduct, getProductById, saveProduct } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;
  const p = await getProductById((await params).id);
  return p ? NextResponse.json({ product: p }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(req: Request, { params }: Ctx) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;
  const body = (await req.json().catch(() => null)) as { product?: Partial<Product> } | null;
  if (!body?.product) return NextResponse.json({ error: "Nothing to save" }, { status: 400 });
  const p = await saveProduct((await params).id, body.product);
  return p ? NextResponse.json({ product: p }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;
  return (await deleteProduct((await params).id)) ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
