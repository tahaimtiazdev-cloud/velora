import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GarmentIllustration } from "@/components/ui/GarmentIllustration";

export function Editorial() {
  return (
    <section className="border-y border-line bg-paper">
      <Container className="grid grid-cols-1 items-stretch lg:grid-cols-2">
        <div className="relative flex aspect-[4/3] items-center justify-center bg-ink text-paper lg:aspect-auto">
          <GarmentIllustration variant="knit" className="h-2/3 w-2/3 text-paper/70" strokeWidth={1.3} />
        </div>
        <div className="flex flex-col justify-center px-1 py-12 sm:px-2 lg:px-14 lg:py-0">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            The Idea
          </p>
          <p className="mt-4 max-w-md font-serif text-2xl leading-snug text-ink sm:text-3xl">
            We design fewer things, and try to get each one right — from the
            first sketch to the stitching that holds up after fifty washes.
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
            VELORA started as a rejection of the seasonal churn — twelve
            drops a year, most of it landfill within eighteen months.
            Instead we work in small, considered collections built to be
            worn for years.
          </p>
          <div className="mt-6">
            <Button href="/about" variant="secondary" size="sm">
              Our Story
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
