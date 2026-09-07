import "server-only";
import { db } from "@/lib/db";
import { cartWhereForOwner, getCartOwner } from "@/lib/cart/owner";

export interface CartLineView {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  imageUrl: string | null;
  imageAlt: string | null;
  variantId: string | null;
  variantLabel: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  maxQuantity: number;
  isAvailable: boolean;
  warning: string | null;
}

export interface CartView {
  cartId: string | null;
  items: CartLineView[];
  itemCount: number;
  subtotal: number;
}

const EMPTY_CART: CartView = { cartId: null, items: [], itemCount: 0, subtotal: 0 };

/**
 * Loads the current guest cart (by cookie token) with live product/variant
 * data, and resolves display-ready totals and availability warnings.
 * Always recomputes prices from the database — never trusts stored values,
 * since CartItem intentionally has no price column (see schema comment).
 */
export async function getCartView(): Promise<CartView> {
  const owner = await getCartOwner();
  if (!owner) return EMPTY_CART;

  const cart = await db.cart.findUnique({
    where: cartWhereForOwner(owner),
    include: {
      items: {
        orderBy: { createdAt: "asc" },
        include: {
          product: {
            include: {
              images: { take: 1, orderBy: { sortOrder: "asc" } },
            },
          },
          variant: true,
        },
      },
    },
  });

  if (!cart) return EMPTY_CART;

  let subtotal = 0;
  let itemCount = 0;

  const items: CartLineView[] = cart.items.map((item) => {
    const { product, variant } = item;
    const productActive = product.status === "ACTIVE";
    const stock = variant ? variant.stock : product.stock;
    const inStock = stock > 0;
    const isAvailable = productActive && inStock;

    const unitPrice = Number(product.price) + Number(variant?.priceModifier ?? 0);
    const effectiveQuantity = isAvailable ? Math.min(item.quantity, stock) : 0;
    const lineTotal = unitPrice * effectiveQuantity;

    subtotal += lineTotal;
    itemCount += effectiveQuantity;

    let warning: string | null = null;
    if (!productActive) {
      warning = "No longer available";
    } else if (!inStock) {
      warning = "Out of stock";
    } else if (item.quantity > stock) {
      warning = `Only ${stock} left — quantity adjusted`;
    }

    return {
      id: item.id,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      imageUrl: product.images[0]?.url ?? null,
      imageAlt: product.images[0]?.alt ?? null,
      variantId: variant?.id ?? null,
      variantLabel: variant ? `${variant.type}: ${variant.value}` : null,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
      maxQuantity: Math.max(stock, 0),
      isAvailable,
      warning,
    };
  });

  return { cartId: cart.id, items, itemCount, subtotal };
}

export async function getCartItemCount(): Promise<number> {
  const owner = await getCartOwner();
  if (!owner) return 0;

  const result = await db.cartItem.aggregate({
    where: { cart: cartWhereForOwner(owner) },
    _sum: { quantity: true },
  });

  return result._sum.quantity ?? 0;
}
