"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface CartConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    price: number;
    image?: string;
    quantity?: number;
    variantTitle?: string;
  } | null;
}

export default function CartConfirmModal({ isOpen, onClose, product }: CartConfirmModalProps) {
  const { total, itemCount, setIsCartDrawerOpen } = useCart();

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-center relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">Added to Cart!</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            This item has been successfully placed in your shopping cart.
          </p>
        </div>

        {/* Added Product Snippet */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-left">
          <div className="relative w-16 h-16 rounded-xl bg-white overflow-hidden shrink-0 border border-slate-200">
            <Image
              src={product.image || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{product.name}</h4>
            {product.variantTitle && (
              <p className="text-[11px] text-slate-500">{product.variantTitle}</p>
            )}
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-black text-emerald-700">{formatPrice(product.price)}</span>
              <span className="text-[11px] text-slate-400">Qty: {product.quantity || 1}</span>
            </div>
          </div>
        </div>

        {/* Cart Subtotal Summary */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
          <span>Cart Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):</span>
          <span className="text-sm font-black text-slate-900">{formatPrice(total)}</span>
        </div>

        {/* Action Buttons as requested: [Continue Shopping] and [View Cart & Checkout] */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => {
              onClose();
              setIsCartDrawerOpen(true);
            }}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>View Cart</span>
          </button>
        </div>

        {/* Instant Checkout Link */}
        <div className="pt-1">
          <Link
            href="/checkout"
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-emerald-700 inline-flex items-center gap-1 transition-colors"
          >
            <span>Proceed Directly to Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
