import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchaseBox from "@/components/product/ProductPurchaseBox";
import ProductReviewsSection from "@/components/product/ProductReviewsSection";
import ProductCard from "@/components/product/ProductCard";
import { getStoreSettings } from "@/lib/settings";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: { where: { isPrimary: true }, take: 1 } },
  });

  if (!product) return { title: "Product Not Found" };

  const settings = await getStoreSettings();
  const primaryImg = product.images[0]?.url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80";

  return {
    title: `${product.name} | Best Price in Pakistan`,
    description: product.shortDesc || `Buy ${product.name} at wholesale price with cash on delivery across Pakistan.`,
    openGraph: {
      title: `${product.name} - ${settings.storeName}`,
      description: product.shortDesc || `Buy ${product.name} in Pakistan. 100% Original, Cash on Delivery available.`,
      images: [{ url: primaryImg, width: 800, height: 800, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDesc || "",
      images: [primaryImg],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const settings = await getStoreSettings();

  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      brand: true,
      images: { orderBy: { sortOrder: "asc" } },
      specifications: { orderBy: { sortOrder: "asc" } },
      variants: { where: { isActive: true } },
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  // Fetch Related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      isPublished: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      brand: { select: { name: true } },
    },
  });

  // JSON-LD structured data for Google & SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((img) => img.url),
    description: product.shortDesc || product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand?.name || "Apex",
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_APP_URL || "https://apexgadgets.pk"}/products/${product.slug}`,
      priceCurrency: "PKR",
      price: product.salePrice || product.regularPrice,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-emerald-600">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Hero Info (Gallery + Purchase Box) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Interactive Image Gallery */}
          <div className="lg:col-span-6">
            <ProductGallery images={product.images} title={product.name} />
          </div>

          {/* Right: Product Details & Buying Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              {product.brand && (
                <Link
                  href={`/shop?brand=${product.brand.slug}`}
                  className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2"
                >
                  {product.brand.name}
                </Link>
              )}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
                {product.name}
              </h1>

              {product.shortDesc && (
                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                  {product.shortDesc}
                </p>
              )}
            </div>

            {/* Buying box (handles variants, quantity, prices, cart, Buy Now, and WhatsApp) */}
            <ProductPurchaseBox
              product={product}
              whatsappNumber={settings.whatsappNumber}
            />
          </div>
        </div>

        {/* Specifications and Detailed Description */}
        <div className="pt-8 border-t border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Description Body */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wider">
                Product Overview
              </h2>
              <div className="prose prose-sm prose-slate max-w-none text-slate-700 whitespace-pre-line leading-relaxed">
                {product.description}
              </div>
            </div>

            {/* Technical Specifications Table */}
            {product.specifications.length > 0 && (
              <div className="lg:col-span-5 space-y-4">
                <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wider">
                  Technical Specifications
                </h2>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100 text-xs">
                  {product.specifications.map((spec) => (
                    <div key={spec.id} className="p-3.5 flex justify-between gap-4">
                      <span className="font-semibold text-slate-500">{spec.name}</span>
                      <span className="font-bold text-slate-900 text-right">{spec.value}</span>
                    </div>
                  ))}
                  {product.warranty && (
                    <div className="p-3.5 flex justify-between gap-4 bg-emerald-50/50">
                      <span className="font-semibold text-emerald-800">Warranty Support</span>
                      <span className="font-bold text-emerald-900 text-right">{product.warranty}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Verified Customer Reviews */}
        <div className="pt-8 border-t border-slate-200">
          <ProductReviewsSection
            productId={product.id}
            initialReviews={product.reviews}
          />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-slate-200 space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  id={rel.id}
                  name={rel.name}
                  slug={rel.slug}
                  sku={rel.sku}
                  regularPrice={rel.regularPrice}
                  salePrice={rel.salePrice}
                  image={rel.images[0]?.url}
                  brandName={rel.brand?.name}
                  stock={rel.stock}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
