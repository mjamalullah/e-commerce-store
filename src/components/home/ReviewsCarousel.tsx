"use client";

import React, { useRef } from "react";
import { Star, ShieldCheck, ChevronLeft, ChevronRight, Quote } from "lucide-react";

export interface ReviewItem {
  id: string;
  customerName: string;
  rating: number;
  title?: string | null;
  comment: string;
  isVerifiedPurchase?: boolean;
  createdAt?: string | Date;
  product?: {
    name: string;
    slug: string;
  } | null;
}

interface ReviewsCarouselProps {
  title?: string | null;
  subtitle?: string | null;
  reviews: ReviewItem[];
}

export default function ReviewsCarousel({
  title = "What Our Verified Clients Say",
  subtitle = "Honest customer feedback from across Karachi, Lahore, Islamabad, and nationwide",
  reviews,
}: ReviewsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!reviews || reviews.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Customer Feedback</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
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

      {/* Review Cards Track */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {reviews.map((rev) => {
          const initials = rev.customerName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

          return (
            <div
              key={rev.id}
              className="w-80 sm:w-96 shrink-0 snap-start bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top: Stars & Quote icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rev.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200 fill-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-200" />
                </div>

                {/* Review Title */}
                {rev.title && (
                  <h4 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                    {rev.title}
                  </h4>
                )}

                {/* Review Text */}
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                {/* Mentioned Product */}
                {rev.product && (
                  <div className="mt-3 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block font-semibold">
                    Product: {rev.product.name}
                  </div>
                )}
              </div>

              {/* Customer Info Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {initials || "U"}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      {rev.customerName}
                    </h5>
                    <p className="text-[10px] text-slate-400">
                      Verified Buyer • Pakistan
                    </p>
                  </div>
                </div>

                {rev.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
