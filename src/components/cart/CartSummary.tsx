import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

export function CartSummary({ subtotal, itemCount }: { subtotal: number; itemCount: number }) {
  return (
    <div className="border border-line bg-surface p-6">
      <h2 className="text-sm font-medium uppercase tracking-wide text-ink">Order Summary</h2>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted">
            Subtotal &middot; {itemCount} {itemCount === 1 ? "item" : "items"}
          </dt>
          <dd className="text-ink">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd className="text-muted">Calculated at checkout</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <span className="text-sm font-medium text-ink">Total</span>
        <span className="text-lg text-ink">{formatPrice(subtotal)}</span>
      </div>

      <Button type="button" size="lg" disabled className="mt-6 w-full">
        Checkout — Coming in Stage 5
      </Button>
      <p className="mt-3 text-center text-xs text-muted">
        Checkout and payment aren&apos;t built yet. Your cart is saved.
      </p>
    </div>
  );
}
