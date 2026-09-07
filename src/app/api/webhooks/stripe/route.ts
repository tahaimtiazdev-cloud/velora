import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";
import { checkoutItemsSnapshotSchema } from "@/lib/checkout/snapshot";
import { generateOrderNumber } from "@/lib/checkout/order-number";
import { sendOrderConfirmationEmail } from "@/lib/email/order-confirmation";

type FulfillResult = "created" | "already-processed" | "pending-not-found";

/**
 * The only place an Order is ever created from a checkout. Reaching the
 * success page proves nothing on its own — this handler trusts only a
 * signature-verified event from Stripe's servers.
 */
async function fulfillCheckoutSession(session: Stripe.Checkout.Session): Promise<FulfillResult> {
  const pendingCheckoutId = session.metadata?.pendingCheckoutId;
  if (!pendingCheckoutId) {
    console.error("Stripe session missing pendingCheckoutId metadata:", session.id);
    return "pending-not-found";
  }

  return db.$transaction(async (tx) => {
    const existingOrder = await tx.order.findUnique({ where: { paymentReference: session.id } });
    if (existingOrder) return "already-processed";

    const pending = await tx.pendingCheckout.findUnique({ where: { id: pendingCheckoutId } });
    if (!pending) return "pending-not-found";

    const items = checkoutItemsSnapshotSchema.parse(pending.items);

    for (const item of items) {
      // Guarded decrement: only applies if enough stock still exists, so
      // stock can never go negative. Payment already succeeded by this
      // point, so a shortfall doesn't block order creation — it's logged
      // for manual fulfillment follow-up instead.
      const result = item.variantId
        ? await tx.productVariant.updateMany({
            where: { id: item.variantId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          })
        : await tx.product.updateMany({
            where: { id: item.productId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });

      if (result.count === 0) {
        console.warn(
          `Stripe webhook: insufficient stock to decrement for ${item.variantId ? "variant" : "product"} ` +
            `${item.variantId ?? item.productId} (needed ${item.quantity}) on session ${session.id}. ` +
            `Order will still be created since payment succeeded — flag for manual fulfillment review.`
        );
      }
    }

    await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        status: "PAID",
        paymentStatus: "PAID",
        subtotal: pending.subtotal,
        shipping: pending.shipping,
        tax: pending.tax,
        total: pending.total,
        paymentReference: session.id,
        customerEmail: pending.customerEmail,
        customerName: pending.customerName,
        shippingAddressLine1: pending.shippingAddressLine1,
        shippingAddressLine2: pending.shippingAddressLine2,
        shippingCity: pending.shippingCity,
        shippingState: pending.shippingState,
        shippingPostalCode: pending.shippingPostalCode,
        shippingCountry: pending.shippingCountry,
        userId: pending.userId,
        items: {
          create: items.map((item) => ({
            quantity: item.quantity,
            priceAtPurchase: item.unitPrice,
            productName: item.productName,
            variantLabel: item.variantLabel,
            productId: item.productId,
            variantId: item.variantId,
          })),
        },
      },
    });

    await tx.cartItem.deleteMany({ where: { cartId: pending.cartId } });
    await tx.pendingCheckout.delete({ where: { id: pending.id } });

    return "created";
  });
}

export async function POST(request: Request): Promise<Response> {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("Stripe webhook received without a signature or configured secret.");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status !== "paid") {
        return NextResponse.json({ received: true });
      }

      const result = await fulfillCheckoutSession(session);

      if (result === "pending-not-found") {
        console.error("Webhook could not find a matching PendingCheckout for session:", session.id);
      }

      if (result === "created") {
        const order = await db.order.findUnique({
          where: { paymentReference: session.id },
          include: { items: true },
        });
        if (order) {
          await sendOrderConfirmationEmail({
            customerEmail: order.customerEmail,
            customerName: order.customerName,
            orderNumber: order.orderNumber,
            total: Number(order.total),
            items: order.items.map((item) => ({
              productName: item.productName,
              variantLabel: item.variantLabel,
              quantity: item.quantity,
              priceAtPurchase: Number(item.priceAtPurchase),
            })),
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }
}
