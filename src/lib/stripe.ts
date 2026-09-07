import "server-only";
import Stripe from "stripe";

let cached: Stripe | null = null;

/**
 * Lazily constructs the Stripe client on first use rather than at module
 * load, so pages that don't touch checkout still work when Stripe keys
 * haven't been configured yet (e.g. during local setup).
 */
export function getStripeClient(): Stripe {
  if (cached) return cached;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured. Add it to your environment to enable checkout."
    );
  }

  cached = new Stripe(secretKey, { apiVersion: "2026-08-26.dahlia" });
  return cached;
}
