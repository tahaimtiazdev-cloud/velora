"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getCartOwner } from "@/lib/cart/owner";
import { getCartView } from "@/lib/queries/cart";
import { computeOrderTotals } from "@/lib/checkout/pricing";
import { shippingAddressSchema } from "@/lib/validations/checkout";
import { getStripeClient } from "@/lib/stripe";
import { siteConfig } from "@/lib/site-config";
import type { CheckoutItemSnapshot } from "@/lib/checkout/snapshot";

export interface CheckoutActionResult {
  success: false;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function flattenFieldErrors(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

/**
 * Validates the shipping address, re-derives the cart and its totals
 * entirely server-side (never trusting anything the client sends for
 * price/quantity), snapshots that into a PendingCheckout row, and hands
 * off to Stripe Checkout. The Order itself is only ever created later by
 * the webhook once Stripe confirms payment — reaching this function's
 * redirect proves nothing about payment succeeding.
 */
export async function createCheckoutSession(
  input: Record<string, string>
): Promise<CheckoutActionResult> {
  const parsed = shippingAddressSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: flattenFieldErrors(parsed.error) };
  }

  const owner = await getCartOwner();
  if (!owner) {
    return { success: false, error: "Your cart is empty." };
  }

  const cart = await getCartView();
  if (cart.items.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  const hasIssue = cart.items.some((item) => !item.isAvailable || item.quantity > item.maxQuantity);
  if (hasIssue) {
    return {
      success: false,
      error: "Some items in your cart are no longer available or have limited stock. Please review your cart before checking out.",
    };
  }

  const totals = computeOrderTotals(cart.subtotal);
  const session = await auth();

  const itemsSnapshot: CheckoutItemSnapshot[] = cart.items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    productName: item.productName,
    variantLabel: item.variantLabel,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }));

  const pendingCheckout = await db.pendingCheckout.create({
    data: {
      cartId: cart.cartId!,
      userId: session?.user?.id ?? null,
      customerEmail: parsed.data.customerEmail,
      customerName: parsed.data.customerName,
      shippingAddressLine1: parsed.data.addressLine1,
      shippingAddressLine2: parsed.data.addressLine2 || null,
      shippingCity: parsed.data.city,
      shippingState: parsed.data.state,
      shippingPostalCode: parsed.data.postalCode,
      shippingCountry: parsed.data.country,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      tax: totals.tax,
      total: totals.total,
      items: itemsSnapshot,
    },
  });

  const lineItems = itemsSnapshot.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.variantLabel ? `${item.productName} (${item.variantLabel})` : item.productName,
      },
      unit_amount: Math.round(item.unitPrice * 100),
    },
    quantity: item.quantity,
  }));

  if (totals.shipping > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Shipping" },
        unit_amount: Math.round(totals.shipping * 100),
      },
      quantity: 1,
    });
  }

  if (totals.tax > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Estimated Tax" },
        unit_amount: Math.round(totals.tax * 100),
      },
      quantity: 1,
    });
  }

  let checkoutUrl: string;
  try {
    const stripe = getStripeClient();
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: parsed.data.customerEmail,
      success_url: `${siteConfig.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteConfig.url}/checkout`,
      metadata: { pendingCheckoutId: pendingCheckout.id },
    });

    if (!stripeSession.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }
    checkoutUrl = stripeSession.url;
  } catch (error) {
    console.error("Failed to create Stripe checkout session:", error);
    await db.pendingCheckout.delete({ where: { id: pendingCheckout.id } }).catch(() => {});
    return {
      success: false,
      error: "We couldn't start checkout right now. Please try again in a moment.",
    };
  }

  redirect(checkoutUrl);
}
