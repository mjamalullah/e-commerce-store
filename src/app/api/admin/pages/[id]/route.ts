import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const page = await prisma.visualPage.findUnique({
      where: { id: params.id },
    });

    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const body = await req.json();

    const data: any = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.builderData !== undefined) {
      data.builderData = typeof body.builderData === "object" ? JSON.stringify(body.builderData) : body.builderData;
    }
    if (body.status !== undefined) {
      data.status = body.status;
      data.isPublished = body.status === "PUBLISHED";
      if (body.status === "PUBLISHED") {
        data.publishedAt = new Date();
      }
    }
    if (body.templateType !== undefined) data.templateType = body.templateType;
    if (body.metaTitle !== undefined) data.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined) data.metaDescription = body.metaDescription;

    const updated = await prisma.visualPage.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ success: true, page: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await prisma.visualPage.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: "Page deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
