"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/shop/ErrorState";

export default function ShopError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Shop page error:", error);
  }, [error]);

  return (
    <Container className="py-14">
      <ErrorState
        title="We couldn't load the shop"
        description="Something went wrong loading products. Please try again."
        onRetry={reset}
      />
    </Container>
  );
}
