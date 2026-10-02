"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface CategoryPillsSectionProps {
  title?: string | null;
  subtitle?: string | null;
  badge?: string | null;
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export default function CategoryPillsSection({
  title = "Trending Collections",
  subtitle = "Quickly navigate through our most popular lifestyle categories",
  badge = "Popular",
  categories,
}: CategoryPillsSectionProps) {
  const [activeSlug, setActiveSlug] = useState<string>(categories[0]?.slug || "all");

  const defaultPills = [
    { label: "All Items", slug: "all" },
    { label: "Storage & Organizers", slug: "storage-organizers" },
    { label: "Jewelry & Accessories", slug: "jewelry-accessories" },
    { label: "Fashion Bags", slug: "fashion-bags" },
    { label: "Audio & Smartwatches", slug: "smartwatches" },
    { label: "Mobile Accessories", slug: "mobile-accessories" },
    { label: "Home Essentials", slug: "home-living" },
  ];

  const pills = categories.length > 0
    ? [{ label: "All Items", slug: "all" }, ...categories.map(c => ({ label: c.name, slug: c.slug }))]
    : defaultPills;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2">
        <div>
          {badge && (
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1 mb-1 border border-emerald-200/60">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              {badge}
            </span>
          )}
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <Link
          href={`/shop${activeSlug !== "all" ? `?category=${activeSlug}` : ""}`}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>Explore Category</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Scrollable Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {pills.map((pill) => {
          const isActive = activeSlug === pill.slug;
          return (
            <Link
              key={pill.slug}
              href={`/shop${pill.slug !== "all" ? `?category=${pill.slug}` : ""}`}
              onClick={() => setActiveSlug(pill.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm shadow-slate-900/20"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {pill.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
