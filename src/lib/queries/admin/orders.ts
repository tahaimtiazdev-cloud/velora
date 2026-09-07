import "server-only";
import { db } from "@/lib/db";
import type { OrderStatus, Prisma } from "@/generated/prisma/client";
import { ADMIN_PAGE_SIZE, type AdminListParams } from "@/lib/admin/params";

export interface AdminOrderListParams extends AdminListParams {
  status?: OrderStatus;
}

export async function getAdminOrders(params: AdminOrderListParams) {
  const where: Prisma.OrderWhereInput = {
    ...(params.status ? { status: params.status } : {}),
    ...(params.q
      ? {
          OR: [
            { orderNumber: { contains: params.q, mode: "insensitive" } },
            { customerEmail: { contains: params.q, mode: "insensitive" } },
            { customerName: { contains: params.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const totalCount = await db.order.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / ADMIN_PAGE_SIZE));
  const page = Math.min(Math.max(1, params.page), totalPages);

  const orders = await db.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * ADMIN_PAGE_SIZE,
    take: ADMIN_PAGE_SIZE,
    select: {
      id: true,
      orderNumber: true,
      customerName: true,
      customerEmail: true,
      status: true,
      paymentStatus: true,
      total: true,
      createdAt: true,
    },
  });

  return { orders, totalCount, totalPages, page };
}

export async function getAdminOrderById(id: string) {
  return db.order.findUnique({
    where: { id },
    include: { items: true, user: { select: { id: true, email: true } } },
  });
}
