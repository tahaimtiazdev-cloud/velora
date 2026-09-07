import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getRelatedProducts } from "@/lib/queries/products";

export async function RelatedProducts({
  categoryId,
  excludeProductId,
}: {
  categoryId: string;
  excludeProductId: string;
}) {
  const products = await getRelatedProducts(categoryId, excludeProductId, 4);

  if (products.length === 0) return null;

  return (
    <div className="mt-16 border-t border-line pt-12">
      <SectionHeading eyebrow="You Might Also Like" title="Related pieces" />
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
