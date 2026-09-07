export const LOW_STOCK_THRESHOLD = 5;

interface StockAware {
  stock: number;
  variants: { stock: number }[];
}

/**
 * Products with variants track stock per-variant; the product's own
 * `stock` field is only authoritative when it has no variants.
 */
export function getTotalStock(product: StockAware): number {
  if (product.variants.length > 0) {
    return product.variants.reduce((sum, variant) => sum + variant.stock, 0);
  }
  return product.stock;
}

export function isOutOfStock(product: StockAware): boolean {
  return getTotalStock(product) <= 0;
}

export function isLowStock(product: StockAware): boolean {
  const total = getTotalStock(product);
  return total > 0 && total <= LOW_STOCK_THRESHOLD;
}
