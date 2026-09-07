import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getAdminCategoryById } from "@/lib/queries/admin/categories";

export const metadata: Metadata = { title: "Edit Category" };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getAdminCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Edit Category</h1>
      <div className="mt-8">
        <CategoryForm initialCategory={category} />
      </div>
    </div>
  );
}
