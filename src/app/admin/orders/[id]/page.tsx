import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { getAdminOrderById } from "@/lib/queries/admin/orders";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Order Details" };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted">
        <Link href="/admin/orders" className="focus-ring hover:text-ink">
          Orders
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-ink" aria-current="page">
          {order.orderNumber}
        </span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-ink">{order.orderNumber}</h1>
        <Badge tone={order.paymentStatus === "PAID" ? "success" : order.paymentStatus === "FAILED" ? "error" : "neutral"}>
          Payment: {order.paymentStatus}
        </Badge>
      </div>
      <p className="mt-2 text-sm text-muted">
        Placed {new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short" }).format(order.createdAt)}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wide text-ink">Items</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-4 text-sm">
                <div>
                  <p className="text-ink">{item.productName}</p>
                  {item.variantLabel ? <p className="text-xs text-muted">{item.variantLabel}</p> : null}
                  <p className="text-xs text-muted">Qty {item.quantity}</p>
                </div>
                <span className="text-ink">{formatPrice(Number(item.priceAtPurchase) * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-sm font-medium uppercase tracking-wide text-ink">Customer</h2>
          <p className="mt-4 text-sm text-ink">{order.customerName}</p>
          <p className="text-sm text-muted">{order.customerEmail}</p>
          {order.user ? (
            <p className="mt-1 text-xs text-muted">Registered account ({order.user.email})</p>
          ) : (
            <p className="mt-1 text-xs text-muted">Guest checkout</p>
          )}

          <h2 className="mt-10 text-sm font-medium uppercase tracking-wide text-ink">Shipping Address</h2>
          <address className="mt-4 text-sm not-italic text-muted">
            {order.shippingAddressLine1}
            <br />
            {order.shippingAddressLine2 ? (
              <>
                {order.shippingAddressLine2}
                <br />
              </>
            ) : null}
            {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
            <br />
            {order.shippingCountry}
          </address>

          {order.paymentReference ? (
            <p className="mt-6 text-xs text-muted">Stripe reference: {order.paymentReference}</p>
          ) : null}
        </div>

        <div className="h-fit space-y-6">
          <div className="border border-line bg-surface p-6">
            <OrderStatusForm orderId={order.id} currentStatus={order.status} />
          </div>

          <div className="border border-line bg-surface p-6">
            <h2 className="text-sm font-medium uppercase tracking-wide text-ink">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="text-ink">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="text-ink">{Number(order.shipping) === 0 ? "Free" : formatPrice(order.shipping)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Tax</dt>
                <dd className="text-ink">{formatPrice(order.tax)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <span className="text-sm font-medium text-ink">Total</span>
              <span className="text-lg text-ink">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
