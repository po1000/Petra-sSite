// Password checks shared by the middleware and API routes (no Node-only APIs).

export const SITE_COOKIE = "site_pass";
export const ADMIN_COOKIE = "admin_session";

export async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Hash of the site password, or "" when the site is open to everyone. */
export async function sitePasswordHash() {
  if (process.env.SITE_PASSWORD) return sha256(process.env.SITE_PASSWORD);
  return (process.env.SITE_PASSWORD_HASH ?? "").trim().toLowerCase();
}

export const siteCookieValue = (hash: string) => sha256(`${hash}:site-ok`);

export async function adminToken() {
  const pw = process.env.ADMIN_PASSWORD;
  return pw ? sha256(`${pw}:admin-v1`) : null;
}

export async function isAdmin(cookie?: string) {
  const token = await adminToken();
  return !!token && !!cookie && safeEqual(cookie, token);
}

export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
