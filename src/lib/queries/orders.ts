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
