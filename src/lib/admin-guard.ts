import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdmin } from "./auth";

/** Second check (the middleware checks first) that the caller is logged in to /admin. */
export async function denyUnlessAdmin() {
  const ok = await isAdmin((await cookies()).get(ADMIN_COOKIE)?.value);
  return ok ? null : NextResponse.json({ error: "Please log in again." }, { status: 401 });
}
