"use client";

import { useState, useTransition } from "react";
import { clearCart } from "@/lib/actions/cart";
import { notifyCartUpdated } from "@/lib/cart/events";

export function ClearCartButton() {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-3 text-xs">
        <span className="text-muted">Clear entire cart?</span>
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await clearCart();
              setConfirming(false);
              notifyCartUpdated();
            })
          }
          className="focus-ring font-medium uppercase tracking-wide text-sale underline disabled:opacity-50"
        >
          {isPending ? "Clearing…" : "Yes, clear"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="focus-ring font-medium uppercase tracking-wide text-muted underline"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="focus-ring text-xs font-medium uppercase tracking-wide text-muted underline hover:text-ink"
    >
      Clear cart
    </button>
  );
}
