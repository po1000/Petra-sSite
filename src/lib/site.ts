// ─────────────────────────────────────────────────────────────
//  BUSINESS INFO — every value marked TODO comes from the client.
//  Change it here once and the whole site updates.
// ─────────────────────────────────────────────────────────────
export const site = {
  name: "BRAND NAME", // TODO: client's brand name
  tagline: "clothes for the chronically online & the outside-touching",
  email: "hello@example.co.uk", // TODO
  instagram: "https://instagram.com/", // TODO
  tiktok: "https://tiktok.com/", // TODO

  // UK legal: a business selling online must show these (Companies Act /
  // E-Commerce Regulations). Sole traders show their name + address.
  legal: {
    tradingName: "BRAND NAME LTD", // TODO
    companyNumber: "00000000", // TODO (delete if sole trader)
    registeredAddress: "123 Placeholder Street, London, AB1 2CD", // TODO
    vatNumber: "", // TODO: fill only if VAT registered
  },

  // Shipping shown at Stripe checkout. Prices in pence.
  // TODO: client to confirm carriers, prices and timings.
  shipping: [
    { label: "Royal Mail Tracked 48", amount: 395, minDays: 2, maxDays: 4 },
    { label: "Royal Mail Tracked 24", amount: 595, minDays: 1, maxDays: 2 },
  ],
  freeShippingOver: 7500, // £75 — set to null to turn off. TODO
  shipToCountries: ["GB"] as const, // add "IE", "FR", ... for international

  returnsDays: 14, // UK legal minimum for online sales is 14 days
  announcement: "FREE UK SHIPPING OVER £75 ✶ NEW DROP OUT NOW ✶ MADE IN SMALL BATCHES",
};

export const formatGBP = (pence: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);
