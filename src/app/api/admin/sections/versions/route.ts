import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const versions = await prisma.homepageVersion.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json({ success: true, versions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { versionId } = body;

    if (!versionId) {
      return NextResponse.json({ success: false, error: "versionId is required" }, { status: 400 });
    }

    const version = await prisma.homepageVersion.findUnique({
      where: { id: versionId },
    });

    if (!version) {
      return NextResponse.json({ success: false, error: "Version not found" }, { status: 404 });
    }

    const restoredSections: any[] = JSON.parse(version.sectionsJson || "[]");

    // Restore each section's config, sortOrder, isEnabled into draft (or live)
    for (const sec of restoredSections) {
      if (sec.id) {
        await prisma.homepageSection.update({
          where: { id: sec.id },
          data: {
            draftConfig: sec.config,
            draftSortOrder: sec.sortOrder,
            draftIsEnabled: sec.isEnabled,
            isDraftModified: true,
          },
        }).catch(() => {
          // If section was deleted, ignore or continue
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Version "${version.versionName}" restored into draft mode. You can preview it now!`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
