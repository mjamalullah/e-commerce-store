import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const slides = await prisma.heroSlide.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, slides });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    if (body.id) {
      // Update
      const updated = await prisma.heroSlide.update({
        where: { id: body.id },
        data: {
          heading: body.heading,
          subheading: body.subheading,
          badge: body.badge,
          buttonText: body.buttonText || "Shop Now",
          buttonUrl: body.buttonUrl || "/shop",
          desktopImage: body.desktopImage,
          mobileImage: body.mobileImage,
          textAlignment: body.textAlignment || "left",
          sortOrder: body.sortOrder !== undefined ? body.sortOrder : 0,
          isActive: body.isActive !== undefined ? body.isActive : true,
        },
      });
      return NextResponse.json({ success: true, slide: updated });
    } else {
      // Create
      const created = await prisma.heroSlide.create({
        data: {
          heading: body.heading,
          subheading: body.subheading,
          badge: body.badge,
          buttonText: body.buttonText || "Shop Now",
          buttonUrl: body.buttonUrl || "/shop",
          desktopImage: body.desktopImage,
          mobileImage: body.mobileImage,
          textAlignment: body.textAlignment || "left",
          sortOrder: body.sortOrder !== undefined ? body.sortOrder : 0,
          isActive: body.isActive !== undefined ? body.isActive : true,
        },
      });
      return NextResponse.json({ success: true, slide: created });
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
      return NextResponse.json({ success: false, error: "Missing slide ID" }, { status: 400 });
    }

    await prisma.heroSlide.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Slide deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
