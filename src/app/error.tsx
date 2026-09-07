"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/shop/ErrorState";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled page error:", error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-20">
      <ErrorState
        title="Something went wrong"
        description="We hit an unexpected error loading this page. Please try again."
        onRetry={reset}
      />
    </Container>
  );
}
