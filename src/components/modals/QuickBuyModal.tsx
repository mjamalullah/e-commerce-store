"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Zap,
  Truck,
  ShieldCheck,
  CheckCircle,
  Loader2,
  Phone,
  User,
  MapPin,
  Building,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { QuickViewProduct } from "./QuickViewModal";

interface QuickBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: QuickViewProduct | null;
  quantity?: number;
  variantId?: string | null;
}

const MAJOR_PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Gujranwala",
  "Sialkot",
  "Quetta",
  "Hyderabad",
  "Bahawalpur",
  "Sargodha",
  "Abbottabad",
  "Mardan",
  "Sukkur",
  "Other City",
];

export default function QuickBuyModal({
  isOpen,
  onClose,
  product,
  quantity = 1,
  variantId,
}: QuickBuyModalProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Lahore");
  const [address, setAddress] = useState("");

  if (!isOpen || !product) return null;

  const unitPrice = product.salePrice || product.regularPrice;
  const subtotal = unitPrice * quantity;
  const shippingFee = subtotal >= 3500 ? 0 : 200;
  const grandTotal = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill in your name, mobile number, and delivery address.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        shippingCity: city,
        shippingAddress: address.trim(),
        shippingProvince: "Punjab",
        paymentMethod: "COD",
        items: [
          {
            productId: product.id,
            title: product.name,
            price: unitPrice,
            quantity,
            sku: product.sku,
            image: product.images?.[0]?.url,
          },
        ],
        subtotal,
        shippingFee,
        total: grandTotal,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.orderNumber) {
        onClose();
        router.push(`/order-success?orderNumber=${data.orderNumber}`);
      } else {
        setError(data.error || "Order placement failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4 fill-slate-950" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 leading-tight">
              1-Click Quick Checkout
            </h3>
            <p className="text-[11px] text-slate-500">
              Cash on Delivery (COD) across Pakistan. Pay when received.
            </p>
          </div>
        </div>

        {/* Product Compact Snippet */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-5">
          <div className="relative w-14 h-14 rounded-xl bg-white overflow-hidden shrink-0 border border-slate-200">
            <Image
              src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{product.name}</h4>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="font-black text-emerald-700">{formatPrice(unitPrice)}</span>
              <span className="text-slate-500 font-mono">Qty: {quantity}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Quick Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Muhammad Ali"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mobile Number (WhatsApp Enabled)</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0321-1234567"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                <span>Destination City</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-800"
              >
                {MAJOR_PAKISTAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Payment Mode</span>
              </label>
              <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-between">
                <span>Cash on Delivery</span>
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Complete Street / House Delivery Address</span>
            </label>
            <textarea
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House #, Street #, Sector / Colony, Landmark"
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Pricing Summary */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-800">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Shipping (TCS / Leopards / Trax):</span>
              <span className="font-bold text-slate-800">
                {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
              <span>Pay on Delivery:</span>
              <span className="text-base text-emerald-700">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Confirming Order...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Confirm Cash on Delivery Order — {formatPrice(grandTotal)}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
