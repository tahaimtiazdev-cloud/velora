import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { getCartView } from "@/lib/queries/cart";
import { computeOrderTotals } from "@/lib/checkout/pricing";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default async function CheckoutPage() {
  const cart = await getCartView();
  if (cart.items.length === 0) {
    redirect("/cart");
  }

  const session = await auth();
  const totals = computeOrderTotals(cart.subtotal);

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="mb-8 font-serif text-3xl text-ink sm:text-4xl">Checkout</h1>
      <CheckoutForm
        cart={cart}
        totals={totals}
        initialName={session?.user?.name ?? ""}
        initialEmail={session?.user?.email ?? ""}
      />
    </Container>
  );
}
