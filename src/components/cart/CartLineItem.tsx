"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { GarmentIllustration } from "@/components/ui/GarmentIllustration";
import { formatPrice } from "@/lib/format";
import { removeCartItem, updateCartItemQuantity } from "@/lib/actions/cart";
import { notifyCartUpdated } from "@/lib/cart/events";
import type { CartLineView } from "@/lib/queries/cart";

export function CartLineItem({ item }: { item: CartLineView }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"update" | "remove" | null>(null);

  function handleQuantityChange(next: number) {
    setError(null);
    setPendingAction("update");
    startTransition(async () => {
      const result = await updateCartItemQuantity({ cartItemId: item.id, quantity: next });
      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
      }
      notifyCartUpdated();
    });
  }

  function handleRemove() {
    setError(null);
    setPendingAction("remove");
    startTransition(async () => {
      const result = await removeCartItem({ cartItemId: item.id });
      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
      }
      notifyCartUpdated();
    });
  }

  return (
    <li className="flex gap-4 border-b border-line py-6 first:pt-0 last:border-b-0 sm:gap-6">
      <Link
        href={`/products/${item.productSlug}`}
        className="focus-ring relative h-24 w-20 shrink-0 overflow-hidden border border-line bg-surface sm:h-32 sm:w-28"
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.imageAlt ?? item.productName}
            fill
            sizes="120px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink/50">
            <GarmentIllustration variant="top" className="h-1/2 w-1/2" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-3 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${item.productSlug}`}
              className="focus-ring line-clamp-2 text-sm font-medium text-ink hover:underline"
            >
              {item.productName}
            </Link>
            {item.variantLabel ? (
              <p className="mt-1 text-xs text-muted">{item.variantLabel}</p>
            ) : null}
            <p className="mt-1 text-sm text-ink sm:hidden">{formatPrice(item.unitPrice)}</p>
          </div>
          <p className="hidden shrink-0 text-sm text-ink sm:block">{formatPrice(item.unitPrice)}</p>
        </div>

        {item.warning ? (
          <p role="status" className="text-xs font-medium text-sale">
            {item.warning}
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <QuantitySelector
            quantity={item.quantity}
            max={Math.max(1, item.maxQuantity)}
            onChange={handleQuantityChange}
            disabled={isPending || !item.isAvailable}
          />
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-ink">{formatPrice(item.lineTotal)}</span>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isPending}
              className="focus-ring text-xs font-medium uppercase tracking-wide text-muted underline hover:text-ink disabled:opacity-50"
            >
              {isPending && pendingAction === "remove" ? "Removing…" : "Remove"}
            </button>
          </div>
        </div>

        {error ? (
          <p role="alert" className="text-xs text-sale">
            {error}
          </p>
        ) : null}
      </div>
    </li>
  );
}
