import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import { SlidersHorizontal, ArrowUpDown, Tag, Check, X } from "lucide-react";

interface ShopPageProps {
  searchParams: {
    category?: string;
    brand?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    page?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, brand, search, sort = "latest", minPrice, maxPrice, inStock, page = "1" } = searchParams;
  const currentPage = parseInt(page, 10) || 1;
  const limit = 12;

  // Build Prisma Where Clause
  const where: any = { isPublished: true, isArchived: false };

  if (category) {
    where.category = { slug: category };
  }
  if (brand) {
    where.brand = { slug: brand };
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { sku: { contains: search } },
      { tags: { contains: search } },
      { description: { contains: search } },
    ];
  }
  if (inStock === "true") {
    where.stock = { gt: 0 };
  }
  if (minPrice || maxPrice) {
    where.regularPrice = {};
    if (minPrice) where.regularPrice.gte = parseFloat(minPrice);
    if (maxPrice) where.regularPrice.lte = parseFloat(maxPrice);
  }

  // Build Sorting
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-low") orderBy = { regularPrice: "asc" };
  if (sort === "price-high") orderBy = { regularPrice: "desc" };
  if (sort === "bestselling") orderBy = { isBestSeller: "desc" };

  const [products, totalProducts, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (currentPage - 1) * limit,
      take: limit,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        brand: { select: { name: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
    }),
  ]);

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title & Breadcrumbs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Shop All Products</span>
          {category && (
            <>
              <span>/</span>
              <span className="text-emerald-700 font-bold uppercase">{category}</span>
            </>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Explore Original Tech Gadgets
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Showing {products.length} of {totalProducts} items available with nationwide Cash on Delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            {/* Clear All Filters */}
            {(category || brand || search || minPrice || maxPrice || inStock) && (
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Active Filters</span>
                <Link
                  href="/shop"
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </Link>
              </div>
            )}

            {/* Categories Filter */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Categories</h3>
              <div className="space-y-1.5 text-xs">
                <Link
                  href={`/shop?${new URLSearchParams({ ...(brand && { brand }), ...(sort && { sort }) }).toString()}`}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                    !category ? "bg-emerald-50 text-emerald-800 font-bold" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>All Categories</span>
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}${brand ? `&brand=${brand}` : ""}${sort ? `&sort=${sort}` : ""}`}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                      category === cat.slug
                        ? "bg-emerald-50 text-emerald-800 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({cat._count.products})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Brands Filter */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Brands</h3>
              <div className="space-y-1.5 text-xs">
                {brands.map((b) => (
                  <Link
                    key={b.id}
                    href={`/shop?brand=${b.slug}${category ? `&category=${category}` : ""}${sort ? `&sort=${sort}` : ""}`}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                      brand === b.slug
                        ? "bg-emerald-50 text-emerald-800 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({b._count.products})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Availability</h3>
              <Link
                href={`/shop?${new URLSearchParams({
                  ...(category && { category }),
                  ...(brand && { brand }),
                  ...(sort && { sort }),
                  inStock: inStock === "true" ? "false" : "true",
                }).toString()}`}
                className="flex items-center gap-2 text-xs text-slate-700 py-1"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    inStock === "true" ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300"
                  }`}
                >
                  {inStock === "true" && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>In Stock Only</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting Bar */}
          <div className="p-3 sm:p-4 bg-white rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-slate-500 font-medium">
              Found <strong className="text-slate-900">{totalProducts}</strong> products
            </span>

            {/* Sorting links */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-slate-400 hidden sm:inline">Sort:</span>
              {[
                { label: "Latest", value: "latest" },
                { label: "Best Selling", value: "bestselling" },
                { label: "Price: Low to High", value: "price-low" },
                { label: "Price: High to Low", value: "price-high" },
              ].map((s) => (
                <Link
                  key={s.value}
                  href={`/shop?${new URLSearchParams({
                    ...(category && { category }),
                    ...(brand && { brand }),
                    ...(search && { search }),
                    sort: s.value,
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    sort === s.value
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
              <p className="text-base font-bold text-slate-800">No products match your filters</p>
              <p className="text-xs text-slate-500">Try removing some filter conditions or search term.</p>
              <Link
                href="/shop"
                className="inline-block px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl mt-2"
              >
                Reset All Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  sku={product.sku}
                  regularPrice={product.regularPrice}
                  salePrice={product.salePrice}
                  image={product.images[0]?.url}
                  brandName={product.brand?.name}
                  isBestSeller={product.isBestSeller}
                  isNewArrival={product.isNewArrival}
                  stock={product.stock}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === currentPage;
                return (
                  <Link
                    key={pageNum}
                    href={`/shop?${new URLSearchParams({
                      ...(category && { category }),
                      ...(brand && { brand }),
                      ...(sort && { sort }),
                      page: pageNum.toString(),
                    }).toString()}`}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
