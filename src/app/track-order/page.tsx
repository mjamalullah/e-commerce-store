"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  AlertCircle,
  Phone,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { COURIER_PROVIDERS } from "@/lib/pakistan-data";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("orderNumber") || "");
  const [phone, setPhone] = useState(searchParams.get("phone") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim()) return;

    setIsLoading(true);
    setError("");
    setOrderData(null);

    try {
      const res = await fetch(
        `/api/orders/track?orderNumber=${encodeURIComponent(orderNumber.trim())}${
          phone ? `&phone=${encodeURIComponent(phone.trim())}` : ""
        }`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "No order found matching your tracking details.");
      }

      setOrderData(data.order);
    } catch (err: any) {
      setError(err.message || "Failed to find order.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("orderNumber")) {
      handleTrack();
    }
  }, []);

  const steps = [
    { key: "PENDING", label: "Order Placed" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "PACKED", label: "Packed" },
    { key: "SHIPPED", label: "Dispatched" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
    { key: "DELIVERED", label: "Delivered" },
  ];

  const getStepIndex = (status: string) => {
    if (status === "CANCELLED" || status === "RETURNED") return -1;
    const idx = steps.findIndex((s) => s.key === status);
    return idx !== -1 ? idx : 0;
  };

  const currentStepIdx = orderData ? getStepIndex(orderData.orderStatus) : 0;

  const courierInfo = orderData?.courierName
    ? COURIER_PROVIDERS.find((c) =>
        c.name.toLowerCase().includes(orderData.courierName.toLowerCase())
      )
    : null;

  const courierUrl =
    courierInfo && courierInfo.trackingUrl && orderData?.trackingNumber
      ? `${courierInfo.trackingUrl}${orderData.trackingNumber}`
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Search Header Box */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
          Pakistan Nationwide Logistics
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Enter your Order Number and Mobile Number to view live parcel updates and courier tracking.
        </p>

        {/* Input Form */}
        <form
          onSubmit={handleTrack}
          className="max-w-xl mx-auto mt-6 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-2"
        >
          <input
            type="text"
            required
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            placeholder="Order # (e.g. QG-102934)"
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm uppercase font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Mobile (Optional)"
            className="w-full sm:w-40 px-4 py-2.5 text-xs sm:text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none border-t sm:border-t-0 sm:border-l border-slate-100"
          />
          <button
            type="submit"
            disabled={isLoading || !orderNumber.trim()}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all shrink-0 flex items-center justify-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? "Searching..." : "Track Parcel"}</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="max-w-xl mx-auto p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Display */}
      {orderData && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black font-mono text-slate-900">
                  {orderData.orderNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                  {orderData.orderStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Placed on {formatDate(orderData.createdAt)} • {orderData.customerName}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block">Total Due (COD)</span>
              <span className="text-lg font-black text-emerald-700">
                {formatPrice(orderData.total)}
              </span>
            </div>
          </div>

          {orderData.orderStatus !== "CANCELLED" ? (
            <div className="py-4">
              <div className="grid grid-cols-6 gap-1 relative">
                <div className="absolute top-4 left-4 right-4 h-1 bg-slate-200 -z-0">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-500"
                    style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
                  />
                </div>

                {steps.map((s, idx) => {
                  const isDone = idx <= currentStepIdx;
                  return (
                    <div key={s.key} className="flex flex-col items-center text-center z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                          isDone
                            ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                            : "bg-white border-2 border-slate-300 text-slate-400"
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs font-semibold mt-2 ${
                          isDone ? "text-slate-900 font-bold" : "text-slate-400"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold text-center">
              This order was marked as CANCELLED.
            </div>
          )}

          {orderData.courierName && (
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    Dispatched via {orderData.courierName}
                  </p>
                  <p className="text-slate-600 font-mono">
                    Tracking #: {orderData.trackingNumber || "Assigned on Dispatch"}
                  </p>
                </div>
              </div>

              {courierUrl && (
                <a
                  href={courierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Track on {orderData.courierName}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Delivery Address</span>
              </h4>
              <p className="text-slate-700 font-medium">{orderData.shippingAddress}</p>
              <p className="text-slate-500 font-bold mt-0.5">{orderData.shippingCity}</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-emerald-600" />
                <span>Products in Parcel ({orderData.items.length})</span>
              </h4>
              <div className="space-y-1">
                {orderData.items.map((item: any) => (
                  <p key={item.id} className="text-slate-700">
                    • {item.productTitle} {item.variantTitle ? `(${item.variantTitle})` : ""} × {item.quantity}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs font-semibold text-slate-400">
          Loading tracking interface...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
