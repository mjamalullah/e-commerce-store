"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Star, Eye, Zap } from "lucide-react";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import QuickViewModal, { QuickViewProduct } from "../modals/QuickViewModal";
import QuickBuyModal from "../modals/QuickBuyModal";
import CartConfirmModal from "../modals/CartConfirmModal";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  sku: string;
  regularPrice: number;
  salePrice?: number | null;
  image?: string;
  secondaryImage?: string;
  brandName?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  stock?: number;
  rating?: number;
  shortDesc?: string;
}

export default function ProductCard({
  id,
  name,
  slug,
  sku,
  regularPrice,
  salePrice,
  image = "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
  secondaryImage,
  brandName,
  isBestSeller,
  isNewArrival,
  stock = 10,
  rating = 5,
  shortDesc,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  // Modal States
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);
  const [isCartConfirmOpen, setIsCartConfirmOpen] = useState(false);
  const [addedProductDetails, setAddedProductDetails] = useState<any>(null);

  const discountPercent = calculateDiscount(regularPrice, salePrice);
  const effectivePrice = salePrice || regularPrice;
  const inWishlist = isInWishlist(id);

  const modalProduct: QuickViewProduct = {
    id,
    name,
    slug,
    sku,
    regularPrice,
    salePrice,
    images: secondaryImage ? [{ url: image }, { url: secondaryImage }] : [{ url: image }],
    brandName,
    rating,
    stock,
    shortDesc,
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: id,
      title: name,
      price: effectivePrice,
      regularPrice,
      quantity: 1,
      image,
      slug,
      sku,
    });
    setAddedProductDetails({
      name,
      price: effectivePrice,
      image,
      quantity: 1,
    });
    setIsCartConfirmOpen(true);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        productId: id,
        name,
        slug,
        price: effectivePrice,
        regularPrice,
        image,
        stock,
      });
    }
  };

  const handleQuickViewOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const handleQuickBuyOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickBuyOpen(true);
  };

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/60 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
      >
        {/* Top Image Container with Desktop Image Hover Flip */}
        <div className="relative aspect-square w-full bg-slate-50/80 overflow-hidden">
          <Link href={`/products/${slug}`} className="block w-full h-full relative">
            {/* Primary Image */}
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-all duration-500 ${
                secondaryImage && isHovered ? "opacity-0 scale-105" : "opacity-100 scale-100"
              }`}
            />

            {/* Secondary Hover Image (Qadri Gadgets Style Flip) */}
            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt={`${name} alternative angle`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover transition-all duration-500 absolute inset-0 ${
                  isHovered ? "opacity-100 scale-105" : "opacity-0 scale-95"
                }`}
              />
            )}
          </Link>

          {/* Floating Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
            {discountPercent > 0 && (
              <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-lg shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
            {isBestSeller && (
              <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase rounded-lg shadow-sm">
                Best Seller
              </span>
            )}
            {isNewArrival && !isBestSeller && (
              <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-extrabold uppercase rounded-lg shadow-sm">
                New
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-sm z-10 ${
              inWishlist
                ? "bg-rose-50 text-rose-600 border border-rose-200"
                : "bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-white"
            }`}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>

          {/* Quick View Hover Button (Floating Center Action) */}
          <div
            className={`absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 z-10 px-3 transition-all duration-200 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            <button
              onClick={handleQuickViewOpen}
              className="flex-1 py-1.5 px-2.5 bg-white/95 hover:bg-slate-900 hover:text-white text-slate-800 rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5 backdrop-blur-xs cursor-pointer"
              title="Quick View Modal"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>

            <button
              onClick={handleQuickBuyOpen}
              className="py-1.5 px-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
              title="1-Click Quick Buy"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Buy</span>
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {stock <= 0 && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
              <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Brand & Rating */}
            <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-emerald-700">
                {brandName || "Genuine Brand"}
              </span>
              <div className="flex items-center gap-0.5 text-amber-500">
                <Star className="w-3 h-3 fill-amber-400" />
                <span className="font-bold text-slate-700">{rating}.0</span>
              </div>
            </div>

            {/* Title */}
            <Link
              href={`/products/${slug}`}
              className="block text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-emerald-700 line-clamp-2 leading-snug transition-colors"
            >
              {name}
            </Link>
          </div>

          {/* Price & Add to Cart */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div>
              <div className="text-sm sm:text-base font-black text-slate-900">
                {formatPrice(effectivePrice)}
              </div>
              {salePrice && (
                <div className="text-[11px] text-slate-400 line-through">
                  {formatPrice(regularPrice)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleQuickBuyOpen}
                disabled={stock <= 0}
                className="hidden sm:inline-flex p-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl transition-all items-center text-xs font-bold disabled:opacity-50 cursor-pointer border border-amber-200"
                title="Quick Buy"
              >
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              </button>

              <button
                onClick={handleQuickAdd}
                disabled={stock <= 0}
                className="p-2 sm:px-3 sm:py-2 bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold disabled:opacity-50 cursor-pointer shadow-xs"
                title="Add to Cart"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={modalProduct}
        onOpenQuickBuy={() => {
          setIsQuickViewOpen(false);
          setIsQuickBuyOpen(true);
        }}
        onAddedToCart={(details) => {
          setAddedProductDetails(details);
          setIsCartConfirmOpen(true);
        }}
      />

      {/* 1-Click Quick Buy Modal */}
      <QuickBuyModal
        isOpen={isQuickBuyOpen}
        onClose={() => setIsQuickBuyOpen(false)}
        product={modalProduct}
        quantity={1}
      />

      {/* Cart Confirmation Dialog */}
      <CartConfirmModal
        isOpen={isCartConfirmOpen}
        onClose={() => setIsCartConfirmOpen(false)}
        product={addedProductDetails}
      />
    </>
  );
}
