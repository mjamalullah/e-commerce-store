import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const items = await prisma.motionProduct.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const data = {
      title: body.title,
      subtitle: body.subtitle,
      badge: body.badge,
      price: parseFloat(body.price),
      salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
      imageUrl: body.imageUrl,
      videoUrl: body.videoUrl || null,
      linkUrl: body.linkUrl || "/shop",
      sortOrder: body.sortOrder !== undefined ? parseInt(body.sortOrder) : 0,
      isEnabled: body.isEnabled !== undefined ? Boolean(body.isEnabled) : true,
    };

    if (body.id) {
      const updated = await prisma.motionProduct.update({
        where: { id: body.id },
        data,
      });
      return NextResponse.json({ success: true, item: updated });
    } else {
      const created = await prisma.motionProduct.create({ data });
      return NextResponse.json({ success: true, item: created });
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
      return NextResponse.json({ success: false, error: "Missing item ID" }, { status: 400 });
    }

    await prisma.motionProduct.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Motion item deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
