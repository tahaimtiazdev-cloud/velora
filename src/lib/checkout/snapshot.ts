import { z } from "zod";

/**
 * Shape of PendingCheckout.items. Captured once, at the moment the Stripe
 * Checkout Session is created, and re-read verbatim by the webhook — the
 * unitPrice here is what Stripe actually charges, so it (not some later
 * re-fetched "current" price) is what becomes OrderItem.priceAtPurchase.
 */
export const checkoutItemSnapshotSchema = z.object({
  productId: z.string(),
  variantId: z.string().nullable(),
  productName: z.string(),
  variantLabel: z.string().nullable(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
});

export const checkoutItemsSnapshotSchema = z.array(checkoutItemSnapshotSchema).min(1);

export type CheckoutItemSnapshot = z.infer<typeof checkoutItemSnapshotSchema>;
