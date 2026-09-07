"use client";

import { useEffect, useState } from "react";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { ClearCartButton } from "@/components/cart/ClearCartButton";
import { EmptyState } from "@/components/shop/EmptyState";
import { Button } from "@/components/ui/Button";
import { CART_UPDATED_EVENT } from "@/lib/cart/events";
import type { CartView } from "@/lib/queries/cart";

/**
 * Owns live cart state client-side, refetching from /api/cart whenever any
 * component dispatches CART_UPDATED_EVENT. This sidesteps relying on
 * Next.js layout/router-cache revalidation timing for a piece of UI that
 * needs to update immediately and reliably after every mutation.
 */
export function CartClient({ initialCart }: { initialCart: CartView }) {
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    let cancelled = false;

    async function refetch() {
      try {
        const res = await fetch("/api/cart");
        if (res.ok && !cancelled) {
          setCart(await res.json());
        }
      } catch {
        // Keep showing the last known-good state; the user can retry the
        // mutation that triggered this if it silently failed to refresh.
      }
    }

    window.addEventListener(CART_UPDATED_EVENT, refetch);
    return () => {
      cancelled = true;
      window.removeEventListener(CART_UPDATED_EVENT, refetch);
    };
  }, []);

  if (cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Looks like you haven't added anything yet. Explore the collection and find something you'll actually wear."
        actionLabel="Shop Now"
        actionHref="/shop"
      />
    );
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <ClearCartButton />
      </div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <ul aria-label="Cart items">
          {cart.items.map((item) => (
            <CartLineItem key={item.id} item={item} />
          ))}
        </ul>

        <div className="space-y-6">
          <CartSummary subtotal={cart.subtotal} itemCount={cart.itemCount} />
          <Button href="/shop" variant="secondary" className="w-full">
            Continue Shopping
          </Button>
        </div>
      </div>
    </>
  );
}
