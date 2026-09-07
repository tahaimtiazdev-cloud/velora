"use client";

import { useState, useTransition } from "react";
import { updateOrderStatusAction } from "@/lib/actions/admin/orders";
import { ORDER_STATUS_LABELS } from "@/lib/orders";
import type { OrderStatus } from "@/generated/prisma/client";

export function OrderStatusForm({ orderId, currentStatus }: { orderId: string; currentStatus: OrderStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleChange(next: OrderStatus) {
    setStatus(next);
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, next);
      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        setStatus(currentStatus);
      } else {
        setSaved(true);
      }
    });
  }

  return (
    <div>
      <label htmlFor="order-status" className="block text-xs font-medium uppercase tracking-wide text-muted">
        Fulfillment Status
      </label>
      <select
        id="order-status"
        value={status}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        className="focus-ring mt-1.5 w-full border border-line bg-paper px-3.5 py-2.5 text-sm text-ink"
      >
        {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1.5 text-xs font-medium text-sale">{error}</p> : null}
      {saved && !isPending ? <p className="mt-1.5 text-xs text-muted">Saved.</p> : null}
    </div>
  );
}
