import type { getProductBySlug, getProducts } from "@/lib/queries/products";

export type ProductCardData = Awaited<ReturnType<typeof getProducts>>["products"][number];

export type ProductDetailData = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;
