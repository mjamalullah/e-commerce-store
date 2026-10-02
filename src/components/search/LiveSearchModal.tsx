"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface LiveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveSearchModal({ isOpen, onClose }: LiveSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setCategories([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        if (data.success) {
          setResults(data.products || []);
          setCategories(data.categories || []);
        }
      } catch (e) {
        console.error("Search error", e);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search smartwatches, earbuds, chargers, brands..."
            className="flex-1 text-base text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {isLoading && <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto flex-1 p-4">
          {query.trim().length >= 2 && results.length === 0 && !isLoading && (
            <div className="py-12 text-center text-slate-500">
              <p className="font-medium text-slate-700">No products found for &quot;{query}&quot;</p>
              <p className="text-sm mt-1">Try searching with a broader keyword (e.g. &quot;watch&quot;, &quot;anker&quot;, &quot;earbuds&quot;)</p>
            </div>
          )}

          {/* Categories matches */}
          {categories.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Categories</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    onClick={onClose}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-xs font-medium text-slate-700 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Product Items */}
          {results.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Products</p>
              <div className="divide-y divide-slate-100">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 py-2.5 px-2 hover:bg-slate-50 rounded-xl transition-colors group"
                  >
                    <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500 font-mono">{product.sku}</span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs font-semibold text-emerald-700">
                          {formatPrice(product.salePrice || product.regularPrice)}
                        </span>
                        {product.salePrice && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatPrice(product.regularPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Suggestions when empty */}
          {query.trim().length < 2 && (
            <div className="py-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {["Smart Watch", "QCY Earbuds", "Anker Power Bank", "65W GaN Charger", "Gaming Headset", "Joyroom"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-full text-xs font-medium text-slate-600 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              href={`/shop?search=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1"
            >
              View all results for &quot;{query}&quot;
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
