"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

interface ProductCarouselProps {
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  viewAllUrl?: string | null;
  products: any[];
}

export default function ProductCarousel({
  title,
  subtitle,
  badge,
  viewAllUrl = "/shop",
  products,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          {badge && (
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
              {badge}
            </span>
          )}
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {viewAllUrl && (
            <Link
              href={viewAllUrl}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group mr-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}

          {/* Carousel Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors shadow-xs cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors shadow-xs cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Track */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-64 sm:w-72 shrink-0 snap-start"
          >
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
    </section>
  );
}
