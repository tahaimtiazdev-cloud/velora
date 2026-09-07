import type { Metadata } from "next";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/shop/EmptyState";
import { FilterPanel } from "@/components/shop/FilterPanel";
import { MobileFilterDrawer } from "@/components/shop/MobileFilterDrawer";
import { Pagination } from "@/components/shop/Pagination";
import { SearchInput } from "@/components/shop/SearchInput";
import { SortSelect } from "@/components/shop/SortSelect";
import { Container } from "@/components/ui/Container";
import { getCategoriesWithCounts } from "@/lib/queries/categories";
import { getProducts } from "@/lib/queries/products";
import { PAGE_SIZE, parseShopParams, type RawSearchParams } from "@/lib/shop-params";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse the full VELORA collection — considered pieces in outerwear, knitwear, tops, bottoms, and accessories.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const raw = await searchParams;
  const params = parseShopParams(raw);

  const [{ products, totalCount, totalPages, page }, categories] = await Promise.all([
    getProducts(params, PAGE_SIZE),
    getCategoriesWithCounts(),
  ]);

  const resolvedParams = { ...params, page };

  const heading = params.isNewArrival
    ? "New Arrivals"
    : params.q
      ? `Results for "${params.q}"`
      : "Shop All";

  return (
    <div className="border-b border-line bg-paper">
      <Container className="py-10 sm:py-14">
        <header className="mb-8">
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">{heading}</h1>
          <p className="mt-2 text-sm text-muted">
            {totalCount} {totalCount === 1 ? "product" : "products"}
          </p>
        </header>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="sm:max-w-xs sm:flex-1">
            <SearchInput basePath="/shop" initialQuery={params.q ?? ""} />
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <MobileFilterDrawer>
              <FilterPanel
                basePath="/shop"
                params={resolvedParams}
                categories={categories.map((c) => ({
                  name: c.name,
                  slug: c.slug,
                  count: c._count.products,
                }))}
              />
            </MobileFilterDrawer>
            <SortSelect basePath="/shop" current={params.sort} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <FilterPanel
              basePath="/shop"
              params={resolvedParams}
              categories={categories.map((c) => ({
                name: c.name,
                slug: c.slug,
                count: c._count.products,
              }))}
            />
          </aside>

          <div>
            {products.length === 0 ? (
              <EmptyState
                title="No products found"
                description={
                  params.q
                    ? `We couldn't find anything matching "${params.q}". Try a different search or clear your filters.`
                    : "No products match these filters. Try adjusting or clearing them."
                }
                actionLabel="Clear filters"
                actionHref="/shop"
              />
            ) : (
              <>
                <ProductGrid products={products} />
                <Pagination basePath="/shop" params={resolvedParams} totalPages={totalPages} />
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
