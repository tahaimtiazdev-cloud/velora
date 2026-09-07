import { cache } from "react";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import type { ShopParams, SortOption } from "@/lib/shop-params";

/** Shared `include` shape for every product-card-sized query, so query
 * results are structurally interchangeable wherever a ProductCard is used. */
const cardInclude = {
  images: { orderBy: { sortOrder: "asc" as const }, take: 2 },
  category: true,
  variants: { select: { stock: true } },
} satisfies Prisma.ProductInclude;

function sortToOrderBy(sort: SortOption): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "newest":
      return [{ createdAt: "desc" }];
    case "price-asc":
      return [{ price: "asc" }];
    case "price-desc":
      return [{ price: "desc" }];
    case "name-asc":
      return [{ name: "asc" }];
    case "featured":
    default:
      return [{ featured: "desc" }, { createdAt: "desc" }];
  }
}

/**
 * "In stock" means at least one purchasable unit exists: either the
 * product has no variants and its own stock is positive, or it has at
 * least one variant with positive stock. "Out of stock" is the negation.
 * Mirrors the rule in `src/lib/inventory.ts`.
 */
function availabilityWhere(availability: ShopParams["availability"]): Prisma.ProductWhereInput {
  if (availability === "in-stock") {
    return {
      OR: [
        { variants: { none: {} }, stock: { gt: 0 } },
        { variants: { some: { stock: { gt: 0 } } } },
      ],
    };
  }
  if (availability === "out-of-stock") {
    return {
      OR: [
        { variants: { none: {} }, stock: { lte: 0 } },
        {
          AND: [{ variants: { some: {} } }, { variants: { every: { stock: { lte: 0 } } } }],
        },
      ],
    };
  }
  return {};
}

export function buildProductWhere(
  params: Pick<ShopParams, "q" | "category" | "minPrice" | "maxPrice" | "availability" | "isNewArrival">
): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { status: "ACTIVE" };

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (params.isNewArrival) {
    where.isNewArrival = true;
  }

  if (params.minPrice != null || params.maxPrice != null) {
    where.price = {
      ...(params.minPrice != null ? { gte: params.minPrice } : {}),
      ...(params.maxPrice != null ? { lte: params.maxPrice } : {}),
    };
  }

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
      { sku: { contains: params.q, mode: "insensitive" } },
    ];
  }

  const availability = availabilityWhere(params.availability);
  if (Object.keys(availability).length > 0) {
    where.AND = [...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []), availability];
  }

  return where;
}

export async function getProducts(params: ShopParams, pageSize: number) {
  const where = buildProductWhere(params);
  const orderBy = sortToOrderBy(params.sort);

  const totalCount = await db.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const page = Math.min(Math.max(1, params.page), totalPages);

  const products = await db.product.findMany({
    where,
    include: cardInclude,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return { products, totalCount, totalPages, page };
}

export const getFeaturedProducts = cache(async (take = 4) => {
  return db.product.findMany({
    where: { status: "ACTIVE", featured: true },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
    take,
  });
});

export const getNewArrivals = cache(async (take = 8) => {
  return db.product.findMany({
    where: { status: "ACTIVE", isNewArrival: true },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
    take,
  });
});

export const getProductBySlug = cache(async (slug: string) => {
  return db.product.findUnique({
    where: { slug, status: "ACTIVE" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      variants: { orderBy: { value: "asc" } },
    },
  });
});

export const getRelatedProducts = cache(async (categoryId: string, excludeProductId: string, take = 4) => {
  return db.product.findMany({
    where: {
      status: "ACTIVE",
      categoryId,
      id: { not: excludeProductId },
    },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
    take,
  });
});
