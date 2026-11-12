import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, safeEqual, sha256 } from "@/lib/auth";

export async function POST(req: Request) {
  const token = await adminToken();
  if (!token) return NextResponse.json({ error: "ADMIN_PASSWORD hasn't been set in Cloudflare yet." }, { status: 503 });
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!password || !safeEqual(await sha256(`${password}:admin-v1`), token)) {
    return NextResponse.json({ error: "wrong password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
