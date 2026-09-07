"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { db } from "@/lib/db";
import { categorySchema, type CategoryInput } from "@/lib/validations/admin/category";
import { Prisma } from "@/generated/prisma/client";
import type { AdminActionResult } from "@/lib/actions/admin/products";

function flattenFieldErrors(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

function uniqueSlugError(error: unknown): Record<string, string> | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return { slug: "A category with this slug already exists." };
  }
  return null;
}

export async function createCategoryAction(input: CategoryInput): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: flattenFieldErrors(parsed.error) };
  }

  try {
    await db.category.create({ data: parsed.data });
  } catch (error) {
    const fieldErrors = uniqueSlugError(error);
    if (fieldErrors) return { success: false, fieldErrors };
    console.error("Failed to create category:", error);
    return { success: false, error: "Something went wrong creating the category." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  redirect("/admin/categories");
}

export async function updateCategoryAction(
  categoryId: string,
  input: CategoryInput
): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: flattenFieldErrors(parsed.error) };
  }

  try {
    await db.category.update({ where: { id: categoryId }, data: parsed.data });
  } catch (error) {
    const fieldErrors = uniqueSlugError(error);
    if (fieldErrors) return { success: false, fieldErrors };
    console.error("Failed to update category:", error);
    return { success: false, error: "Something went wrong updating the category." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(categoryId: string): Promise<AdminActionResult> {
  await requireAdmin();

  const productCount = await db.product.count({ where: { categoryId } });
  if (productCount > 0) {
    return {
      success: false,
      error: `This category has ${productCount} product${productCount === 1 ? "" : "s"} assigned to it. Move or delete them first.`,
    };
  }

  try {
    await db.category.delete({ where: { id: categoryId } });
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: "Something went wrong deleting the category." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  return { success: true };
}
