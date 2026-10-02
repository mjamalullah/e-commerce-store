import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const flashSales = await prisma.flashSale.findMany({
      orderBy: { startDate: "desc" },
    });
    return NextResponse.json({ success: true, flashSales });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const data = {
      name: body.name,
      badge: body.badge || "Limited Offer",
      discountPercentage: body.discountPercentage ? parseFloat(body.discountPercentage) : null,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      productIds: typeof body.productIds === "object" ? JSON.stringify(body.productIds) : body.productIds || "[]",
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    };

    if (body.id) {
      const updated = await prisma.flashSale.update({
        where: { id: body.id },
        data,
      });
      return NextResponse.json({ success: true, flashSale: updated });
    } else {
      const created = await prisma.flashSale.create({ data });
      return NextResponse.json({ success: true, flashSale: created });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    await prisma.flashSale.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Flash sale deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
