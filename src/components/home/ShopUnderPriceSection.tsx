import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface PriceBadge {
  label: string;
  price: number;
  bgGradient: string;
  borderColor: string;
  textColor: string;
}

const DEFAULT_PRICE_TIERS: PriceBadge[] = [
  { label: "Under Rs. 500", price: 500, bgGradient: "from-amber-500/10 to-orange-500/10", borderColor: "border-amber-200", textColor: "text-amber-800" },
  { label: "Under Rs. 1,000", price: 1000, bgGradient: "from-emerald-500/10 to-teal-500/10", borderColor: "border-emerald-200", textColor: "text-emerald-800" },
  { label: "Under Rs. 1,500", price: 1500, bgGradient: "from-sky-500/10 to-blue-500/10", borderColor: "border-sky-200", textColor: "text-sky-800" },
  { label: "Under Rs. 2,000", price: 2000, bgGradient: "from-indigo-500/10 to-purple-500/10", borderColor: "border-indigo-200", textColor: "text-indigo-800" },
  { label: "Under Rs. 3,000", price: 3000, bgGradient: "from-pink-500/10 to-rose-500/10", borderColor: "border-pink-200", textColor: "text-pink-800" },
  { label: "Under Rs. 5,000", price: 5000, bgGradient: "from-violet-500/10 to-fuchsia-500/10", borderColor: "border-violet-200", textColor: "text-violet-800" },
];

interface ShopUnderPriceSectionProps {
  title?: string | null;
  subtitle?: string | null;
  badge?: string | null;
}

export default function ShopUnderPriceSection({
  title = "Shop By Budget",
  subtitle = "Find high quality verified gadgets and essentials suited to your budget",
  badge = "Budget Friendly",
}: ShopUnderPriceSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-end justify-between pb-2 border-b border-slate-100">
        <div>
          {badge && (
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md inline-flex items-center gap-1 mb-1.5 border border-amber-200/60">
              <Sparkles className="w-3 h-3 text-amber-600" />
              {badge}
            </span>
          )}
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <Link
          href="/shop"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 group"
        >
          <span>All Deals</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {DEFAULT_PRICE_TIERS.map((tier) => (
          <Link
            key={tier.price}
            href={`/shop?maxPrice=${tier.price}`}
            className={`group p-4 rounded-2xl bg-gradient-to-br ${tier.bgGradient} bg-white border ${tier.borderColor} hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col items-center justify-center min-h-[96px]`}
          >
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Affordable
            </span>
            <span className={`text-sm sm:text-base font-black ${tier.textColor} group-hover:scale-105 transition-transform`}>
              {tier.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
