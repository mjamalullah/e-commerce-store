import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const redirects = await prisma.redirect.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, redirects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const data = {
      sourceUrl: body.sourceUrl,
      targetUrl: body.targetUrl,
      statusCode: parseInt(body.statusCode) || 301,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    };

    if (body.id) {
      const updated = await prisma.redirect.update({
        where: { id: body.id },
        data,
      });
      return NextResponse.json({ success: true, redirect: updated });
    } else {
      const created = await prisma.redirect.create({ data });
      return NextResponse.json({ success: true, redirect: created });
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

    await prisma.redirect.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Redirect deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
