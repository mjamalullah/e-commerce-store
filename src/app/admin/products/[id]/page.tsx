import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        specifications: { orderBy: { sortOrder: "asc" } },
        variants: true,
      },
    }),
    prisma.category.findMany({ where: { isActive: true } }),
    prisma.brand.findMany({ where: { isActive: true } }),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductForm initialData={product} categories={categories} brands={brands} />;
}
