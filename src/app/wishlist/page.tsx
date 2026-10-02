"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (item: any) => {
    addItem({
      productId: item.productId,
      title: item.name,
      price: item.price,
      regularPrice: item.regularPrice,
      quantity: 1,
      image: item.image,
      slug: item.slug,
    });
    removeFromWishlist(item.productId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Wishlist</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
          <span>My Saved Gadgets ({items.length})</span>
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Your wishlist is empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Save your favorite smartwatches and audio accessories here to easily order them anytime.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            Explore Store
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-slate-50">
                <Link href={`/products/${item.slug}`}>
                  <Image src={item.image} alt={item.name} fill className="object-cover p-2" />
                </Link>
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-2.5 right-2.5 p-2 bg-white/90 text-rose-500 hover:bg-rose-50 rounded-full shadow-sm"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-emerald-700 line-clamp-2"
                >
                  {item.name}
                </Link>

                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-slate-900">
                    {formatPrice(item.price)}
                  </span>
                  {item.stock > 0 ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleMoveToCart(item)}
                  disabled={item.stock <= 0}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
