"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { ensureCartToken, getCartToken } from "@/lib/cart/session";
import { resolveCartLine } from "@/lib/cart/resolve";
import {
  addCartItemSchema,
  removeCartItemSchema,
  updateCartItemSchema,
} from "@/lib/validations/cart";

export interface CartActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

function firstIssueMessage(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Invalid input.";
}

export async function addCartItem(input: {
  productId: string;
  variantId?: string;
  quantity: number;
}): Promise<CartActionResult> {
  const parsed = addCartItemSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstIssueMessage(parsed.error) };
  }
  const { productId, variantId, quantity } = parsed.data;

  const resolved = await resolveCartLine(productId, variantId);
  if (!resolved.ok) {
    return { success: false, error: resolved.error };
  }

  const token = await ensureCartToken();

  try {
    const result = await db.$transaction(async (tx) => {
      const cart = await tx.cart.upsert({
        where: { sessionToken: token },
        update: {},
        create: { sessionToken: token },
      });

      const existing = await tx.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: resolved.productId,
          variantId: resolved.variantId,
        },
      });

      const requestedTotal = (existing?.quantity ?? 0) + quantity;
      const finalQuantity = Math.min(requestedTotal, resolved.availableStock);

      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: finalQuantity },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId: resolved.productId,
            variantId: resolved.variantId,
            quantity: finalQuantity,
          },
        });
      }

      return { finalQuantity, requestedTotal };
    });

    revalidatePath("/", "layout");

    if (result.finalQuantity < result.requestedTotal) {
      return {
        success: true,
        message: `Added — only ${result.finalQuantity} available, so quantity was adjusted.`,
      };
    }
    return { success: true, message: "Added to cart." };
  } catch (error) {
    console.error("addCartItem failed:", error);
    return { success: false, error: "We couldn't add that to your cart. Please try again." };
  }
}

export async function updateCartItemQuantity(input: {
  cartItemId: string;
  quantity: number;
}): Promise<CartActionResult> {
  const parsed = updateCartItemSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstIssueMessage(parsed.error) };
  }
  const { cartItemId, quantity } = parsed.data;

  const token = await getCartToken();
  if (!token) {
    return { success: false, error: "Your cart could not be found." };
  }

  const item = await db.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true, product: true, variant: true },
  });

  // Ownership check: the cart item must belong to *this* session's cart.
  if (!item || item.cart.sessionToken !== token) {
    return { success: false, error: "That item is not in your cart." };
  }

  const resolved = await resolveCartLine(item.productId, item.variantId ?? undefined);
  if (!resolved.ok) {
    return { success: false, error: resolved.error };
  }

  const finalQuantity = Math.min(quantity, resolved.availableStock);

  try {
    await db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: finalQuantity },
    });

    revalidatePath("/", "layout");

    if (finalQuantity < quantity) {
      return {
        success: true,
        message: `Only ${finalQuantity} available — quantity adjusted.`,
      };
    }
    return { success: true };
  } catch (error) {
    console.error("updateCartItemQuantity failed:", error);
    return { success: false, error: "We couldn't update that item. Please try again." };
  }
}

export async function removeCartItem(input: { cartItemId: string }): Promise<CartActionResult> {
  const parsed = removeCartItemSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstIssueMessage(parsed.error) };
  }

  const token = await getCartToken();
  if (!token) {
    return { success: false, error: "Your cart could not be found." };
  }

  const item = await db.cartItem.findUnique({
    where: { id: parsed.data.cartItemId },
    include: { cart: true },
  });

  if (!item || item.cart.sessionToken !== token) {
    return { success: false, error: "That item is not in your cart." };
  }

  try {
    await db.cartItem.delete({ where: { id: item.id } });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("removeCartItem failed:", error);
    return { success: false, error: "We couldn't remove that item. Please try again." };
  }
}

export async function clearCart(): Promise<CartActionResult> {
  const token = await getCartToken();
  if (!token) {
    return { success: true };
  }

  try {
    const cart = await db.cart.findUnique({ where: { sessionToken: token } });
    if (cart) {
      await db.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("clearCart failed:", error);
    return { success: false, error: "We couldn't clear your cart. Please try again." };
  }
}
