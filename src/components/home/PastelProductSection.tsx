"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

interface PastelProductSectionProps {
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  viewAllUrl?: string | null;
  products: any[];
  theme?: "cream" | "mint" | "lavender" | "rose" | "blue" | "white";
  layout?: "grid" | "carousel";
}

export default function PastelProductSection({
  title,
  subtitle,
  badge,
  viewAllUrl = "/shop",
  products,
  theme = "white",
  layout = "carousel",
}: PastelProductSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const themeStyles = {
    cream: "bg-[#fefce8]/80 border-amber-200/60",
    mint: "bg-[#f0fdf4]/80 border-emerald-200/60",
    lavender: "bg-[#faf5ff]/80 border-purple-200/60",
    rose: "bg-[#fff1f2]/80 border-rose-200/60",
    blue: "bg-[#f0f9ff]/80 border-sky-200/60",
    white: "bg-white border-transparent",
  };

  const badgeStyles = {
    cream: "text-amber-800 bg-amber-100/80 border-amber-300/60",
    mint: "text-emerald-800 bg-emerald-100/80 border-emerald-300/60",
    lavender: "text-purple-800 bg-purple-100/80 border-purple-300/60",
    rose: "text-rose-800 bg-rose-100/80 border-rose-300/60",
    blue: "text-sky-800 bg-sky-100/80 border-sky-300/60",
    white: "text-emerald-700 bg-emerald-50 border-emerald-200",
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className={`py-8 sm:py-12 border-y ${themeStyles[theme]}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200/60">
          <div>
            {badge && (
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md inline-flex items-center gap-1 mb-1.5 border ${badgeStyles[theme]}`}
              >
                <Sparkles className="w-3 h-3" />
                {badge}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              {title}
            </h2>
            {subtitle && <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {viewAllUrl && (
              <Link
                href={viewAllUrl}
                className="text-xs sm:text-sm font-bold text-slate-800 hover:text-emerald-600 flex items-center gap-1 group mr-1 transition-colors"
              >
                <span>Explore All</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}

            {layout === "carousel" && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scroll("left")}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Display: Carousel or 4-col Grid */}
        {layout === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                sku={product.sku}
                regularPrice={product.regularPrice}
                salePrice={product.salePrice}
                image={product.images?.[0]?.url}
                secondaryImage={product.images?.[1]?.url}
                brandName={product.brand?.name}
                isBestSeller={product.isBestSeller}
                isNewArrival={product.isNewArrival}
                stock={product.stock}
              />
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <div key={product.id} className="w-64 sm:w-72 shrink-0 snap-start">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  sku={product.sku}
                  regularPrice={product.regularPrice}
                  salePrice={product.salePrice}
                  image={product.images?.[0]?.url}
                  secondaryImage={product.images?.[1]?.url}
                  brandName={product.brand?.name}
                  isBestSeller={product.isBestSeller}
                  isNewArrival={product.isNewArrival}
                  stock={product.stock}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
