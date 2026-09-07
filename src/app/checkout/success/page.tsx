import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CheckoutSuccessClient } from "@/components/checkout/CheckoutSuccessClient";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  if (!sessionId) {
    redirect("/");
  }

  const session = await auth();

  return (
    <Container className="py-14 sm:py-20">
      <CheckoutSuccessClient sessionId={sessionId} isSignedIn={Boolean(session?.user)} />
    </Container>
  );
}
