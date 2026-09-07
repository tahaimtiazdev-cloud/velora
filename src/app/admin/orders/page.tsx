import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { AdminSearchInput } from "@/components/admin/AdminSearchInput";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { OrderStatusFilter } from "@/components/admin/OrderStatusFilter";
import { parseAdminListParams, type RawSearchParams } from "@/lib/admin/params";
import { getAdminOrders } from "@/lib/queries/admin/orders";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/orders";
import type { OrderStatus } from "@/generated/prisma/client";

export const metadata: Metadata = { title: "Orders" };

const STATUS_VALUES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams & { status?: string }>;
}) {
  const raw = await searchParams;
  const params = parseAdminListParams(raw);
  const statusRaw = Array.isArray(raw.status) ? raw.status[0] : raw.status;
  const status = STATUS_VALUES.includes(statusRaw as OrderStatus) ? (statusRaw as OrderStatus) : undefined;

  const { orders, totalCount, totalPages, page } = await getAdminOrders({ ...params, status });

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Orders</h1>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <AdminSearchInput basePath="/admin/orders" initialQuery={params.q ?? ""} placeholder="Search order #, name, or email…" />
        <OrderStatusFilter currentStatus={status} currentQuery={params.q} />
      </div>

      <p className="mt-4 text-xs text-muted">
        {totalCount} order{totalCount === 1 ? "" : "s"}
      </p>

      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <th className="py-3 pr-4 font-medium">Order</th>
              <th className="py-3 pr-4 font-medium">Customer</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Payment</th>
              <th className="py-3 pr-0 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="py-3 pr-4">
                  <Link href={`/admin/orders/${order.id}`} className="focus-ring font-medium text-ink hover:underline">
                    {order.orderNumber}
                  </Link>
                  <p className="text-xs text-muted">
                    {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(order.createdAt)}
                  </p>
                </td>
                <td className="py-3 pr-4">
                  <p className="text-ink">{order.customerName}</p>
                  <p className="text-xs text-muted">{order.customerEmail}</p>
                </td>
                <td className="py-3 pr-4">
                  <Badge>{ORDER_STATUS_LABELS[order.status]}</Badge>
                </td>
                <td className="py-3 pr-4">
                  <Badge tone={order.paymentStatus === "PAID" ? "success" : order.paymentStatus === "FAILED" ? "error" : "neutral"}>
                    {order.paymentStatus}
                  </Badge>
                </td>
                <td className="py-3 pr-0 text-right text-ink">{formatPrice(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 ? <p className="py-10 text-center text-sm text-muted">No orders found.</p> : null}
      </div>

      <AdminPagination
        basePath="/admin/orders"
        currentParams={{ q: params.q, status }}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
