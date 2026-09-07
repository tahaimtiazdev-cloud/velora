"use client";

import { useRouter } from "next/navigation";
import { adminListSearchString } from "@/lib/admin/params";
import { ORDER_STATUS_LABELS } from "@/lib/orders";
import type { OrderStatus } from "@/generated/prisma/client";

export function OrderStatusFilter({
  currentStatus,
  currentQuery,
}: {
  currentStatus?: OrderStatus;
  currentQuery?: string;
}) {
  const router = useRouter();

  return (
    <select
      value={currentStatus ?? ""}
      onChange={(e) =>
        router.push(`/admin/orders${adminListSearchString({ q: currentQuery, status: e.target.value || undefined })}`)
      }
      aria-label="Filter by status"
      className="focus-ring border border-line bg-paper px-3 py-2.5 text-sm text-ink"
    >
      <option value="">All Statuses</option>
      {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
