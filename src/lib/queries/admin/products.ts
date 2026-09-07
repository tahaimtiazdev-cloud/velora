import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { ADMIN_PAGE_SIZE, type AdminListParams } from "@/lib/admin/params";

export async function getAdminProducts(params: AdminListParams) {
  const where: Prisma.ProductWhereInput = params.q
    ? {
        OR: [
          { name: { contains: params.q, mode: "insensitive" } },
          { sku: { contains: params.q, mode: "insensitive" } },
        ],
      }
    : {};

  const totalCount = await db.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / ADMIN_PAGE_SIZE));
  const page = Math.min(Math.max(1, params.page), totalPages);

  const products = await db.product.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * ADMIN_PAGE_SIZE,
    take: ADMIN_PAGE_SIZE,
    include: {
      category: true,
      variants: { select: { stock: true } },
    },
  });

  return { products, totalCount, totalPages, page };
}

export async function getAdminProductById(id: string) {
  return db.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { value: "asc" } },
      category: true,
    },
  });
}
