import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.string().min(1, "Product is required."),
  variantId: z.string().min(1).optional(),
  quantity: z
    .number()
    .int("Quantity must be a whole number.")
    .positive("Quantity must be at least 1."),
});

export const updateCartItemSchema = z.object({
  cartItemId: z.string().min(1, "Cart item is required."),
  quantity: z
    .number()
    .int("Quantity must be a whole number.")
    .positive("Quantity must be at least 1."),
});

export const removeCartItemSchema = z.object({
  cartItemId: z.string().min(1, "Cart item is required."),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type RemoveCartItemInput = z.infer<typeof removeCartItemSchema>;
