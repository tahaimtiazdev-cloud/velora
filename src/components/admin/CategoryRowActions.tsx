"use client";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteCategoryAction } from "@/lib/actions/admin/categories";

export function CategoryRowActions({ categoryId }: { categoryId: string }) {
  return <DeleteButton action={() => deleteCategoryAction(categoryId)} />;
}
