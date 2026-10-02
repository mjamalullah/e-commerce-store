"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Star,
  CheckCircle,
  Truck,
  ShieldCheck,
  ShoppingCart,
  Zap,
  Heart,
  Plus,
  Minus,
  ExternalLink,
} from "lucide-react";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export interface QuickViewProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  regularPrice: number;
  salePrice?: number | null;
  images: { url: string; alt?: string | null }[];
  brandName?: string;
  rating?: number;
  stock?: number;
  shortDesc?: string;
  variants?: { id: string; title: string; price: number; stock: number }[];
}

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: QuickViewProduct | null;
  onOpenQuickBuy: (prod: QuickViewProduct, qty: number, variant?: any) => void;
  onAddedToCart: (prod: any) => void;
}

export default function QuickViewModal({
  isOpen,
  onClose,
  product,
  onOpenQuickBuy,
  onAddedToCart,
}: QuickViewModalProps) {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const inWishlist = isInWishlist(product.id);
  const effectivePrice = product.salePrice || product.regularPrice;
  const discount = calculateDiscount(product.regularPrice, product.salePrice);
  const currentImages = product.images?.length > 0
    ? product.images
    : [{ url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80" }];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.name,
      price: effectivePrice,
      regularPrice: product.regularPrice,
      quantity,
      image: currentImages[0]?.url,
      slug: product.slug,
      sku: product.sku,
    });
    onClose();
    onAddedToCart({
      name: product.name,
      price: effectivePrice,
      image: currentImages[0]?.url,
      quantity,
    });
  };

  const handleBuyNow = () => {
    onClose();
    onOpenQuickBuy(product, quantity, selectedVariantId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column: Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square w-full rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden">
              <Image
                src={currentImages[selectedImageIdx]?.url || currentImages[0]?.url}
                alt={product.name}
                fill
                className="object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-rose-600 text-white text-xs font-black rounded-lg shadow-sm">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            {currentImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {currentImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                      selectedImageIdx === idx ? "border-emerald-600 ring-2 ring-emerald-500/20" : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Controls */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              {/* Brand & Rating */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {product.brandName || "Genuine Brand"}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating || 5}.0 Verified</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {product.name}
              </h2>
              <span className="text-xs font-mono text-slate-400 mt-0.5 block">SKU: {product.sku}</span>

              {/* Pricing */}
              <div className="mt-3 flex items-baseline gap-2.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {formatPrice(effectivePrice)}
                </span>
                {product.salePrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(product.regularPrice)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>In Stock & Ready for Immediate Dispatch</span>
              </div>

              {/* Short Description */}
              {product.shortDesc && (
                <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {product.shortDesc}
                </p>
              )}

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-4 space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Select Option / Color:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          selectedVariantId === v.id
                            ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {v.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity & CTA Buttons */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add to Cart and Quick Buy */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
                >
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>Quick Buy (COD)</span>
                </button>
              </div>

              {/* View Full Product Page Link */}
              <div className="pt-1 text-center">
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 group"
                >
                  <span>View Full Product Specifications & Reviews</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
