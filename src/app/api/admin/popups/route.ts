import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const popups = await prisma.popup.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, popups });
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
      type: body.type || "NEWSLETTER",
      title: body.title,
      subtitle: body.subtitle || null,
      content: body.content || null,
      imageUrl: body.imageUrl || null,
      couponCode: body.couponCode || null,
      buttonText: body.buttonText || "Subscribe Now",
      buttonUrl: body.buttonUrl || null,
      triggerType: body.triggerType || "DELAY",
      triggerValue: body.triggerValue || "5",
      targetPages: typeof body.targetPages === "object" ? JSON.stringify(body.targetPages) : body.targetPages || "[\"*\"]",
      isEnabled: body.isEnabled !== undefined ? Boolean(body.isEnabled) : true,
    };

    if (body.id) {
      const updated = await prisma.popup.update({
        where: { id: body.id },
        data,
      });
      return NextResponse.json({ success: true, popup: updated });
    } else {
      const created = await prisma.popup.create({ data });
      return NextResponse.json({ success: true, popup: created });
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

    await prisma.popup.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Popup deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
