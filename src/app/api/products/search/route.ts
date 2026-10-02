import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";
    const limit = parseInt(searchParams.get("limit") || "8", 10);

    if (!query || query.length < 2) {
      return NextResponse.json({ success: true, products: [], categories: [] });
    }

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          isPublished: true,
          OR: [
            { name: { contains: query } },
            { sku: { contains: query } },
            { tags: { contains: query } },
            { shortDesc: { contains: query } },
          ],
        },
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          category: {
            select: { name: true, slug: true },
          },
        },
        take: limit,
      }),
      prisma.category.findMany({
        where: {
          isActive: true,
          name: { contains: query },
        },
        take: 4,
      }),
    ]);

    const formattedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      regularPrice: p.regularPrice,
      salePrice: p.salePrice,
      image: p.images[0]?.url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80",
      categoryName: p.category?.name || "General",
      inStock: p.stock > 0,
    }));

    return NextResponse.json({
      success: true,
      products: formattedProducts,
      categories,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, products: [], categories: [] });
  }
}
