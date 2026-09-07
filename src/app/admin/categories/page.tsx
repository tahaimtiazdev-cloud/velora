import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CategoryRowActions } from "@/components/admin/CategoryRowActions";
import { getAdminCategories } from "@/lib/queries/admin/categories";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl text-ink">Categories</h1>
        <Button href="/admin/categories/new" size="sm">
          New Category
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <th className="py-3 pr-4 font-medium">Name</th>
              <th className="py-3 pr-4 font-medium">Slug</th>
              <th className="py-3 pr-4 font-medium">Products</th>
              <th className="py-3 pr-0 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="py-3 pr-4">
                  <Link
                    href={`/admin/categories/${category.id}/edit`}
                    className="focus-ring font-medium text-ink hover:underline"
                  >
                    {category.name}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-muted">{category.slug}</td>
                <td className="py-3 pr-4 text-ink">{category._count.products}</td>
                <td className="py-3 pr-0 text-right">
                  <CategoryRowActions categoryId={category.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">No categories yet.</p>
        ) : null}
      </div>
    </div>
  );
}
