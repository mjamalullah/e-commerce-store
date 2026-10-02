import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.trim().toUpperCase();
    const subtotal = parseFloat(searchParams.get("subtotal") || "0");

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired coupon code" },
        { status: 404 }
      );
    }

    if (coupon.startDate && new Date(coupon.startDate) > new Date()) {
      return NextResponse.json(
        { success: false, message: "Coupon is not yet active" },
        { status: 400 }
      );
    }

    if (coupon.endDate && new Date(coupon.endDate) < new Date()) {
      return NextResponse.json(
        { success: false, message: "Coupon has expired" },
        { status: 400 }
      );
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, message: "Coupon usage limit has been reached" },
        { status: 400 }
      );
    }

    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order amount of Rs. ${coupon.minSpend.toLocaleString("en-PK")} is required for this coupon`,
        },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.type === "PERCENTAGE") {
      discount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.type === "FIXED") {
      discount = Math.min(subtotal, coupon.value);
    } else if (coupon.type === "FREE_SHIPPING") {
      discount = 0; // handled in checkout shipping calculation
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description,
      },
      discount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error validating coupon" },
      { status: 500 }
    );
  }
}
