import { NextResponse } from "next/server";
import { sha256, SITE_COOKIE, siteCookieValue, sitePasswordHash, safeEqual } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  const hash = await sitePasswordHash();
  if (!hash) return NextResponse.json({ ok: true });
  if (!password || !safeEqual(await sha256(password), hash)) {
    return NextResponse.json({ error: "wrong password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SITE_COOKIE, await siteCookieValue(hash), {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
