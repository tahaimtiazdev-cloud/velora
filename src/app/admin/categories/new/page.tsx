import type { Metadata } from "next";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const metadata: Metadata = { title: "New Category" };

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">New Category</h1>
      <div className="mt-8">
        <CategoryForm />
      </div>
    </div>
  );
}
