import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export interface PromoBannerItem {
  title: string;
  subtitle?: string;
  badge?: string;
  link: string;
  buttonText?: string;
  image: string;
}

interface PromoBannersSectionProps {
  banners: PromoBannerItem[];
}

export default function PromoBannersSection({ banners }: PromoBannersSectionProps) {
  if (!banners || banners.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className={`grid grid-cols-1 ${
          banners.length === 1
            ? "md:grid-cols-1"
            : banners.length === 2
            ? "md:grid-cols-2"
            : "md:grid-cols-3"
        } gap-4 sm:gap-6`}
      >
        {banners.map((b, idx) => (
          <Link
            key={idx}
            href={b.link || "/shop"}
            className="group relative rounded-3xl overflow-hidden min-h-[220px] sm:min-h-[260px] flex flex-col justify-end p-6 sm:p-8 bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300"
          >
            {/* Background Image */}
            <Image
              src={b.image}
              alt={b.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-90"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

            {/* Content */}
            <div className="relative z-10 space-y-3">
              {b.badge && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30 backdrop-blur-xs">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>{b.badge}</span>
                </span>
              )}

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight group-hover:text-emerald-300 transition-colors">
                  {b.title}
                </h3>
                {b.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-md line-clamp-2">
                    {b.subtitle}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  <span>{b.buttonText || "Shop Collection"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
