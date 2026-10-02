"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Zap,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Minus,
  Plus,
} from "lucide-react";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import VariantSelector, { Variant } from "./VariantSelector";

interface ProductPurchaseBoxProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    regularPrice: number;
    salePrice?: number | null;
    stock: number;
    warranty?: string | null;
    variants: Variant[];
    images: Array<{ url: string }>;
  };
  whatsappNumber?: string;
}

export default function ProductPurchaseBox({
  product,
  whatsappNumber = "923218273588",
}: ProductPurchaseBoxProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);

  // Active Price and Stock
  const activeRegularPrice = selectedVariant ? selectedVariant.price : product.regularPrice;
  const activeSalePrice = selectedVariant
    ? selectedVariant.salePrice
    : product.salePrice;
  const currentPrice = activeSalePrice || activeRegularPrice;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;
  const currentImage = (selectedVariant && selectedVariant.image) || product.images[0]?.url || "";

  const discountPercent = calculateDiscount(activeRegularPrice, activeSalePrice);
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id || null,
      title: product.name,
      variantTitle: selectedVariant?.title || null,
      sku: currentSku,
      price: currentPrice,
      regularPrice: activeRegularPrice,
      quantity,
      image: currentImage,
      slug: product.slug,
    });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(
      {
        productId: product.id,
        variantId: selectedVariant?.id || null,
        title: product.name,
        variantTitle: selectedVariant?.title || null,
        sku: currentSku,
        price: currentPrice,
        regularPrice: activeRegularPrice,
        quantity,
        image: currentImage,
        slug: product.slug,
      },
      false
    );
    router.push("/checkout");
  };

  // WhatsApp Pre-filled Enquiry
  const waText = encodeURIComponent(
    `Salam! I am interested in purchasing:\n*${product.name}*\n` +
      (selectedVariant ? `Option: ${selectedVariant.title}\n` : "") +
      `SKU: ${currentSku}\nPrice: Rs. ${currentPrice.toLocaleString("en-PK")}\n\nIs it currently available for Cash on Delivery?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${waText}`;

  return (
    <div className="space-y-6">
      {/* Price Block */}
      <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-black text-slate-900">
            {formatPrice(currentPrice)}
          </span>
          {activeSalePrice && (
            <span className="text-base sm:text-lg text-slate-400 line-through">
              {formatPrice(activeRegularPrice)}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2.5 py-1 bg-rose-600 text-white text-xs font-black rounded-lg">
              SAVE {discountPercent}%
            </span>
          )}
        </div>

        {/* Stock status indicator */}
        <div className="mt-3 flex items-center gap-2">
          {currentStock > 5 ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              In Stock Ready to Dispatch
            </span>
          ) : currentStock > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full animate-pulse">
              Only {currentStock} left in stock!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
              Currently Out of Stock
            </span>
          )}
          <span className="text-xs text-slate-400 font-mono">SKU: {currentSku}</span>
        </div>
      </div>

      {/* Variant Selector */}
      {product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          selectedVariantId={selectedVariant?.id || null}
          onSelectVariant={(v) => setSelectedVariant(v)}
        />
      )}

      {/* Quantity & CTA Buttons */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Quantity:
          </label>
          <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-1 text-sm font-bold text-slate-900 min-w-10 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
              className="p-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 group"
          >
            <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Add to Cart</span>
          </button>

          {/* Buy Now (Direct Checkout) */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 group"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
            <span>Buy Now (COD)</span>
          </button>
        </div>

        {/* WhatsApp Quick Order Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>Order via WhatsApp (0321-8273588)</span>
        </a>
      </div>

      {/* Trust & Guarantee Box */}
      <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span><strong>Cash on Delivery:</strong> Pay when parcel reaches your doorstep.</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span><strong>Warranty:</strong> {product.warranty || "1 Year Official Brand Warranty"}.</span>
        </div>
        <div className="flex items-center gap-2.5">
          <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
          <span><strong>7-Day Checking Guarantee:</strong> Easy replacement for damaged/faulty units.</span>
        </div>
      </div>
    </div>
  );
}
