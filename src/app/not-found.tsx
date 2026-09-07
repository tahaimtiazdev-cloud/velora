import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">404</p>
      <h1 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist, may have been moved, or the
        product is no longer available.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/shop">Shop All</Button>
        <Button href="/" variant="secondary">
          Back to Home
        </Button>
      </div>
    </Container>
  );
}
