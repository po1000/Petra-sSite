// Secrets set in the Cloudflare dashboard (Worker → Settings → Variables and secrets).
interface CloudflareEnv {
  ADMIN_PASSWORD?: string; // password for /admin (the product editor)
  SITE_PASSWORD?: string; // optional: overrides SITE_PASSWORD_HASH in wrangler.jsonc
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}
