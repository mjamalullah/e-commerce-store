import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/storage";

export async function GET() {
  try {
    await requireAdmin();
    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, media });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const alt = (formData.get("alt") as string) || "";
    const title = (formData.get("title") as string) || "";
    const caption = (formData.get("caption") as string) || "";
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const upload = await saveUploadedFile(file);

    const mediaRecord = await prisma.media.create({
      data: {
        name: upload.name,
        url: upload.url,
        mimeType: upload.mimeType,
        size: upload.size,
        width: upload.width,
        height: upload.height,
        alt: alt || upload.name,
        title: title || upload.name,
        caption: caption || null,
        folder,
        thumbnailUrl: upload.thumbnailUrl || upload.url,
        smallUrl: upload.smallUrl || upload.url,
        mediumUrl: upload.mediumUrl || upload.url,
        largeUrl: upload.largeUrl || upload.url,
        webpUrl: upload.webpUrl || upload.url,
        avifUrl: upload.avifUrl || upload.url,
      },
    });

    return NextResponse.json({
      success: true,
      message: "File uploaded & optimized successfully",
      media: mediaRecord,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, alt, title, caption } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const updated = await prisma.media.update({
      where: { id },
      data: {
        alt: alt !== undefined ? alt : undefined,
        title: title !== undefined ? title : undefined,
        caption: caption !== undefined ? caption : undefined,
      },
    });

    return NextResponse.json({ success: true, media: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    await prisma.media.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Media deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
