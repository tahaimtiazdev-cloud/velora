import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { getFeaturedProducts } from "@/lib/queries/products";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(4);

  if (products.length === 0) {
    return null;
  }

  return (
    <Section tone="paper">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Selected" title="Featured pieces" />
          <Button href="/shop" variant="secondary" size="sm" className="shrink-0">
            View All
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
