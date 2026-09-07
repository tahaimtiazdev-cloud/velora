import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/shop/EmptyState";
import { FilterPanel } from "@/components/shop/FilterPanel";
import { MobileFilterDrawer } from "@/components/shop/MobileFilterDrawer";
import { Pagination } from "@/components/shop/Pagination";
import { SortSelect } from "@/components/shop/SortSelect";
import { Container } from "@/components/ui/Container";
import { getCategoriesWithCounts, getCategoryBySlug } from "@/lib/queries/categories";
import { getProducts } from "@/lib/queries/products";
import { PAGE_SIZE, parseShopParams, type RawSearchParams } from "@/lib/shop-params";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: category.name,
    description:
      category.description ?? `Shop ${category.name} at VELORA — considered pieces, honestly priced.`,
    alternates: { canonical: `/categories/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const raw = await searchParams;
  const parsed = parseShopParams(raw);
  const shopParams = { ...parsed, category: category.slug };

  const [{ products, totalCount, totalPages, page }, allCategories] = await Promise.all([
    getProducts(shopParams, PAGE_SIZE),
    getCategoriesWithCounts(),
  ]);

  const resolvedParams = { ...shopParams, page };
  const basePath = `/categories/${category.slug}`;

  return (
    <div className="border-b border-line bg-paper">
      <Container className="py-10 sm:py-14">
        <header className="mb-8">
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">{category.name}</h1>
          {category.description ? (
            <p className="mt-2 max-w-2xl text-sm text-muted">{category.description}</p>
          ) : null}
          <p className="mt-2 text-sm text-muted">
            {totalCount} {totalCount === 1 ? "product" : "products"}
          </p>
        </header>

        <div className="mb-6 flex items-center justify-end gap-3">
          <MobileFilterDrawer>
            <FilterPanel
              basePath={basePath}
              params={resolvedParams}
              categories={allCategories.map((c) => ({
                name: c.name,
                slug: c.slug,
                count: c._count.products,
              }))}
              hideCategoryFilter
            />
          </MobileFilterDrawer>
          <SortSelect basePath={basePath} current={shopParams.sort} />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <FilterPanel
              basePath={basePath}
              params={resolvedParams}
              categories={allCategories.map((c) => ({
                name: c.name,
                slug: c.slug,
                count: c._count.products,
              }))}
              hideCategoryFilter
            />
          </aside>

          <div>
            {products.length === 0 ? (
              <EmptyState
                title="No products found"
                description="No products match these filters. Try adjusting or clearing them."
                actionLabel="Clear filters"
                actionHref={basePath}
              />
            ) : (
              <>
                <ProductGrid products={products} />
                <Pagination basePath={basePath} params={resolvedParams} totalPages={totalPages} />
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
