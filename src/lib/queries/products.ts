import { cache } from "react";
import { db } from "@/lib/db";

export const getFeaturedProducts = cache(async (take = 4) => {
  return db.product.findMany({
    where: { status: "ACTIVE", featured: true },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 2 },
      category: true,
      variants: { select: { stock: true } },
    },
    orderBy: { createdAt: "desc" },
    take,
  });
});

export const getNewArrivals = cache(async (take = 8) => {
  return db.product.findMany({
    where: { status: "ACTIVE", isNewArrival: true },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 2 },
      category: true,
      variants: { select: { stock: true } },
    },
    orderBy: { createdAt: "desc" },
    take,
  });
});
