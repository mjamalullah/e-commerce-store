import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const giftCards = await prisma.giftCard.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, giftCards });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const code = (body.code || `GC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`).toUpperCase();
    const value = parseFloat(body.initialValue);

    const giftCard = await prisma.giftCard.create({
      data: {
        code,
        initialValue: value,
        balance: value,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        recipientEmail: body.recipientEmail || null,
        notes: body.notes || null,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, giftCard });
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

    await prisma.giftCard.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Gift card deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
