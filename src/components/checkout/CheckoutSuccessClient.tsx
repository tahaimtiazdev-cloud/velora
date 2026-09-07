"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface OrderPayload {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: string;
  userId: string | null;
  items: { productName: string; variantLabel: string | null; quantity: number; priceAtPurchase: string }[];
}

const POLL_INTERVAL_MS = 1500;
const MAX_ATTEMPTS = 10;

export function CheckoutSuccessClient({ sessionId, isSignedIn }: { sessionId: string; isSignedIn: boolean }) {
  const [order, setOrder] = useState<OrderPayload | null>(null);
  const [attempts, setAttempts] = useState(0);
  const failed = !order && attempts >= MAX_ATTEMPTS;

  useEffect(() => {
    if (order || attempts >= MAX_ATTEMPTS) return;
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/orders/by-session?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.status === "confirmed") {
          setOrder(data.order);
        } else {
          setAttempts((n) => n + 1);
        }
      } catch {
        if (!cancelled) setAttempts((n) => n + 1);
      }
    }, attempts === 0 ? 0 : POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [attempts, order, sessionId]);

  if (order) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Order Confirmed</p>
        <h1 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">Thank you, {order.customerName}.</h1>
        <p className="mt-3 text-sm text-muted">
          Your order <strong className="text-ink">{order.orderNumber}</strong> is confirmed. A receipt
          has been sent to {order.customerEmail}.
        </p>

        <ul className="mt-8 space-y-2 border-y border-line py-6 text-left text-sm">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between gap-3">
              <span className="text-muted">
                {item.productName}
                {item.variantLabel ? ` — ${item.variantLabel}` : ""} &times; {item.quantity}
              </span>
              <span className="text-ink">{item.priceAtPurchase}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between text-sm font-medium">
          <span className="text-ink">Total</span>
          <span className="text-ink">{order.total}</span>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/shop" variant="secondary">
            Continue Shopping
          </Button>
          {isSignedIn && order.userId ? (
            <Button href={`/account/orders/${order.id}`}>View Order</Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl text-center">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Payment Received</p>
      <h1 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">Finalizing your order…</h1>
      {failed ? (
        <p className="mt-4 text-sm text-muted">
          Your payment went through. We&apos;re still finalizing your order confirmation — it&apos;ll
          appear in {isSignedIn ? "your order history" : "your inbox"} shortly.
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted">This usually takes just a few seconds.</p>
      )}
      <div className="mt-8">
        <Link href="/shop" className="focus-ring text-sm text-ink underline underline-offset-4">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
