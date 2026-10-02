import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const forms = await prisma.form.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });
    return NextResponse.json({ success: true, forms });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const slug = (body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");

    const newForm = await prisma.form.create({
      data: {
        name: body.name,
        slug,
        description: body.description || null,
        fields: typeof body.fields === "object" ? JSON.stringify(body.fields) : body.fields || "[]",
        submitButtonText: body.submitButtonText || "Submit",
        successMessage: body.successMessage || "Thank you! Your submission has been received.",
        recipientEmails: body.recipientEmails || null,
        webhookUrl: body.webhookUrl || null,
        sendEmailAlert: body.sendEmailAlert !== undefined ? body.sendEmailAlert : true,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json({ success: true, form: newForm });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
