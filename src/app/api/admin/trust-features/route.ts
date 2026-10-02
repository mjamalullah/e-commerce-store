import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const features = await prisma.trustFeature.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, features });
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
      description: body.description,
      iconName: body.iconName || "ShieldCheck",
      sortOrder: body.sortOrder !== undefined ? parseInt(body.sortOrder) : 0,
      isEnabled: body.isEnabled !== undefined ? Boolean(body.isEnabled) : true,
    };

    if (body.id) {
      const updated = await prisma.trustFeature.update({
        where: { id: body.id },
        data,
      });
      return NextResponse.json({ success: true, feature: updated });
    } else {
      const created = await prisma.trustFeature.create({ data });
      return NextResponse.json({ success: true, feature: created });
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
      return NextResponse.json({ success: false, error: "Missing feature ID" }, { status: 400 });
    }

    await prisma.trustFeature.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Trust feature deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
