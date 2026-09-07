/**
 * Flat, deterministic shipping/tax rules computed server-side. There's no
 * real carrier-rate or tax-jurisdiction integration here — this is a
 * portfolio-scope stand-in, but the key property (never trust a client-
 * supplied total) holds: every value here is derived from the server-known
 * subtotal, never from anything the browser sends.
 */
const FLAT_SHIPPING_RATE = 8;
const FREE_SHIPPING_THRESHOLD = 150;
const TAX_RATE = 0.08;

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function computeOrderTotals(subtotal: number): OrderTotals {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING_RATE;
  const tax = round2(subtotal * TAX_RATE);
  const total = round2(subtotal + shipping + tax);
  return { subtotal: round2(subtotal), shipping: round2(shipping), tax, total };
}
