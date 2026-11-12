import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isAdmin, SITE_COOKIE, siteCookieValue, sitePasswordHash, safeEqual } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const isApi = pathname.startsWith("/api/");

  // Product editor: has its own password (ADMIN_PASSWORD), separate from the site password.
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const open = pathname === "/admin/login" || pathname === "/api/admin/login";
    if (open || (await isAdmin(req.cookies.get(ADMIN_COOKIE)?.value))) return NextResponse.next();
    if (isApi) return NextResponse.json({ error: "Please log in again." }, { status: 401 });
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  // Site password gate.
  const hash = await sitePasswordHash();
  if (!hash || pathname === "/password" || pathname === "/api/site-login") return NextResponse.next();
  const cookie = req.cookies.get(SITE_COOKIE)?.value;
  if (cookie && safeEqual(cookie, await siteCookieValue(hash))) return NextResponse.next();
  if (isApi) return NextResponse.json({ error: "This site is password protected." }, { status: 401 });
  const url = new URL("/password", req.url);
  if (pathname !== "/") url.searchParams.set("next", pathname + search);
  return NextResponse.redirect(url);
}

export const config = {
  // Skip static files, product photos, logos/icons and Stripe's webhook.
  matcher: ["/((?!_next/static|_next/image|media/|api/webhooks|icon|apple-icon|logo|favicon|robots.txt).*)"],
};
