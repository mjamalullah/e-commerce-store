import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { productId, customerName, customerEmail, rating, title, comment } = await req.json();

    if (!productId || !customerName || !rating || !comment) {
      return NextResponse.json(
        { success: false, message: "Name, rating, and review comments are required" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId,
        customerName: customerName.trim(),
        customerEmail: customerEmail?.trim() || null,
        rating: Math.max(1, Math.min(5, parseInt(rating, 10))),
        title: title?.trim() || null,
        comment: comment.trim(),
        status: "APPROVED", // Auto-approved or set to PENDING based on store preference
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your review has been submitted.",
      review,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
