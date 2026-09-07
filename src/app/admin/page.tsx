import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { getDashboardMetrics } from "@/lib/queries/admin/dashboard";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/orders";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();

  const stats = [
    { label: "Total Revenue", value: formatPrice(metrics.totalRevenue) },
    { label: "Orders", value: metrics.orderCount },
    { label: "Active Products", value: metrics.productCount },
    { label: "Categories", value: metrics.categoryCount },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Dashboard</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-line bg-surface p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{stat.label}</p>
            <p className="mt-2 font-serif text-2xl text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wide text-ink">Recent Orders</h2>
            <Link href="/admin/orders" className="focus-ring text-sm text-ink underline">
              View All
            </Link>
          </div>
          {metrics.recentOrders.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No orders yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {metrics.recentOrders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="focus-ring flex items-center justify-between gap-3 py-3 text-sm hover:bg-surface"
                  >
                    <div>
                      <p className="font-medium text-ink">{order.orderNumber}</p>
                      <p className="text-xs text-muted">{order.customerName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge>{ORDER_STATUS_LABELS[order.status]}</Badge>
                      <span className="text-ink">{formatPrice(order.total)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wide text-ink">Low Stock</h2>
            <Link href="/admin/products" className="focus-ring text-sm text-ink underline">
              View All
            </Link>
          </div>
          {metrics.lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Nothing running low right now.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {metrics.lowStock.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="focus-ring flex items-center justify-between gap-3 py-3 text-sm hover:bg-surface"
                  >
                    <span className="text-ink">{product.name}</span>
                    <Badge tone={product.totalStock === 0 ? "error" : "warning"}>
                      {product.totalStock} left
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
