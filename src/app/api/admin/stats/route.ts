import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalOrdersCount,
      pendingOrdersCount,
      totalSalesAgg,
      todaySalesAgg,
      totalProductsCount,
      lowStockCount,
      outOfStockCount,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: "PENDING" } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { orderStatus: { not: "CANCELLED" } },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: startOfToday },
          orderStatus: { not: "CANCELLED" },
        },
      }),
      prisma.product.count({ where: { isArchived: false } }),
      prisma.product.count({
        where: {
          stock: { gt: 0, lte: 5 },
          isArchived: false,
        },
      }),
      prisma.product.count({
        where: {
          stock: 0,
          isArchived: false,
        },
      }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: { stock: "desc" },
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: { select: { name: true } },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalSales: totalSalesAgg._sum.total || 0,
        todaySales: todaySalesAgg._sum.total || 0,
        totalOrders: totalOrdersCount,
        pendingOrders: pendingOrdersCount,
        totalProducts: totalProductsCount,
        lowStock: lowStockCount,
        outOfStock: outOfStockCount,
        recentOrders,
        topProducts,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch stats" },
      { status: error.message?.includes("Forbidden") ? 403 : 401 }
    );
  }
}
