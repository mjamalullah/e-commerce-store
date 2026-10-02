import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStoreSettings, saveStoreSettings } from "@/lib/settings";

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const updated = await saveStoreSettings(body);
    return NextResponse.json({
      success: true,
      message: "Store appearance and homepage layout updated successfully",
      settings: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }
}
