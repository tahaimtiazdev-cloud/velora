"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/shop/ErrorState";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Product page error:", error);
  }, [error]);

  return (
    <Container className="py-14">
      <ErrorState
        title="We couldn't load this product"
        description="Something went wrong loading this page. Please try again."
        onRetry={reset}
      />
    </Container>
  );
}
