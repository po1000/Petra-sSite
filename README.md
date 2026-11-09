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

## Run it
```bash
npm install
cp .env.example .env.local   # then paste your Stripe TEST keys in
npm run dev                  # http://localhost:3000
```
Test card: `4242 4242 4242 4242`, any future date, any CVC.

## Where to change things
| What | File |
|---|---|
| Brand name, email, socials, company number, address, VAT | `src/lib/site.ts` |
| Delivery prices / free-delivery threshold / countries | `src/lib/site.ts` |
| Products, prices (in pence), sizes, photos | `src/lib/products.ts` (photos go in `public/products/`) |
| Colours | top of `src/app/globals.css` |
| Nav icons | `src/components/PixelIcon.tsx` (pixel maps) / `Nav.tsx` |
| Lookbook photos | `src/lib/archive.ts` + `public/archive/` |
| Collections (filter pills) | top of `src/lib/products.ts` |
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
