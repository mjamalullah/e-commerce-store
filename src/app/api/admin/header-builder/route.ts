import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    let header = await prisma.headerConfig.findFirst({
      where: { isDefault: true },
    });

    if (!header) {
      header = await prisma.headerConfig.create({
        data: {
          name: "Main Header",
          layoutType: "DEFAULT",
          sticky: true,
          showAnnouncement: true,
          announcementText: "⚡ Direct Wholesale Hub Pakistan — Free Courier Shipping Over Rs. 3,500!",
          navLinks: JSON.stringify([
            { label: "Home", url: "/" },
            { label: "Smart Watches", url: "/shop?category=smart-watches" },
            { label: "Wireless Earbuds", url: "/shop?category=wireless-earbuds" },
            { label: "GaN Fast Chargers", url: "/shop?category=fast-chargers-cables" },
            { label: "Power Banks", url: "/shop?category=power-banks" },
            { label: "Wholesale Enquiry", url: "/wholesale" },
            { label: "Track Order", url: "/track-order" },
          ]),
          phone: "0321-8273588",
          whatsappNumber: "923218273588",
          isDefault: true,
        },
      });
    }

    return NextResponse.json({ success: true, header });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    let header = await prisma.headerConfig.findFirst({
      where: { isDefault: true },
    });

    const data: any = {
      name: body.name || "Main Header",
      layoutType: body.layoutType || "DEFAULT",
      logoUrl: body.logoUrl || null,
      sticky: body.sticky !== undefined ? Boolean(body.sticky) : true,
      showAnnouncement: body.showAnnouncement !== undefined ? Boolean(body.showAnnouncement) : true,
      announcementText: body.announcementText,
      announcementLink: body.announcementLink,
      navLinks: typeof body.navLinks === "object" ? JSON.stringify(body.navLinks) : body.navLinks,
      phone: body.phone,
      whatsappNumber: body.whatsappNumber,
    };

    if (header) {
      header = await prisma.headerConfig.update({
        where: { id: header.id },
        data,
      });
    } else {
      header = await prisma.headerConfig.create({
        data: { ...data, isDefault: true },
      });
    }

    return NextResponse.json({ success: true, header });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
