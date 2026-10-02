import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  _count?: {
    products: number;
  };
}

interface CategoriesGridProps {
  title?: string | null;
  subtitle?: string | null;
  categories: CategoryData[];
}

export default function CategoriesGrid({
  title = "Shop By Categories",
  subtitle = "Explore our verified collection of smart electronics & accessories",
  categories,
}: CategoriesGridProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-end justify-between pb-2 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
            Collections
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {title || "Shop By Categories"}
          </h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <Link
          href="/shop"
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-lg transition-all text-center flex flex-col items-center justify-between"
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-slate-50 mb-3 border border-slate-100 group-hover:scale-105 transition-transform duration-300">
              <Image
                src={
                  cat.image ||
                  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80"
                }
                alt={cat.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                {cat.name}
              </h3>
              {cat._count?.products !== undefined && (
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  {cat._count.products} Products
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
