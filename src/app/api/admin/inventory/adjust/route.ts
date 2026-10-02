import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { productId, variantId, newStock, reason = "Stock Adjustment" } = body;

    if (!productId || newStock === undefined) {
      return NextResponse.json(
        { success: false, message: "Product ID and new stock value are required" },
        { status: 400 }
      );
    }

    const parsedStock = parseInt(newStock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      return NextResponse.json(
        { success: false, message: "Valid stock number >= 0 is required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      let previousStock = 0;
      let quantityDelta = 0;

      if (variantId) {
        const variant = await tx.productVariant.findUnique({ where: { id: variantId } });
        if (!variant) throw new Error("Variant not found");
        previousStock = variant.stock;
        quantityDelta = parsedStock - previousStock;

        await tx.productVariant.update({
          where: { id: variantId },
          data: { stock: parsedStock },
        });

        await tx.inventoryMovement.create({
          data: {
            productId,
            variantId,
            type: quantityDelta >= 0 ? "RESTOCK" : "ADJUSTMENT",
            quantity: quantityDelta,
            previousStock,
            newStock: parsedStock,
            reason: `${reason} (by ${admin.name})`,
          },
        });
      } else {
        const product = await tx.product.findUnique({ where: { id: productId } });
        if (!product) throw new Error("Product not found");
        previousStock = product.stock;
        quantityDelta = parsedStock - previousStock;

        await tx.product.update({
          where: { id: productId },
          data: { stock: parsedStock },
        });

        await tx.inventoryMovement.create({
          data: {
            productId,
            type: quantityDelta >= 0 ? "RESTOCK" : "ADJUSTMENT",
            quantity: quantityDelta,
            previousStock,
            newStock: parsedStock,
            reason: `${reason} (by ${admin.name})`,
          },
        });
      }

      return { previousStock, newStock: parsedStock };
    });

    return NextResponse.json({
      success: true,
      message: `Stock updated successfully from ${result.previousStock} to ${result.newStock}`,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
