import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "products" or "orders"

    if (type === "orders") {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { items: true },
      });

      const header = "Order Number,Customer Name,Phone,City,Status,Payment,Items Count,Total (PKR),Date\n";
      const rows = orders.map((o) =>
        `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.shippingCity}","${o.orderStatus}","${o.paymentMethod}",${o.items.length},${o.total},"${o.createdAt.toISOString()}"`
      );

      return new Response(header + rows.join("\n"), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="orders_export_${Date.now()}.csv"`,
        },
      });
    }

    // Default products export
    const products = await prisma.product.findMany({
      include: { category: true, brand: true },
      orderBy: { createdAt: "desc" },
    });

    const header = "Name,SKU,Category,Brand,Regular Price,Sale Price,Cost Price,Stock,Published\n";
    const rows = products.map((p) =>
      `"${p.name.replace(/"/g, '""')}","${p.sku}","${p.category?.name || ""}","${p.brand?.name || ""}",${p.regularPrice},${p.salePrice || ""},${p.costPrice || ""},${p.stock},${p.isPublished}`
    );

    return new Response(header + rows.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="products_export_${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const { action, updates } = await req.json();

    if (action === "bulk_price_update" && Array.isArray(updates)) {
      // updates: [{ id, salePrice, regularPrice }]
      for (const item of updates) {
        await prisma.product.update({
          where: { id: item.id },
          data: {
            regularPrice: item.regularPrice ? parseFloat(item.regularPrice) : undefined,
            salePrice: item.salePrice !== undefined ? (item.salePrice ? parseFloat(item.salePrice) : null) : undefined,
          },
        });
      }
      return NextResponse.json({ success: true, message: `Updated ${updates.length} products successfully` });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
