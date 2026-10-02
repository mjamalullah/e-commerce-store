import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const pages = await prisma.visualPage.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ success: true, pages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const slug = (body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");

    // Check duplicate slug
    const existing = await prisma.visualPage.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `A visual page with slug "${slug}" already exists.` },
        { status: 400 }
      );
    }

    const newPage = await prisma.visualPage.create({
      data: {
        title: body.title,
        slug,
        builderData: typeof body.builderData === "object" ? JSON.stringify(body.builderData) : body.builderData || JSON.stringify({ sections: [] }),
        status: body.status || "DRAFT",
        templateType: body.templateType || "CUSTOM",
        metaTitle: body.metaTitle || body.title,
        metaDescription: body.metaDescription || null,
        isPublished: body.status === "PUBLISHED",
        publishedAt: body.status === "PUBLISHED" ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, page: newPage });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
