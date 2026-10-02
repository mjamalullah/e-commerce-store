import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const bundles = await prisma.productBundle.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, bundles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const slug = (body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");

    const data = {
      name: body.name,
      slug,
      description: body.description || null,
      regularPrice: parseFloat(body.regularPrice) || 0,
      bundlePrice: parseFloat(body.bundlePrice) || 0,
      image: body.image || null,
      productIds: typeof body.productIds === "object" ? JSON.stringify(body.productIds) : body.productIds || "[]",
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    };

    if (body.id) {
      const updated = await prisma.productBundle.update({
        where: { id: body.id },
        data,
      });
      return NextResponse.json({ success: true, bundle: updated });
    } else {
      const created = await prisma.productBundle.create({ data });
      return NextResponse.json({ success: true, bundle: created });
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

    await prisma.productBundle.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Bundle deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
