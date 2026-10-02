"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import QuickBuyModal from "../modals/QuickBuyModal";
import { QuickViewProduct } from "../modals/QuickViewModal";

interface MotionItem {
  id: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  price: number;
  salePrice?: number | null;
  imageUrl: string;
  videoUrl?: string | null;
  linkUrl: string;
}

interface MotionShopSectionProps {
  title?: string | null;
  subtitle?: string | null;
  badge?: string | null;
  items: MotionItem[];
}

export default function MotionShopSection({
  title = "Watch & Shop",
  subtitle = "In-Motion Spotlight — Tap any gadget to order instantly with Cash on Delivery",
  badge = "In Motion",
  items,
}: MotionShopSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeQuickBuy, setActiveQuickBuy] = useState<QuickViewProduct | null>(null);
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({});

  if (!items || items.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (trackRef.current) {
      const offset = direction === "left" ? -280 : 280;
      trackRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const toggleMute = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMutedStates((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  };

  const handleInstantBuy = (item: MotionItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveQuickBuy({
      id: item.id,
      name: item.title,
      slug: item.linkUrl.replace("/products/", "").replace("/shop?category=", ""),
      sku: `M-${item.id.slice(-6).toUpperCase()}`,
      regularPrice: item.price,
      salePrice: item.salePrice,
      images: [{ url: item.imageUrl }],
      stock: 15,
      shortDesc: item.subtitle || "",
    });
  };

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-100">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md mb-1.5 border border-rose-200/60">
              <Zap className="w-3 h-3 text-rose-500 fill-rose-500" />
              <span>{badge || "Reels & In Motion"}</span>
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              {title || "Watch & Shop"}
            </h2>
            {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
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
        </div>

        {/* Motion Product Cards Track */}
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => {
            const isMuted = mutedStates[item.id] !== false; // default muted

            return (
              <div
                key={item.id}
                className="group relative w-64 sm:w-72 h-[420px] rounded-3xl overflow-hidden shrink-0 snap-start bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between p-4"
              >
                {/* Background Media: Video if present, else optimized image */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  {item.videoUrl ? (
                    <video
                      src={item.videoUrl}
                      poster={item.imageUrl}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40" />
                </div>

                {/* Top Badges & Controls */}
                <div className="relative z-10 flex items-center justify-between">
                  {item.badge ? (
                    <span className="px-2.5 py-1 bg-rose-600 text-white font-black text-[10px] rounded-lg uppercase tracking-wider shadow-sm">
                      {item.badge}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-emerald-600 text-white font-black text-[10px] rounded-lg uppercase tracking-wider shadow-sm">
                      Trending
                    </span>
                  )}

                  {/* Sound Toggle Button */}
                  <button
                    onClick={(e) => toggleMute(item.id, e)}
                    className="w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-slate-950 transition-colors shadow-sm"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                </div>

                {/* Center Pulsing Play Icon */}
                <div className="relative z-10 flex items-center justify-center my-auto pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Product Info & 1-Tap Buy */}
                <div className="relative z-10 space-y-2.5 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-white">
                  <div>
                    <Link
                      href={item.linkUrl || "/shop"}
                      className="text-xs sm:text-sm font-black tracking-tight leading-snug hover:text-emerald-300 transition-colors block truncate"
                    >
                      {item.title}
                    </Link>
                    {item.subtitle && (
                      <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-sm sm:text-base font-black text-white block">
                        {formatPrice(item.salePrice || item.price)}
                      </span>
                      {item.salePrice && (
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatPrice(item.price)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleInstantBuy(item, e)}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Zap className="w-3 h-3 fill-slate-950" />
                      <span>Order COD</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Buy Modal for 1-Tap Watch & Shop Checkout */}
      <QuickBuyModal
        isOpen={!!activeQuickBuy}
        onClose={() => setActiveQuickBuy(null)}
        product={activeQuickBuy}
        quantity={1}
      />
    </>
  );
}
