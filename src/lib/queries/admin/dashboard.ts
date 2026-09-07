import "server-only";
import { db } from "@/lib/db";
import { LOW_STOCK_THRESHOLD } from "@/lib/inventory";

export async function getDashboardMetrics() {
  const [revenueAgg, orderCount, productCount, categoryCount, recentOrders, lowStockProducts] =
    await Promise.all([
      db.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
      db.order.count(),
      db.product.count({ where: { status: "ACTIVE" } }),
      db.category.count(),
      db.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, orderNumber: true, customerName: true, total: true, status: true, createdAt: true },
      }),
      db.product.findMany({
        where: { status: "ACTIVE" },
        select: {
          id: true,
          name: true,
          slug: true,
          stock: true,
          variants: { select: { stock: true } },
        },
      }),
    ]);

  const lowStock = lowStockProducts
    .map((p) => ({
      ...p,
      totalStock: p.variants.length > 0 ? p.variants.reduce((sum, v) => sum + v.stock, 0) : p.stock,
    }))
    .filter((p) => p.totalStock <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.totalStock - b.totalStock)
    .slice(0, 5);

  return {
    totalRevenue: Number(revenueAgg._sum.total ?? 0),
    orderCount,
    productCount,
    categoryCount,
    recentOrders,
    lowStock,
  };
}
