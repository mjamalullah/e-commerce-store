import React from "react";
import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true } }),
    prisma.brand.findMany({ where: { isActive: true } }),
  ]);

  return <ProductForm categories={categories} brands={brands} />;
}
