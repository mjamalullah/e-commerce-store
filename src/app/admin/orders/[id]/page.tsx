"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  MessageCircle,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MapPin,
  Save,
  AlertCircle,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { COURIER_PROVIDERS } from "@/lib/pakistan-data";

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const [order, setOrder] = useState<any>(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        setOrderStatus(data.order.orderStatus);
        setPaymentStatus(data.order.paymentStatus);
        setCourierName(data.order.courierName || "Trax Logistics");
        setTrackingNumber(data.order.trackingNumber || "");
        setInternalNotes(data.order.internalNotes || "");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus,
          paymentStatus,
          courierName,
          trackingNumber,
          internalNotes,
          statusNote,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Order updated successfully!");
        setWhatsappLink(data.whatsappLink);
        fetchOrder();
        setStatusNote("");
      } else {
        setMessage(data.message || "Failed to update order");
      }
    } catch {
      setMessage("Error updating order");
    } finally {
      setIsSaving(false);
    }
  };

  if (!order) {
    return (
      <div className="py-20 text-center text-xs font-semibold text-slate-400">
        Loading order details...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                Order {order.orderNumber}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                {order.orderStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed on {formatDate(order.createdAt)} • Payment Method: {order.paymentMethod}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/orders/${order.orderNumber}/invoice`}
            target="_blank"
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Invoice</span>
          </Link>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-between">
          <span>{message}</span>
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Send WhatsApp Notification Now</span>
            </a>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Order Items & Customer Address */}
        <div className="lg:col-span-7 space-y-6">
          {/* Ordered Products Table */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Ordered Items ({order.items.length})
            </h2>

            <div className="divide-y divide-slate-100 text-xs">
              {order.items.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">{item.productTitle}</p>
                    {item.variantTitle && (
                      <p className="text-[11px] text-slate-500">Option: {item.variantTitle}</p>
                    )}
                    <p className="text-slate-400 font-mono">
                      SKU: {item.sku || "N/A"} • Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    {formatPrice(item.total)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold font-mono text-slate-900">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount</span>
                  <span className="font-mono">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Courier Delivery</span>
                <span className="font-semibold font-mono text-slate-900">
                  {order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Due (COD)</span>
                <span className="text-emerald-700 font-mono">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Customer & Delivery Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Customer Name</p>
                <p className="font-bold text-slate-900 mt-0.5">{order.customerName}</p>
                <p className="font-mono text-slate-700 mt-1">Phone: {order.customerPhone}</p>
                {order.customerEmail && <p className="text-slate-500">{order.customerEmail}</p>}
              </div>

              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Shipping Destination</p>
                <p className="font-medium text-slate-900 mt-0.5">{order.shippingAddress}</p>
                {order.shippingArea && <p>Area: {order.shippingArea}</p>}
                {order.landmark && <p className="text-slate-500">Landmark: {order.landmark}</p>}
                <p className="font-bold text-slate-900 mt-1">
                  {order.shippingCity}, {order.shippingProvince}
                </p>
              </div>
            </div>

            {order.deliveryNotes && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <strong>Customer Instructions:</strong> {order.deliveryNotes}
              </div>
            )}
          </div>

          {/* Status Timeline History */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Status History Audit Log</span>
            </h2>

            <div className="space-y-3">
              {order.statusHistory?.map((h: any) => (
                <div key={h.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-4">
                  <div>
                    <span className="font-bold text-slate-900 uppercase text-[11px] block">
                      {h.status}
                    </span>
                    <p className="text-slate-600 mt-0.5">{h.note}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">By: {h.createdBy}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {formatDate(h.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Order Control Panel */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleUpdate} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-5 text-xs">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider">
              Manage Status & Dispatch
            </h2>

            {/* Order Status */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Order Status</label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
              >
                <option value="PENDING">PENDING (New Order)</option>
                <option value="CONFIRMED">CONFIRMED (Call Verified)</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="PACKED">PACKED (Ready for Courier)</option>
                <option value="SHIPPED">SHIPPED (Handed to Courier)</option>
                <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                <option value="DELIVERED">DELIVERED (Cash Collected)</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="RETURNED">RETURNED</option>
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
              >
                <option value="PENDING">PENDING (COD Unpaid)</option>
                <option value="PAID">PAID (Cash Collected / Bank Verified)</option>
                <option value="FAILED">FAILED</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>
            </div>

            {/* Courier Assignment */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Courier Service</label>
              <select
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
              >
                {COURIER_PROVIDERS.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Tracking Number */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Courier Tracking / Consignment #
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value.trim())}
                placeholder="e.g. 7748920192"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
              />
            </div>

            {/* Status Change Note */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Status Change Note (Internal)
              </label>
              <input
                type="text"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="e.g. Customer confirmed via WhatsApp call"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            {/* Internal Staff Notes */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Internal Notes</label>
              <textarea
                rows={2}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Private staff memo..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Order Updates"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
