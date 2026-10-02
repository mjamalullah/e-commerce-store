import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

// GET: List products
export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);

    const where: any = { isArchived: false };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { tags: { contains: search } },
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } },
          brand: { select: { id: true, name: true } },
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Unauthorized" },
      { status: 401 }
    );
  }
}

// POST: Create product
export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const {
      name,
      sku,
      barcode,
      shortDesc,
      description,
      regularPrice,
      salePrice,
      costPrice,
      stock,
      lowStockAlert = 5,
      categoryId,
      brandId,
      warranty,
      tags,
      isFeatured = false,
      isBestSeller = false,
      isNewArrival = true,
      images = [],
      specifications = [],
      variants = [],
      metaTitle,
      metaDescription,
    } = body;

    if (!name || !sku || !regularPrice) {
      return NextResponse.json(
        { success: false, message: "Product Name, SKU, and Regular Price are required" },
        { status: 400 }
      );
    }

    // Check SKU uniqueness
    const existingSku = await prisma.product.findUnique({ where: { sku: sku.trim() } });
    if (existingSku) {
      return NextResponse.json(
        { success: false, message: `SKU "${sku}" is already in use by another product` },
        { status: 400 }
      );
    }

    // Generate unique slug
    let baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: name.trim(),
          slug,
          sku: sku.trim(),
          barcode: barcode?.trim() || null,
          shortDesc: shortDesc?.trim() || null,
          description: description || "",
          regularPrice: parseFloat(regularPrice),
          salePrice: salePrice ? parseFloat(salePrice) : null,
          costPrice: costPrice ? parseFloat(costPrice) : null,
          stock: parseInt(stock || "0", 10),
          lowStockAlert: parseInt(lowStockAlert || "5", 10),
          categoryId: categoryId || null,
          brandId: brandId || null,
          warranty: warranty?.trim() || null,
          tags: tags?.trim() || null,
          isFeatured: Boolean(isFeatured),
          isBestSeller: Boolean(isBestSeller),
          isNewArrival: Boolean(isNewArrival),
          metaTitle: metaTitle?.trim() || name.trim(),
          metaDescription: metaDescription?.trim() || shortDesc?.trim() || null,
        },
      });

      // Images
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          await tx.productImage.create({
            data: {
              productId: created.id,
              url: images[i].url,
              alt: images[i].alt || name,
              sortOrder: i,
              isPrimary: i === 0,
            },
          });
        }
      }

      // Specs
      if (specifications && specifications.length > 0) {
        for (let i = 0; i < specifications.length; i++) {
          if (specifications[i].name && specifications[i].value) {
            await tx.productSpecification.create({
              data: {
                productId: created.id,
                name: specifications[i].name.trim(),
                value: specifications[i].value.trim(),
                sortOrder: i,
              },
            });
          }
        }
      }

      // Variants
      if (variants && variants.length > 0) {
        for (const v of variants) {
          if (v.title && v.sku) {
            await tx.productVariant.create({
              data: {
                productId: created.id,
                title: v.title,
                sku: v.sku.trim(),
                price: parseFloat(v.price || regularPrice),
                salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
                stock: parseInt(v.stock || "0", 10),
                image: v.image || null,
                attributes: typeof v.attributes === "string" ? v.attributes : JSON.stringify(v.attributes || {}),
              },
            });
          }
        }
      }

      // Initial Inventory Movement
      if (parseInt(stock || "0", 10) > 0) {
        await tx.inventoryMovement.create({
          data: {
            productId: created.id,
            type: "RESTOCK",
            quantity: parseInt(stock, 10),
            previousStock: 0,
            newStock: parseInt(stock, 10),
            reason: "Initial Product Creation",
          },
        });
      }

      return created;
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      productId: product.id,
      slug: product.slug,
    });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
