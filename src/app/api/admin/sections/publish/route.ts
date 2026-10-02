import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    // 1. Fetch current sections to create a version snapshot before publishing
    const currentSections = await prisma.homepageSection.findMany({
      orderBy: { sortOrder: "asc" },
    });
    const currentSlides = await prisma.heroSlide.findMany({
      orderBy: { sortOrder: "asc" },
    });

    // 2. Publish all draft updates to live
    // For each section, if draftConfig exists or isDraftModified, apply draft to live
    for (const sec of currentSections) {
      const newConfig = sec.draftConfig !== null ? sec.draftConfig : sec.config;
      const newSortOrder = sec.draftSortOrder !== null ? sec.draftSortOrder : sec.sortOrder;
      const newIsEnabled = sec.draftIsEnabled !== null ? sec.draftIsEnabled : sec.isEnabled;

      await prisma.homepageSection.update({
        where: { id: sec.id },
        data: {
          config: newConfig,
          sortOrder: newSortOrder,
          isEnabled: newIsEnabled,
          draftConfig: null,
          draftSortOrder: null,
          draftIsEnabled: null,
          isDraftModified: false,
        },
      });
    }

    // 3. Save a version snapshot
    const versionNumber = (await prisma.homepageVersion.count()) + 1;
    const now = new Date();
    const versionName = `v${versionNumber}.0 - Published on ${now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    const version = await prisma.homepageVersion.create({
      data: {
        versionName,
        sectionsJson: JSON.stringify(currentSections),
        slidesJson: JSON.stringify(currentSlides),
        status: "PUBLISHED",
        notes: "Live deployment via Admin Homepage Builder",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Homepage draft successfully published to live storefront!",
      version,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
