import "server-only";
import { db } from "@/lib/db";

export async function getAdminCategories() {
  return db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getAdminCategoryById(id: string) {
  return db.category.findUnique({ where: { id } });
}
