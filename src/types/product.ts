import type { getFeaturedProducts } from "@/lib/queries/products";

export type ProductCardData = Awaited<ReturnType<typeof getFeaturedProducts>>[number];
