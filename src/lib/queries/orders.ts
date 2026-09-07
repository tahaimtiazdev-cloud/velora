import "server-only";
import { db } from "@/lib/db";

/** Always scoped to a userId resolved server-side from the session —
 * never accept a userId from the client. */
export async function getOrdersForUser(userId: string, take?: number) {
  return db.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      orderNumber: true,
      status: true,
      paymentStatus: true,
      total: true,
      createdAt: true,
    },
  });
}

export async function getOrderCountForUser(userId: string) {
  return db.order.count({ where: { userId } });
}

/** Ownership-scoped order detail — always filtered by the server-resolved
 * userId, so one user can never view another's order by guessing an id. */
export async function getOrderForUser(orderId: string, userId: string) {
  return db.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true },
  });
}

/**
 * Looks up an order by its Stripe Checkout Session id, used only by the
 * post-payment success page to *display* a confirmation — never to create
 * or mutate the order. Returns null until the webhook has finished
 * processing, which the caller must handle by polling briefly.
 */
export async function getOrderBySessionId(sessionId: string) {
  return db.order.findUnique({
    where: { paymentReference: sessionId },
    include: { items: true },
  });
}
