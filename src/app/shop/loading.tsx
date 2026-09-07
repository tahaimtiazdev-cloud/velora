import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";
import { Container } from "@/components/ui/Container";

export default function ShopLoading() {
  return (
    <div className="border-b border-line bg-paper">
      <Container className="py-10 sm:py-14">
        <div className="mb-8 h-9 w-48 animate-pulse bg-surface" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
          <div className="hidden lg:block" />
          <ProductGridSkeleton />
        </div>
      </Container>
    </div>
  );
}
