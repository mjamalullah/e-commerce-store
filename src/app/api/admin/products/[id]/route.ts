import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { sortOrder: "asc" } },
        specifications: { orderBy: { sortOrder: "asc" } },
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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
      lowStockAlert,
      categoryId,
      brandId,
      warranty,
      tags,
      isFeatured,
      isBestSeller,
      isNewArrival,
      isPublished,
      images,
      specifications,
      variants,
      metaTitle,
      metaDescription,
    } = body;

    const currentProduct = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!currentProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Check SKU conflict
    if (sku && sku !== currentProduct.sku) {
      const existingSku = await prisma.product.findUnique({ where: { sku } });
      if (existingSku) {
        return NextResponse.json({ success: false, message: "SKU already in use" }, { status: 400 });
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const p = await tx.product.update({
        where: { id: params.id },
        data: {
          name: name ? name.trim() : currentProduct.name,
          sku: sku ? sku.trim() : currentProduct.sku,
          barcode: barcode !== undefined ? barcode : currentProduct.barcode,
          shortDesc: shortDesc !== undefined ? shortDesc : currentProduct.shortDesc,
          description: description !== undefined ? description : currentProduct.description,
          regularPrice: regularPrice !== undefined ? parseFloat(regularPrice) : currentProduct.regularPrice,
          salePrice: salePrice !== undefined ? (salePrice ? parseFloat(salePrice) : null) : currentProduct.salePrice,
          costPrice: costPrice !== undefined ? (costPrice ? parseFloat(costPrice) : null) : currentProduct.costPrice,
          stock: stock !== undefined ? parseInt(stock, 10) : currentProduct.stock,
          lowStockAlert: lowStockAlert !== undefined ? parseInt(lowStockAlert, 10) : currentProduct.lowStockAlert,
          categoryId: categoryId !== undefined ? categoryId : currentProduct.categoryId,
          brandId: brandId !== undefined ? brandId : currentProduct.brandId,
          warranty: warranty !== undefined ? warranty : currentProduct.warranty,
          tags: tags !== undefined ? tags : currentProduct.tags,
          isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : currentProduct.isFeatured,
          isBestSeller: isBestSeller !== undefined ? Boolean(isBestSeller) : currentProduct.isBestSeller,
          isNewArrival: isNewArrival !== undefined ? Boolean(isNewArrival) : currentProduct.isNewArrival,
          isPublished: isPublished !== undefined ? Boolean(isPublished) : currentProduct.isPublished,
          metaTitle: metaTitle !== undefined ? metaTitle : currentProduct.metaTitle,
          metaDescription: metaDescription !== undefined ? metaDescription : currentProduct.metaDescription,
        },
      });

      // Update images if provided
      if (images && Array.isArray(images)) {
        await tx.productImage.deleteMany({ where: { productId: params.id } });
        for (let i = 0; i < images.length; i++) {
          await tx.productImage.create({
            data: {
              productId: params.id,
              url: images[i].url,
              alt: images[i].alt || p.name,
              sortOrder: i,
              isPrimary: i === 0,
            },
          });
        }
      }

      // Update specifications if provided
      if (specifications && Array.isArray(specifications)) {
        await tx.productSpecification.deleteMany({ where: { productId: params.id } });
        for (let i = 0; i < specifications.length; i++) {
          if (specifications[i].name && specifications[i].value) {
            await tx.productSpecification.create({
              data: {
                productId: params.id,
                name: specifications[i].name.trim(),
                value: specifications[i].value.trim(),
                sortOrder: i,
              },
            });
          }
        }
      }

      // Update variants if provided
      if (variants && Array.isArray(variants)) {
        await tx.productVariant.deleteMany({ where: { productId: params.id } });
        for (const v of variants) {
          if (v.title && v.sku) {
            await tx.productVariant.create({
              data: {
                productId: params.id,
                title: v.title,
                sku: v.sku.trim(),
                price: parseFloat(v.price || p.regularPrice),
                salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
                stock: parseInt(v.stock || "0", 10),
                image: v.image || null,
                attributes: typeof v.attributes === "string" ? v.attributes : JSON.stringify(v.attributes || {}),
              },
            });
          }
        }
      }

      return p;
    });

    return NextResponse.json({ success: true, message: "Product updated successfully", product: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: "Product deleted permanently" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
