import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const form = await prisma.form.findUnique({
      where: { id: params.id },
      include: {
        submissions: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!form) {
      return NextResponse.json({ success: false, error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, form });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const body = await req.json();

    const data: any = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.description !== undefined) data.description = body.description;
    if (body.fields !== undefined) {
      data.fields = typeof body.fields === "object" ? JSON.stringify(body.fields) : body.fields;
    }
    if (body.submitButtonText !== undefined) data.submitButtonText = body.submitButtonText;
    if (body.successMessage !== undefined) data.successMessage = body.successMessage;
    if (body.recipientEmails !== undefined) data.recipientEmails = body.recipientEmails;
    if (body.webhookUrl !== undefined) data.webhookUrl = body.webhookUrl;
    if (body.sendEmailAlert !== undefined) data.sendEmailAlert = body.sendEmailAlert;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    const updated = await prisma.form.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ success: true, form: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await prisma.form.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: "Form deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
