import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    let footer = await prisma.footerConfig.findFirst({
      where: { isDefault: true },
    });

    if (!footer) {
      footer = await prisma.footerConfig.create({
        data: {
          name: "Main Footer",
          aboutText: "Apex Commerce is Pakistan's premier wholesale and direct-to-consumer technology distributor, delivering 100% original AMOLED smartwatches, ANC earbuds, and charging gear.",
          showNewsletter: true,
          columns: JSON.stringify([
            {
              title: "Shop Gadgets",
              links: [
                { label: "Smart Watches", url: "/shop?category=smart-watches" },
                { label: "Wireless Earbuds", url: "/shop?category=wireless-earbuds" },
                { label: "Power Banks", url: "/shop?category=power-banks" },
                { label: "GaN Fast Chargers", url: "/shop?category=fast-chargers-cables" },
              ],
            },
            {
              title: "Customer Support",
              links: [
                { label: "Track Your Order", url: "/track-order" },
                { label: "7-Day Return Policy", url: "/return-policy" },
                { label: "Shipping & Delivery", url: "/shipping-policy" },
                { label: "Warranty Verification", url: "/warranty" },
              ],
            },
            {
              title: "Corporate & Wholesale",
              links: [
                { label: "Wholesale Enquiry", url: "/wholesale" },
                { label: "Corporate Gifting", url: "/corporate" },
                { label: "About Our Hub", url: "/about" },
                { label: "Contact Us", url: "/contact" },
              ],
            },
          ]),
          copyrightText: "© 2026 Apex Commerce Pakistan. All rights reserved. 100% Genuine Technology Products.",
          isDefault: true,
        },
      });
    }

    return NextResponse.json({ success: true, footer });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    let footer = await prisma.footerConfig.findFirst({
      where: { isDefault: true },
    });

    const data: any = {
      name: body.name || "Main Footer",
      aboutText: body.aboutText,
      showNewsletter: body.showNewsletter !== undefined ? Boolean(body.showNewsletter) : true,
      columns: typeof body.columns === "object" ? JSON.stringify(body.columns) : body.columns,
      copyrightText: body.copyrightText,
    };

    if (footer) {
      footer = await prisma.footerConfig.update({
        where: { id: footer.id },
        data,
      });
    } else {
      footer = await prisma.footerConfig.create({
        data: { ...data, isDefault: true },
      });
    }

    return NextResponse.json({ success: true, footer });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
