# UK clothing shop — starter

A playful, animated online shop built with **Next.js + Tailwind + Framer Motion**, taking payments with **Stripe Checkout** in **GBP**.

## What's in it
- **Look:** white and airy Y2K style: glossy "aqua" pill buttons, pastel glows, frosted glass panels, big tight lowercase headings (Inter Tight).
- **Bubble cursor:** a glossy 3D bubble with a see-through trailing bubble. It grows over links and squishes on click, and only runs on mouse/trackpad devices. → `src/components/Cursor.tsx`
- **Loading screen:** a wobbling bubble and a glossy progress bar, then a blur-away. Shows once per visit. → `src/components/Loader.tsx`
- **Page transitions:** pages drift in out of a soft blur. → `src/app/template.tsx`
- **Home:** a dreamy animated sky with rising soap bubbles, with pixel-art desktop icons as navigation. Set `heroVideo` in `site.ts` to use a video instead. → `src/components/DreamScene.tsx`
- **Navigation:** pixel icons in a left sidebar on desktop and a floating glass dock on phones. → `src/components/PixelIcon.tsx`, `Nav.tsx`
- **Colour dots** (top right) switch the accent colour between blue, pink and yellow.
- **Store:** coloured collection filter pills, sorting, and "PRE ORDER" / "NEW" / "SOLD OUT" stamps.
- **Product page:** photo dots, size picker, and sparkle accordions (description, shipping + care, size chart, returns).
- **Bag:** free-shipping progress bar, "you may also like", and Stripe checkout.
- **Archive:** lookbook grid with file-name tags, filterable. → `src/lib/archive.ts`
- **Payments:** Stripe Checkout (cards, Apple Pay, Google Pay, Klarna, PayPal…), UK addresses, delivery options, discount codes.
- **UK basics:** £ prices, 14-day returns wording, cookie banner, company details in the footer, placeholder Terms/Privacy pages.
- Respects "reduce motion" settings.

## Product editor (CMS): /admin
Go to **yoursite/admin** to add and edit products at any time. Changes go live as soon as you press **save** (or Ctrl/Cmd+S).
- Title, price, web address, collection, "PRE ORDER"/"NEW"/"LOW STOCK" stamp, visible/hidden, sold out, sizes, description and care text.
- **Colours:** each colour has a name, an icon (upload any image, e.g. a brown circle or a brown blob, or just pick a dot colour) and its own photos.
- **Photos:** any shape. On the store grid they're cropped to the same size; on the product page they show in full. Photos are shrunk in the browser before upload so the site stays fast.
- The product page carousel shows every colour's photos, grouped by colour. Picking a colour jumps to its first photo, and swiping to another colour's photos selects that colour.
- Use the ↑ ↓ arrows on the product list to change the order on the store page.

**Setup (one time):** in Cloudflare → your Worker → Settings → Variables and secrets, add a **Secret** called `ADMIN_PASSWORD` with the password you want for /admin.

Products are stored in a Cloudflare **D1** database (`DB`) and photos in Cloudflare **KV** (`MEDIA`). Both are free and are created automatically on the first deploy. If the build log says it couldn't create them, add them by hand under Worker → Settings → Bindings: a D1 database bound as `DB` and a KV namespace bound as `MEDIA`.

The first time the database is used, the 6 demo products are added. Edit or delete them in /admin.

## Site password
The whole shop is behind a password page (not /admin, which has its own). The password is stored as a hash in `wrangler.jsonc` (`SITE_PASSWORD_HASH`).
- **Change it:** add a Secret called `SITE_PASSWORD` in Cloudflare with the new password. It overrides the hash.
- **Open the site to the public:** delete the `SITE_PASSWORD_HASH` line from `wrangler.jsonc` and push, and remove any `SITE_PASSWORD` secret.

## Run it
```bash
npm install
cp .env.example .dev.vars    # paste your Stripe TEST key, and add ADMIN_PASSWORD=something
npm run preview              # http://localhost:8787 (runs like Cloudflare, with a local database)
```
Test card: `4242 4242 4242 4242`, any future date, any CVC.

## Where to change things
| What | File |
|---|---|
| Brand name, email, socials, company number, address, VAT | `src/lib/site.ts` |
| Delivery prices / free-delivery threshold / countries | `src/lib/site.ts` |
| Products, prices, colours, photos | **/admin** on the live site |
| Colours | top of `src/app/globals.css` |
| Nav icons | `src/components/PixelIcon.tsx` (pixel maps) / `Nav.tsx` |
| Lookbook photos | `src/lib/archive.ts` + `public/archive/` |
| Collections (filter pills) | top of `src/lib/catalog-types.ts` |
| Fonts | `src/app/layout.tsx` |
| Homepage copy / video | `src/app/page.tsx`, `heroVideo` in `src/lib/site.ts` |
| Shipping / returns / terms / privacy text | `src/app/info/[slug]/page.tsx` |

Search the code for `TODO` to find every placeholder.

## Hosting: Cloudflare (free)
The site runs on **Cloudflare Workers**. The free plan is enough for a small shop and allows commercial use. (Vercel's free plan does not allow commercial use.)

**One-time setup (about 10 minutes):**
1. Create a free account at dash.cloudflare.com.
2. Go to **Workers & Pages → Create → Import a repository** and pick this GitHub repo.
3. Build command: `npx opennextjs-cloudflare build`. Deploy command: `npx opennextjs-cloudflare deploy`.
4. Under the Worker's **Settings → Variables and secrets**, add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (both as *Secret*) and `NEXT_PUBLIC_SITE_URL`.

After that, **every push to `main` redeploys the site automatically**.

To try the Cloudflare version on your own computer: put the keys in `.dev.vars` (same format as `.env.local`) and run `npm run preview`.

## Domain
Buy it from **Cloudflare Registrar** (Domain Registration → Register). It sells at cost with free privacy, and it links to the site in a couple of clicks: Worker → Settings → Domains & Routes → Add custom domain.
Free extra: **Email Routing** forwards hello@yourdomain to any Gmail or Outlook inbox.

## Payments: Stripe
There's no monthly fee; Stripe charges per sale. In Stripe Dashboard → **Settings → Payment methods**, switch on: Cards, Apple Pay, Google Pay, Klarna, PayPal, Revolut Pay and Link. The site needs no code changes, because Checkout shows whatever is switched on.

## Going live checklist
1. Client creates a **Stripe account** (UK business) and finishes verification.
2. Connect the repo to Cloudflare (above) and add the **live** Stripe key.
3. In Stripe → Developers → Webhooks, add `https://YOURDOMAIN/api/webhooks/stripe` (event `checkout.session.completed`) and save its signing secret as `STRIPE_WEBHOOK_SECRET`.
4. Turn on customer email receipts in Stripe settings. Orders, including the delivery address, show in Stripe → Payments.
5. Real legal text: terms, privacy notice (UK GDPR) and returns. Register with the ICO if required.
6. Buy and connect the domain.
