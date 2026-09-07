import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/shop/EmptyState";
import { requireUser } from "@/lib/auth/guards";
import { getOrdersForUser } from "@/lib/queries/orders";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Order History",
  robots: { index: false },
};

export default async function OrderHistoryPage() {
  const sessionUser = await requireUser();
  const orders = await getOrdersForUser(sessionUser.id);

  return (
    <Container className="py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted">
        <Link href="/account" className="focus-ring hover:text-ink">
          My Account
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-ink" aria-current="page">
          Order History
        </span>
      </nav>

      <h1 className="font-serif text-3xl text-ink sm:text-4xl">Order History</h1>

      {orders.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No orders yet"
            description="Once you place an order, you'll be able to track it here."
            actionLabel="Shop Now"
            actionHref="/shop"
          />
        </div>
      ) : (
        <ul aria-label="Orders" className="mt-10 divide-y divide-line border-y border-line">
          {orders.map((order) => (
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-5 text-sm">
              <div>
                <p className="font-medium text-ink">{order.orderNumber}</p>
                <p className="text-xs text-muted">
                  {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge>{ORDER_STATUS_LABELS[order.status]}</Badge>
                <span className="text-ink">{formatPrice(order.total)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
