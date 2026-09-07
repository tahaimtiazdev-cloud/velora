import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GarmentIllustration } from "@/components/ui/GarmentIllustration";

export function Hero() {
  return (
    <section className="border-b border-line bg-paper">
      <Container className="grid grid-cols-1 items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="order-2 animate-fade-up lg:order-1">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Fall Collection
          </p>
          <h1 className="font-serif text-4xl leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
            Designed for the way you live.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            Considered pieces built from quality materials, priced honestly,
            and made to be worn — not just displayed. Every edit is small on
            purpose.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/shop" size="lg">
              Shop Collection
            </Button>
            <Button href="/shop?filter=new" variant="secondary" size="lg">
              Explore New Arrivals
            </Button>
          </div>
        </div>

        <div className="order-1 animate-fade-up lg:order-2 lg:[animation-delay:100ms]">
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-line bg-surface">
            <div className="absolute inset-0 flex items-center justify-center text-ink/80">
              <GarmentIllustration variant="jacket" className="h-2/3 w-2/3" strokeWidth={1.4} />
            </div>
            <span className="absolute left-5 top-5 border border-ink/15 bg-paper/90 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-ink">
              The Structured Jacket
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
