import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const collections = await prisma.collection.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, collections });
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
      image: body.image || null,
      type: body.type || "MANUAL",
      rules: typeof body.rules === "object" ? JSON.stringify(body.rules) : body.rules || "[]",
      productIds: typeof body.productIds === "object" ? JSON.stringify(body.productIds) : body.productIds || "[]",
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      metaTitle: body.metaTitle || body.name,
      metaDescription: body.metaDescription || null,
    };

    if (body.id) {
      const updated = await prisma.collection.update({
        where: { id: body.id },
        data,
      });
      return NextResponse.json({ success: true, collection: updated });
    } else {
      const created = await prisma.collection.create({ data });
      return NextResponse.json({ success: true, collection: created });
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

    await prisma.collection.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Collection deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
