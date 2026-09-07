import type { ProductDetailData } from "@/types/product";

/**
 * Prisma's `Decimal` fields can't cross the Server -> Client Component
 * boundary as props (they aren't plain serializable objects). This
 * converts a product into a plain-number shape for client components.
 */
export interface ClientProductVariant {
  id: string;
  type: string;
  value: string;
  stock: number;
  priceModifier: number;
}

export interface ClientProduct {
  id: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  variants: ClientProductVariant[];
}

export function toClientProduct(product: ProductDetailData): ClientProduct {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice != null ? Number(product.compareAtPrice) : null,
    stock: product.stock,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      type: variant.type,
      value: variant.value,
      stock: variant.stock,
      priceModifier: Number(variant.priceModifier),
    })),
  };
}
