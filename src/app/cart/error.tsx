"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/shop/ErrorState";

export default function CartError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Cart page error:", error);
  }, [error]);

  return (
    <Container className="py-14">
      <ErrorState
        title="We couldn't load your cart"
        description="Something went wrong loading your cart. Please try again."
        onRetry={reset}
      />
    </Container>
  );
}
