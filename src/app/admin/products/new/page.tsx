import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/queries/categories";

export const metadata: Metadata = { title: "New Product" };

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">New Product</h1>
      <div className="mt-8 max-w-3xl">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
