import { NextResponse } from "next/server";
import { getOrderBySessionId } from "@/lib/queries/orders";
import { formatPrice } from "@/lib/format";

/**
 * Looked up by Stripe Checkout Session id only — a value Stripe hands back
 * solely to the customer who completed that exact session, so this is safe
 * to expose without further auth. Read-only: this route creates nothing:
 * the order either already exists (webhook processed it) or it doesn't yet.
 */
export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required." }, { status: 400 });
  }

  const order = await getOrderBySessionId(sessionId);
  if (!order) {
    return NextResponse.json({ status: "pending" });
  }

  return NextResponse.json({
    status: "confirmed",
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      total: formatPrice(order.total),
      userId: order.userId,
      items: order.items.map((item) => ({
        productName: item.productName,
        variantLabel: item.variantLabel,
        quantity: item.quantity,
        priceAtPurchase: formatPrice(item.priceAtPurchase),
      })),
    },
  });
}
