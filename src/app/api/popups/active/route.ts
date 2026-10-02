import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const popups = await prisma.popup.findMany({
      where: { isEnabled: true },
    });
    return NextResponse.json({ success: true, popups });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
