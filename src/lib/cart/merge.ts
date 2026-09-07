import "server-only";
import { db } from "@/lib/db";
import { clearCartToken, getCartToken } from "@/lib/cart/session";
import { resolveCartLine } from "@/lib/cart/resolve";

/**
 * Called immediately after a successful login or registration. If the
 * visitor had a guest cart, folds it into their account cart:
 *
 * - No existing user cart: the guest cart is simply reassigned to them.
 * - Existing user cart: quantities are summed per product/variant and
 *   clamped to current authoritative stock (never trusting the guest
 *   cart's stale quantities), matching the spec's example — guest qty 2
 *   + account qty 3 merges to min(5, availableStock).
 * - A guest line whose product/variant is no longer active or in stock
 *   is dropped rather than merged (revalidated, not trusted).
 *
 * Either way the guest cookie is cleared afterward so a stale token
 * can't be reused.
 */
export async function mergeGuestCartIntoUserCart(userId: string): Promise<void> {
  const guestToken = await getCartToken();
  if (!guestToken) return;

  const guestCart = await db.cart.findUnique({
    where: { sessionToken: guestToken },
    include: { items: true },
  });

  if (!guestCart) {
    await clearCartToken();
    return;
  }

  if (guestCart.items.length === 0) {
    await db.cart.delete({ where: { id: guestCart.id } }).catch(() => {});
    await clearCartToken();
    return;
  }

  await db.$transaction(async (tx) => {
    const userCart = await tx.cart.findUnique({ where: { userId } });

    if (!userCart) {
      // No account cart yet — the guest cart becomes the account cart.
      await tx.cart.update({
        where: { id: guestCart.id },
        data: { userId, sessionToken: null },
      });
      return;
    }

    for (const guestItem of guestCart.items) {
      const resolved = await resolveCartLine(guestItem.productId, guestItem.variantId ?? undefined);
      if (!resolved.ok) continue;

      const existing = await tx.cartItem.findFirst({
        where: {
          cartId: userCart.id,
          productId: guestItem.productId,
          variantId: guestItem.variantId,
        },
      });

      const mergedQuantity = Math.min(
        (existing?.quantity ?? 0) + guestItem.quantity,
        resolved.availableStock
      );
      if (mergedQuantity <= 0) continue;

      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: mergedQuantity },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: guestItem.productId,
            variantId: guestItem.variantId,
            quantity: mergedQuantity,
          },
        });
      }
    }

    await tx.cart.delete({ where: { id: guestCart.id } });
  });

  await clearCartToken();
}
