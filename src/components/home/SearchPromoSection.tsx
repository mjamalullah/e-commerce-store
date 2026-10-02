"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Flame, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SearchPromoSectionProps {
  title?: string | null;
  subtitle?: string | null;
}

export default function SearchPromoSection({
  title = "Looking For Something Specific?",
  subtitle = "Search across thousands of certified gadgets, smart devices, and daily lifestyle essentials",
}: SearchPromoSectionProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const popularTags = [
    { name: "Smartwatch", q: "smartwatch" },
    { name: "Wireless Earbuds", q: "earbuds" },
    { name: "Fast Charger", q: "charger" },
    { name: "Power Bank", q: "power bank" },
    { name: "LED Lamp", q: "lamp" },
    { name: "Organizer Box", q: "organizer" },
    { name: "Mini Fan", q: "fan" },
    { name: "Bluetooth Speaker", q: "speaker" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold border border-white/10">
            <Flame className="w-3.5 h-3.5" />
            <span>Instant Product Finder</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {subtitle}
          </p>

          {/* Large Search Bar */}
          <form onSubmit={handleSearch} className="pt-2">
            <div className="relative flex items-center shadow-2xl">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products by title, model, or keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-28 py-3.5 sm:py-4 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-hidden focus:ring-4 focus:ring-emerald-500/30 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Popular Tag Pills */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Trending:</span>
            {popularTags.map((tag) => (
              <Link
                key={tag.name}
                href={`/shop?q=${encodeURIComponent(tag.q)}`}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition-colors border border-white/5"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
