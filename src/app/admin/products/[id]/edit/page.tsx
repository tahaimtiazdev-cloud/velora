import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { getCategories } from "@/lib/queries/categories";
import { getAdminProductById } from "@/lib/queries/admin/products";

export const metadata: Metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getAdminProductById(id), getCategories()]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">Edit Product</h1>
        <DeleteProductButton productId={product.id} />
      </div>
      <div className="mt-8 max-w-3xl">
        <ProductForm
          categories={categories}
          initialProduct={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: Number(product.price),
            compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
            sku: product.sku,
            stock: product.stock,
            categoryId: product.categoryId,
            featured: product.featured,
            isNewArrival: product.isNewArrival,
            status: product.status,
            images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
            variants: product.variants.map((v) => ({
              id: v.id,
              type: v.type,
              value: v.value,
              priceModifier: Number(v.priceModifier),
              stock: v.stock,
              sku: v.sku,
            })),
          }}
        />
      </div>
    </div>
  );
}
