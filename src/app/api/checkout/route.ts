import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProduct } from "@/lib/products";
import { site } from "@/lib/site";

// Creates a Stripe Checkout session. Stripe hosts the payment page, so card
// details never touch this site (keeps you out of PCI scope). Supports cards,
// Apple Pay, Google Pay, Klarna etc. — toggle methods in the Stripe dashboard.
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.json({ error: "Payments aren't set up yet (missing STRIPE_SECRET_KEY)." }, { status: 500 });
  const stripe = new Stripe(key);

  const { items } = (await req.json()) as { items: { slug: string; size: string; qty: number }[] };
  if (!Array.isArray(items) || !items.length) return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });

  // Look prices up on the server — never trust prices sent from the browser.
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let subtotal = 0;
  for (const i of items) {
    const p = getProduct(i.slug);
    const qty = Math.floor(Number(i.qty));
    if (!p || p.soldOut || !p.sizes.includes(i.size) || qty < 1 || qty > 10) {
      return NextResponse.json({ error: "Something in your bag is no longer available." }, { status: 400 });
    }
    subtotal += p.price * qty;
    line_items.push({
      quantity: qty,
      price_data: {
        currency: "gbp",
        unit_amount: p.price,
        product_data: { name: `${p.name} — ${i.size}`, metadata: { slug: p.slug, size: i.size } },
      },
    });
  }

  const free = site.freeShippingOver !== null && subtotal >= site.freeShippingOver;
  const shipping_options = site.shipping.map((s) => ({
    shipping_rate_data: {
      type: "fixed_amount" as const,
      display_name: s.label,
      fixed_amount: { amount: free && s === site.shipping[0] ? 0 : s.amount, currency: "gbp" },
      delivery_estimate: {
        minimum: { unit: "business_day" as const, value: s.minDays },
        maximum: { unit: "business_day" as const, value: s.maxDays },
      },
    },
  }));

  const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    shipping_address_collection: { allowed_countries: [...site.shipToCountries] },
    shipping_options,
    phone_number_collection: { enabled: true },
    allow_promotion_codes: true, // discount codes are created in the Stripe dashboard
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop`,
  });

  return NextResponse.json({ url: session.url });
}
