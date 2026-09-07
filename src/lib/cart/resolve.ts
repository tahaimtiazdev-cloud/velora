import "server-only";
import { db } from "@/lib/db";

export type ResolvedCartLine =
  | {
      ok: true;
      productId: string;
      variantId: string | null;
      productName: string;
      variantLabel: string | null;
      availableStock: number;
      unitPrice: number;
    }
  | { ok: false; error: string };

/**
 * Authoritatively resolves a product (and optional variant) from the
 * database, verifying it's active, the variant genuinely belongs to it,
 * and it's in stock. Never trust a client-supplied price or stock value —
 * this is the single source of truth cart mutations and (later) checkout
 * must go through.
 */
export async function resolveCartLine(
  productId: string,
  variantId?: string | null
): Promise<ResolvedCartLine> {
  const product = await db.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });

  if (!product || product.status !== "ACTIVE") {
    return { ok: false, error: "This product is no longer available." };
  }

  if (product.variants.length > 0) {
    if (!variantId) {
      return { ok: false, error: "Please select an option before adding to cart." };
    }
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) {
      return { ok: false, error: "That option is not available for this product." };
    }
    if (variant.stock <= 0) {
      return { ok: false, error: "That option is out of stock." };
    }
    return {
      ok: true,
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      variantLabel: `${variant.type}: ${variant.value}`,
      availableStock: variant.stock,
      unitPrice: Number(product.price) + Number(variant.priceModifier),
    };
  }

  if (product.stock <= 0) {
    return { ok: false, error: "This product is out of stock." };
  }

  return {
    ok: true,
    productId: product.id,
    variantId: null,
    productName: product.name,
    variantLabel: null,
    availableStock: product.stock,
    unitPrice: Number(product.price),
  };
}
