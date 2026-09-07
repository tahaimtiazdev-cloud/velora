"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { db } from "@/lib/db";
import type { AdminActionResult } from "@/lib/actions/admin/products";

const orderStatusSchema = z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]);

/**
 * Admins can only change fulfillment status (OrderStatus) — never
 * paymentStatus, which is driven exclusively by verified Stripe webhook
 * events and must never be settable by hand.
 */
export async function updateOrderStatusAction(orderId: string, status: string): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = orderStatusSchema.safeParse(status);
  if (!parsed.success) {
    return { success: false, error: "Invalid order status." };
  }

  const existing = await db.order.findUnique({ where: { id: orderId }, select: { id: true } });
  if (!existing) {
    return { success: false, error: "Order not found." };
  }

  try {
    await db.order.update({ where: { id: orderId }, data: { status: parsed.data } });
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Something went wrong updating the order." };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/account/orders");
  return { success: true };
}
