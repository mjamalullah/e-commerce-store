import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderNumber")?.trim();
    const phone = searchParams.get("phone")?.trim();

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, message: "Order number is required" },
        { status: 400 }
      );
    }

    const cleanedPhone = phone ? phone.replace(/[^0-9]/g, "") : null;

    const whereClause: any = { orderNumber };
    if (cleanedPhone) {
      whereClause.customerPhone = { contains: cleanedPhone.slice(-9) }; // matches local or +92
    }

    const order = await prisma.order.findFirst({
      where: whereClause,
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "No order found matching the provided details" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        customerName: order.customerName,
        shippingCity: order.shippingCity,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        courierName: order.courierName,
        trackingNumber: order.trackingNumber,
        subtotal: order.subtotal,
        discount: order.discount,
        shippingFee: order.shippingFee,
        total: order.total,
        items: order.items,
        statusHistory: order.statusHistory,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error tracking order" },
      { status: 500 }
    );
  }
}
