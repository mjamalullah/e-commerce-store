"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  Tag,
  ArrowRight,
  AlertCircle,
  Building,
  CreditCard,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { PAKISTAN_CITIES, PAKISTAN_PROVINCES, validatePakistanPhone } from "@/lib/pakistan-data";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [province, setProvince] = useState("Punjab");
  const [city, setCity] = useState("Lahore");
  const [customCity, setCustomCity] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD"); // "COD" or "BANK_TRANSFER"

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponMsg("");
    const res = await applyCoupon(couponInput);
    setIsApplyingCoupon(false);
    setCouponMsg(res.message);
    if (res.success) setCouponInput("");
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName.trim()) {
      setErrorMessage("Please enter your full name");
      return;
    }

    if (!validatePakistanPhone(customerPhone)) {
      setErrorMessage("Please provide a valid Pakistani mobile number (e.g. 0300-1234567 or 03211234567)");
      return;
    }

    const selectedCity = city === "Other City" ? customCity.trim() : city;
    if (!selectedCity) {
      setErrorMessage("Please select or enter your delivery city");
      return;
    }

    if (!address.trim()) {
      setErrorMessage("Please enter your complete house/street address");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please add items to checkout.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          shippingProvince: province,
          shippingCity: selectedCity,
          shippingArea: area,
          shippingAddress: address,
          landmark,
          deliveryNotes,
          paymentMethod,
          couponCode: appliedCoupon?.code || null,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            title: i.title,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to place order. Please try again.");
      }

      // Success! Clear cart and redirect
      clearCart();
      router.push(`/order-success/${data.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong while placing your order.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-black text-slate-900">Your Cart is Empty</h1>
        <p className="text-sm text-slate-500">
          You don&apos;t have any products in your cart to proceed with checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Checkout Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Express 1-Page Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Pay securely via Cash on Delivery across Pakistan. No account required.</span>
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Customer & Shipping Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Customer Information */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>Contact Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Muhammad Ali"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Mobile Number (WhatsApp Preferred) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Our courier rider will call this number before arrival.
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="For invoice copy: ali@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>Delivery Address (Pakistan)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Province <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors"
                  >
                    {PAKISTAN_PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors"
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {city === "Other City" && (
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Specify City Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="e.g. Kasur, Taxila, Kotli"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-600"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Area / Town / Sector
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. DHA Phase 5, Gulshan, F-10"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nearby Famous Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Shell Pump / Main Market"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Complete Street Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Apartment #, Street #, Block / Sector name"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Rider Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Please deliver after 2 PM or call before arriving"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span>Payment Mode</span>
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery option */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                        Most Popular
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pay in cash to the TCS / Trax courier rider when your parcel arrives.
                    </p>
                  </div>
                </label>

                {/* Direct Bank Transfer option */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    checked={paymentMethod === "BANK_TRANSFER"}
                    onChange={() => setPaymentMethod("BANK_TRANSFER")}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        Direct Bank Transfer
                      </span>
                      <Building className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Transfer directly via Meezan Bank, JazzCash or Easypaisa after order placement.
                    </p>
                  </div>
                </label>
              </div>

              {/* Show Bank Account details if selected */}
              {paymentMethod === "BANK_TRANSFER" && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
                  <p className="font-bold text-slate-900">Bank Account Details:</p>
                  <p><strong>Bank:</strong> Meezan Bank Ltd.</p>
                  <p><strong>Account Title:</strong> Apex Gadgets Commerce</p>
                  <p><strong>Account Number:</strong> 01020304050607</p>
                  <p><strong>IBAN:</strong> PK45MEZN0001020304050607</p>
                  <p className="text-[11px] text-slate-500 pt-1">
                    * Please share your payment transfer screenshot on WhatsApp (0321-8273588) with your Order ID for immediate verification.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-5 sticky top-28">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
                Order Summary ({items.length} items)
              </h2>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{item.title}</p>
                      {item.variantTitle && (
                        <p className="text-[10px] text-slate-400">Variant: {item.variantTitle}</p>
                      )}
                      <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Input */}
              <div className="pt-2 border-t border-slate-100">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <span className="text-emerald-800 font-semibold flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      Coupon {appliedCoupon.code} Applied
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Discount code (e.g. WELCOME10)"
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs uppercase font-medium focus:outline-none focus:border-emerald-600"
                      />
                      <button
                        type="button"
                        onClick={handleCouponSubmit}
                        disabled={isApplyingCoupon || !couponInput.trim()}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold"
                      >
                        {isApplyingCoupon ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponMsg && <p className="text-[11px] text-slate-600">{couponMsg}</p>}
                  </div>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Nationwide Courier Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase">Free</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base sm:text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total Amount Due</span>
                  <span className="text-emerald-700">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Complete Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-sm sm:text-base font-bold shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? "Confirming Order..."
                    : `Complete Order (${paymentMethod === "COD" ? "Cash on Delivery" : "Bank Transfer"})`}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-[11px] text-slate-400 text-center space-y-1">
                <p>🔒 256-bit Encrypted Secure Checkout</p>
                <p>You will receive an instant WhatsApp & SMS confirmation.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
