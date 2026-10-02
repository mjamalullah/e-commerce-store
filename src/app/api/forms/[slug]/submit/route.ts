import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    const form = await prisma.form.findUnique({
      where: { slug: params.slug },
    });

    if (!form || !form.isActive) {
      return NextResponse.json({ success: false, error: "Form not found or inactive" }, { status: 404 });
    }

    const body = await req.json();

    // Parse fields configuration
    let fieldsConfig: any[] = [];
    try {
      fieldsConfig = JSON.parse(form.fields || "[]");
    } catch {
      fieldsConfig = [];
    }

    // Validate required fields
    for (const field of fieldsConfig) {
      if (field.required && !body[field.name]) {
        return NextResponse.json(
          { success: false, error: `Field "${field.label || field.name}" is required.` },
          { status: 400 }
        );
      }
    }

    // Capture IP and User Agent
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "";

    // 1. Save submission to database
    const submission = await prisma.formSubmission.create({
      data: {
        formId: form.id,
        data: JSON.stringify(body),
        ipAddress,
        userAgent,
      },
    });

    // 2. Log event for marketing & analytics
    await prisma.eventLog.create({
      data: {
        eventName: "form.submitted",
        entityType: "Form",
        entityId: form.id,
        payload: JSON.stringify({
          formSlug: form.slug,
          submissionId: submission.id,
          email: body.email || null,
          phone: body.phone || null,
        }),
        ipAddress,
      },
    });

    // 3. Automated Webhook Dispatch (if configured)
    if (form.webhookUrl) {
      // Fire and forget webhook
      fetch(form.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "form.submitted",
          formName: form.name,
          formSlug: form.slug,
          submissionId: submission.id,
          data: body,
          timestamp: new Date().toISOString(),
        }),
      }).catch((webhookErr) => {
        console.warn("Webhook dispatch error:", webhookErr);
      });
    }

    return NextResponse.json({
      success: true,
      message: form.successMessage || "Thank you! Your submission has been received.",
    });
  } catch (error: any) {
    console.error("Form submission error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
