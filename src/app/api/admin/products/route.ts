import { NextResponse } from "next/server";
import { denyUnlessAdmin } from "@/lib/admin-guard";
import { createProduct, listProducts } from "@/lib/db";

export async function GET() {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;
  return NextResponse.json({ products: await listProducts({ includeHidden: true }) });
}

export async function POST() {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;
  return NextResponse.json({ product: await createProduct() });
}
