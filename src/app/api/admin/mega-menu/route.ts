import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const menus = await prisma.megaMenu.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, menus });
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
      slug: (body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, ""),
      columnsCount: body.columnsCount || 4,
      content: typeof body.content === "object" ? JSON.stringify(body.content) : body.content || "[]",
      sortOrder: body.sortOrder !== undefined ? parseInt(body.sortOrder) : 0,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    };

    if (body.id) {
      const updated = await prisma.megaMenu.update({
        where: { id: body.id },
        data,
      });
      return NextResponse.json({ success: true, menu: updated });
    } else {
      const created = await prisma.megaMenu.create({ data });
      return NextResponse.json({ success: true, menu: created });
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

    await prisma.megaMenu.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Mega menu deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
