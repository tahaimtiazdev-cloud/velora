import type { Metadata } from "next";
import { CartClient } from "@/components/cart/CartClient";
import { Container } from "@/components/ui/Container";
import { getCartView } from "@/lib/queries/cart";

export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false },
};

export default async function CartPage() {
  const cart = await getCartView();

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="mb-8 font-serif text-3xl text-ink sm:text-4xl">Your Cart</h1>
      <CartClient initialCart={cart} />
    </Container>
  );
}
