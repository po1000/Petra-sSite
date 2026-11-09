import { NextResponse } from "next/server";
import Stripe from "stripe";

// Stripe calls this after a successful payment. Right now it just logs the
// order — the client sees every order (with address) in the Stripe dashboard
// anyway. Later you could send it to email, Google Sheets, or a fulfilment app.
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });

  const stripe = new Stripe(key, { httpClient: Stripe.createFetchHttpClient() });
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      await req.text(),
      req.headers.get("stripe-signature") ?? "",
      secret,
      undefined,
      Stripe.createSubtleCryptoProvider()
    );
  } catch {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    console.log("✅ New order", s.id, s.customer_details?.email, s.amount_total);
    // TODO: notify the client / push to fulfilment here.
  }
  return NextResponse.json({ received: true });
}
