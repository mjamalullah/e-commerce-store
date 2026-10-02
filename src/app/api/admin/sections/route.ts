import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const sections = await prisma.homepageSection.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, sections });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const isDraft = body.isDraft ?? true; // Default to draft mode unless explicitly publishing

    // Check if bulk update (e.g. reordering)
    if (body.sections && Array.isArray(body.sections)) {
      const updates = body.sections.map((sec: any) => {
        if (isDraft) {
          return prisma.homepageSection.update({
            where: { id: sec.id },
            data: {
              draftSortOrder: sec.sortOrder,
              draftIsEnabled: sec.isEnabled !== undefined ? sec.isEnabled : undefined,
              isDraftModified: true,
            },
          });
        } else {
          return prisma.homepageSection.update({
            where: { id: sec.id },
            data: {
              sortOrder: sec.sortOrder,
              isEnabled: sec.isEnabled !== undefined ? sec.isEnabled : undefined,
              draftSortOrder: null,
              draftIsEnabled: null,
              isDraftModified: false,
            },
          });
        }
      });
      await prisma.$transaction(updates);
      return NextResponse.json({
        success: true,
        message: isDraft
          ? "Draft order saved. View live preview to test before publishing."
          : "Section order published directly to live storefront!",
      });
    }

    // Single section update
    if (body.id) {
      const configStr =
        body.config !== undefined
          ? typeof body.config === "object"
            ? JSON.stringify(body.config)
            : body.config
          : undefined;

      const dataToUpdate: any = {};
      if (body.title !== undefined) dataToUpdate.title = body.title;
      if (body.subtitle !== undefined) dataToUpdate.subtitle = body.subtitle;
      if (body.badge !== undefined) dataToUpdate.badge = body.badge;
      if (body.viewAllUrl !== undefined) dataToUpdate.viewAllUrl = body.viewAllUrl;

      if (isDraft) {
        if (configStr !== undefined) dataToUpdate.draftConfig = configStr;
        if (body.isEnabled !== undefined) dataToUpdate.draftIsEnabled = body.isEnabled;
        if (body.sortOrder !== undefined) dataToUpdate.draftSortOrder = body.sortOrder;
        dataToUpdate.isDraftModified = true;
      } else {
        if (configStr !== undefined) dataToUpdate.config = configStr;
        if (body.isEnabled !== undefined) dataToUpdate.isEnabled = body.isEnabled;
        if (body.sortOrder !== undefined) dataToUpdate.sortOrder = body.sortOrder;
        dataToUpdate.draftConfig = null;
        dataToUpdate.draftIsEnabled = null;
        dataToUpdate.draftSortOrder = null;
        dataToUpdate.isDraftModified = false;
      }

      const updated = await prisma.homepageSection.update({
        where: { id: body.id },
        data: dataToUpdate,
      });

      return NextResponse.json({
        success: true,
        section: updated,
        isDraft,
        message: isDraft
          ? "Draft changes saved. Click 'Live Preview' to inspect."
          : "Section published live!",
      });
    }

    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const created = await prisma.homepageSection.create({
      data: {
        sectionKey: body.sectionKey,
        type: body.type,
        title: body.title,
        subtitle: body.subtitle,
        badge: body.badge,
        viewAllUrl: body.viewAllUrl,
        config: typeof body.config === "object" ? JSON.stringify(body.config) : body.config || "{}",
        sortOrder: body.sortOrder || 0,
        isEnabled: body.isEnabled !== undefined ? body.isEnabled : true,
      },
    });

    return NextResponse.json({ success: true, section: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
