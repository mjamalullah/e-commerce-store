"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, ArrowRight, Flame } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

interface FlashSaleProps {
  title?: string | null;
  subtitle?: string | null;
  badge?: string | null;
  products: any[];
}

export default function FlashSaleSection({
  title = "⚡ Flash Deals of the Week",
  subtitle = "Special wholesale discounted prices on high demand smart accessories.",
  badge = "Limited Stock Offer",
  products,
}: FlashSaleProps) {
  // Safe countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: "02",
    hours: "14",
    mins: "35",
    secs: "42",
  });

  useEffect(() => {
    // End date 3 days in future from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    targetDate.setHours(targetDate.getHours() + 14);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        mins: String(m).padStart(2, "0"),
        secs: String(s).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl border border-emerald-900/40">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>{badge || "Limited Stock Offer"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {title}
            </h2>
            {subtitle && <p className="text-xs sm:text-sm text-slate-300">{subtitle}</p>}
          </div>

          {/* Countdown & Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-center text-xs font-bold shrink-0">
              <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
                <span className="text-lg font-black text-amber-300 block">{timeLeft.days}</span>
                <span className="text-[10px] text-slate-300 uppercase">Days</span>
              </div>
              <span className="text-lg font-bold text-slate-400">:</span>
              <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
                <span className="text-lg font-black text-amber-300 block">{timeLeft.hours}</span>
                <span className="text-[10px] text-slate-300 uppercase">Hours</span>
              </div>
              <span className="text-lg font-bold text-slate-400">:</span>
              <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
                <span className="text-lg font-black text-amber-300 block">{timeLeft.mins}</span>
                <span className="text-[10px] text-slate-300 uppercase">Mins</span>
              </div>
              <span className="text-lg font-bold text-slate-400">:</span>
              <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
                <span className="text-lg font-black text-amber-300 block">{timeLeft.secs}</span>
                <span className="text-[10px] text-slate-300 uppercase">Secs</span>
              </div>
            </div>

            <Link
              href="/shop"
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md shrink-0"
            >
              <span>View All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Flash Sale Product Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
      </div>
    </section>
  );
}
