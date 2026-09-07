import { cache } from "react";
import { db } from "@/lib/db";

export const getCategories = cache(async () => {
  return db.category.findMany({
    orderBy: { name: "asc" },
  });
});

export const getCategoryBySlug = cache(async (slug: string) => {
  return db.category.findUnique({
    where: { slug },
  });
});
