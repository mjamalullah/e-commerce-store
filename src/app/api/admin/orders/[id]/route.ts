import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getStoreSettings } from "@/lib/settings";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { orderStatus, paymentStatus, courierName, trackingNumber, internalNotes, statusNote } = body;

    const currentOrder = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!currentOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const settings = await getStoreSettings();

    const updated = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: params.id },
        data: {
          orderStatus: orderStatus || currentOrder.orderStatus,
          paymentStatus: paymentStatus || currentOrder.paymentStatus,
          courierName: courierName !== undefined ? courierName : currentOrder.courierName,
          trackingNumber: trackingNumber !== undefined ? trackingNumber : currentOrder.trackingNumber,
          internalNotes: internalNotes !== undefined ? internalNotes : currentOrder.internalNotes,
        },
      });

      // Add to status history if status changed or note provided
      if (orderStatus && orderStatus !== currentOrder.orderStatus) {
        await tx.orderStatusHistory.create({
          data: {
            orderId: params.id,
            status: orderStatus,
            note: statusNote || `Status changed to ${orderStatus} by ${admin.name}`,
            createdBy: admin.name,
          },
        });
      }

      return order;
    });

    // Generate WhatsApp status message text for the admin to copy or send directly to customer
    let whatsappMessage = "";
    if (orderStatus === "CONFIRMED") {
      whatsappMessage = `Salam ${updated.customerName}! Your order *#${updated.orderNumber}* for Rs. ${updated.total.toLocaleString("en-PK")} has been *CONFIRMED*. It is now being packed and prepared for dispatch. - ${settings.storeName}`;
    } else if (orderStatus === "SHIPPED") {
      whatsappMessage = `Salam ${updated.customerName}! Great news! Your order *#${updated.orderNumber}* has been *DISPATCHED* via ${updated.courierName || "Courier"}. Tracking #: ${updated.trackingNumber || "N/A"}. Please keep cash ready: Rs. ${updated.total.toLocaleString("en-PK")}. - ${settings.storeName}`;
    } else if (orderStatus === "DELIVERED") {
      whatsappMessage = `Salam ${updated.customerName}! Your order *#${updated.orderNumber}* has been successfully marked as *DELIVERED*. Thank you for shopping with ${settings.storeName}! Please leave us a review.`;
    }

    const whatsappLink = whatsappMessage
      ? `https://wa.me/${updated.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(whatsappMessage)}`
      : null;

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: updated,
      whatsappLink,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
