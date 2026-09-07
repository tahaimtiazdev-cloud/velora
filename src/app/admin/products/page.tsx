import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AdminSearchInput } from "@/components/admin/AdminSearchInput";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { ProductRowActions } from "@/components/admin/ProductRowActions";
import { parseAdminListParams, type RawSearchParams } from "@/lib/admin/params";
import { getAdminProducts } from "@/lib/queries/admin/products";
import { getTotalStock, isOutOfStock, isLowStock } from "@/lib/inventory";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = parseAdminListParams(await searchParams);
  const { products, totalCount, totalPages, page } = await getAdminProducts(params);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl text-ink">Products</h1>
        <Button href="/admin/products/new" size="sm">
          New Product
        </Button>
      </div>

      <div className="mt-6">
        <AdminSearchInput basePath="/admin/products" initialQuery={params.q ?? ""} placeholder="Search by name or SKU…" />
      </div>

      <p className="mt-4 text-xs text-muted">
        {totalCount} product{totalCount === 1 ? "" : "s"}
      </p>

      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <th className="py-3 pr-4 font-medium">Product</th>
              <th className="py-3 pr-4 font-medium">Category</th>
              <th className="py-3 pr-4 font-medium">Price</th>
              <th className="py-3 pr-4 font-medium">Stock</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-0 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((product) => {
              const stock = getTotalStock(product);
              return (
                <tr key={product.id}>
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="focus-ring font-medium text-ink hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted">{product.sku}</p>
                  </td>
                  <td className="py-3 pr-4 text-muted">{product.category.name}</td>
                  <td className="py-3 pr-4 text-ink">{formatPrice(product.price)}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={isOutOfStock(product) ? "error" : isLowStock(product) ? "warning" : "neutral"}>
                      {stock}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge tone={product.status === "ACTIVE" ? "success" : "neutral"}>{product.status}</Badge>
                  </td>
                  <td className="py-3 pr-0 text-right">
                    <ProductRowActions productId={product.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 ? <p className="py-10 text-center text-sm text-muted">No products found.</p> : null}
      </div>

      <AdminPagination basePath="/admin/products" currentParams={{ q: params.q }} page={page} totalPages={totalPages} />
    </div>
  );
}
