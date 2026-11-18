// Secrets set in the Cloudflare dashboard (Worker → Settings → Variables and secrets).
interface CloudflareEnv {
  ADMIN_PASSWORD?: string; // password for /admin (the product editor)
  SITE_PASSWORD?: string; // site password gate (leave unset to open the shop to everyone)
  SITE_PASSWORD_HASH?: string; // older setting, still accepted
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}
