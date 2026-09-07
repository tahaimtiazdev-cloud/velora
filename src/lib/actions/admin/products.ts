"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { db } from "@/lib/db";
import { productSchema, type ProductInput } from "@/lib/validations/admin/product";
import { Prisma } from "@/generated/prisma/client";

export interface AdminActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function flattenFieldErrors(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

/** Maps a Prisma unique-constraint violation to a friendly field error. */
function uniqueConstraintFieldError(error: unknown): Record<string, string> | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    const target = Array.isArray(error.meta?.target) ? (error.meta.target as string[]) : [];
    if (target.includes("slug")) return { slug: "A product with this slug already exists." };
    if (target.includes("sku")) return { sku: "A product with this SKU already exists." };
  }
  return null;
}

export async function createProductAction(input: ProductInput): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: flattenFieldErrors(parsed.error) };
  }
  const data = parsed.data;

  let productId: string;
  try {
    const created = await db.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice ?? null,
        sku: data.sku,
        stock: data.stock,
        categoryId: data.categoryId,
        featured: data.featured,
        isNewArrival: data.isNewArrival,
        status: data.status,
        images: { create: data.images.map((img, i) => ({ ...img, sortOrder: i })) },
        variants: {
          create: data.variants.map((v) => ({
            type: v.type,
            value: v.value,
            priceModifier: v.priceModifier,
            stock: v.stock,
            sku: v.sku || null,
          })),
        },
      },
    });
    productId = created.id;
  } catch (error) {
    const fieldErrors = uniqueConstraintFieldError(error);
    if (fieldErrors) return { success: false, fieldErrors };
    console.error("Failed to create product:", error);
    return { success: false, error: "Something went wrong creating the product." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect(`/admin/products/${productId}/edit`);
}

export async function updateProductAction(
  productId: string,
  input: ProductInput
): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: flattenFieldErrors(parsed.error) };
  }
  const data = parsed.data;

  const existing = await db.product.findUnique({
    where: { id: productId },
    select: { slug: true, variants: { select: { id: true } } },
  });
  if (!existing) {
    return { success: false, error: "Product not found." };
  }

  const existingVariantIds = new Set(existing.variants.map((v) => v.id));
  const submittedIds = new Set(data.variants.filter((v) => v.id).map((v) => v.id!));
  const variantIdsToDelete = [...existingVariantIds].filter((id) => !submittedIds.has(id));

  try {
    await db.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: productId },
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
          compareAtPrice: data.compareAtPrice ?? null,
          sku: data.sku,
          stock: data.stock,
          categoryId: data.categoryId,
          featured: data.featured,
          isNewArrival: data.isNewArrival,
          status: data.status,
        },
      });

      await tx.productImage.deleteMany({ where: { productId } });
      if (data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((img, i) => ({ ...img, productId, sortOrder: i })),
        });
      }

      if (variantIdsToDelete.length > 0) {
        await tx.productVariant.deleteMany({ where: { id: { in: variantIdsToDelete } } });
      }

      for (const variant of data.variants) {
        const variantData = {
          type: variant.type,
          value: variant.value,
          priceModifier: variant.priceModifier,
          stock: variant.stock,
          sku: variant.sku || null,
        };
        if (variant.id && existingVariantIds.has(variant.id)) {
          await tx.productVariant.update({ where: { id: variant.id }, data: variantData });
        } else {
          await tx.productVariant.create({ data: { ...variantData, productId } });
        }
      }
    });
  } catch (error) {
    const fieldErrors = uniqueConstraintFieldError(error);
    if (fieldErrors) return { success: false, fieldErrors };
    console.error("Failed to update product:", error);
    return { success: false, error: "Something went wrong updating the product." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/products/${existing.slug}`);
  if (existing.slug !== data.slug) revalidatePath(`/products/${data.slug}`);
  return { success: true };
}

export async function deleteProductAction(productId: string): Promise<AdminActionResult> {
  await requireAdmin();

  const existing = await db.product.findUnique({ where: { id: productId }, select: { slug: true } });
  if (!existing) {
    return { success: false, error: "Product not found." };
  }

  try {
    await db.product.delete({ where: { id: productId } });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return {
      success: false,
      error: "This product couldn't be deleted — it may be referenced by existing orders.",
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}
