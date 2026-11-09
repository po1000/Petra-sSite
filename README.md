# UK clothing shop — starter

A playful, animated online shop built with **Next.js + Tailwind + Framer Motion**, taking payments with **Stripe Checkout** in **GBP**.

## What's in it
- Loading screen (pink, counts up to 100%, wipes away). Shows once per visit. → `src/components/Loader.tsx`
- Page transitions (yellow panel sweep + content pop-in). → `src/app/template.tsx`
- Quirky SVG stickers (starburst, smiley, flower, blob, squiggle), scrolling marquees, wiggly links, wobbly cards. → `src/components/Stickers.tsx`, `Marquee.tsx`
- Shop grid, product pages with size picker, slide-out bag. The bag is saved in the browser.
- Stripe Checkout: cards, Apple Pay, Google Pay (and Klarna if switched on). UK address, delivery options, free-delivery threshold, discount codes.
- UK basics: £ prices, 14-day returns wording, cookie banner, company details in the footer, placeholder Terms/Privacy pages.
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
| Fonts | `src/app/layout.tsx` |
| Homepage copy | `src/app/page.tsx` |
| Shipping / returns / terms / privacy text | `src/app/info/[slug]/page.tsx` |

Search the code for `TODO` to find every placeholder.

## Going live checklist
1. Client creates a **Stripe account** (UK business) and finishes verification. Turn on Apple Pay, Google Pay and Klarna in the dashboard.
2. Deploy to **Vercel**: import the repo and add `STRIPE_SECRET_KEY` (live key) and `NEXT_PUBLIC_SITE_URL`.
3. In Stripe → Developers → Webhooks, add `https://YOURDOMAIN/api/webhooks/stripe` (event `checkout.session.completed`) and put its signing secret in `STRIPE_WEBHOOK_SECRET`.
4. Turn on customer email receipts in Stripe settings. Orders, including the delivery address, appear in the Stripe dashboard → Payments.
5. Real legal text: terms, privacy notice (UK GDPR), returns. Register with the ICO if needed.
6. Connect the domain in Vercel.
