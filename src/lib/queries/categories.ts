import { cache } from "react";
import { db } from "@/lib/db";

export const getCategories = cache(async () => {
  return db.category.findMany({
    orderBy: { name: "asc" },
  });
});

export const getCategoriesWithCounts = cache(async () => {
  return db.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: { where: { status: "ACTIVE" } } } },
    },
  });
});

export const getCategoryBySlug = cache(async (slug: string) => {
  return db.category.findUnique({
    where: { slug },
  });
});
