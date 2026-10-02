import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const scripts = await prisma.customScript.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, scripts });
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
      location: body.location || "HEAD",
      code: body.code,
      isEnabled: body.isEnabled !== undefined ? Boolean(body.isEnabled) : true,
    };

    if (body.id) {
      const updated = await prisma.customScript.update({
        where: { id: body.id },
        data,
      });
      return NextResponse.json({ success: true, script: updated });
    } else {
      const created = await prisma.customScript.create({ data });
      return NextResponse.json({ success: true, script: created });
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

    await prisma.customScript.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Script deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
