import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const carts = await prisma.abandonedCart.findMany({
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ success: true, carts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, status } = body;

    const updated = await prisma.abandonedCart.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, cart: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
