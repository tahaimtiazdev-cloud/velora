import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { requireUser } from "@/lib/auth/guards";
import { getUserProfile } from "@/lib/queries/user";
import { getOrdersForUser } from "@/lib/queries/orders";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/orders";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false },
};

export default async function AccountPage() {
  const sessionUser = await requireUser();
  const profile = await getUserProfile(sessionUser.id);

  if (!profile) {
    // Session refers to a user that no longer exists — shouldn't happen in
    // practice, but fail safely instead of rendering a broken page.
    notFound();
  }

  const recentOrders = await getOrdersForUser(profile.id, 3);

  return (
    <Container className="py-10 sm:py-14">
      <div className="flex items-baseline justify-between">
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">My Account</h1>
        <LogoutButton />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
        <div className="border border-line bg-surface p-6">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
            Account Details
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted">Name</dt>
              <dd className="text-ink">{profile.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="text-ink">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-muted">Member Since</dt>
              <dd className="text-ink">
                {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
                  profile.createdAt
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
              Recent Orders
            </h2>
            <Link href="/account/orders" className="focus-ring text-sm font-medium text-ink underline">
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="mt-4 border border-line bg-surface p-8 text-center">
              <p className="text-sm text-muted">You haven&apos;t placed any orders yet.</p>
              <Link
                href="/shop"
                className="focus-ring mt-3 inline-block text-sm font-medium text-ink underline"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <ul aria-label="Recent orders" className="mt-4 divide-y divide-line border-y border-line">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between py-4 text-sm">
                  <div>
                    <p className="font-medium text-ink">{order.orderNumber}</p>
                    <p className="text-xs text-muted">
                      {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                        order.createdAt
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge>{ORDER_STATUS_LABELS[order.status]}</Badge>
                    <span className="text-ink">{formatPrice(order.total)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Container>
  );
}
