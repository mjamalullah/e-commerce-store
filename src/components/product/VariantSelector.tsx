"use client";

import React from "react";
import { Check } from "lucide-react";

export interface Variant {
  id: string;
  title: string;
  sku: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  image?: string | null;
  attributes: string; // JSON string e.g. {"Color": "Black"}
}

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariantId: string | null;
  onSelectVariant: (variant: Variant) => void;
}

export default function VariantSelector({
  variants,
  selectedVariantId,
  onSelectVariant,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Select Option / Color:
        </label>
        {selectedVariantId && (
          <span className="text-xs text-emerald-700 font-semibold">
            {variants.find((v) => v.id === selectedVariantId)?.title}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariantId;
          const isOutOfStock = variant.stock <= 0;

          return (
            <button
              key={variant.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelectVariant(variant)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border-2 transition-all flex items-center gap-1.5 ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm"
                  : isOutOfStock
                  ? "border-slate-200 bg-slate-100 text-slate-400 line-through cursor-not-allowed"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{variant.title}</span>
              {variant.stock > 0 && variant.stock <= 5 && (
                <span className="text-[10px] text-amber-600 font-bold">({variant.stock} left)</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
