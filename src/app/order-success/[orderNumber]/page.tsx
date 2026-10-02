import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  CheckCircle2,
  Printer,
  MapPin,
  MessageCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { getStoreSettings } from "@/lib/settings";

interface OrderSuccessPageProps {
  params: {
    orderNumber: string;
  };
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const settings = await getStoreSettings();

  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  // Compose customer WhatsApp confirmation message
  const waText = encodeURIComponent(
    `Salam ${settings.storeName}!\nI have placed an order.\n\n*Order #:* ${order.orderNumber}\n*Total:* Rs. ${order.total.toLocaleString("en-PK")}\n*Items:* ${order.items.length}\n*Delivery City:* ${order.shippingCity}\n*Payment:* ${order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}\n\nPlease confirm shipment.`
  );
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${waText}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      {/* Success Card Header */}
      <div className="p-8 sm:p-10 bg-white rounded-3xl border border-slate-200/80 shadow-lg text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Thank You, {order.customerName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Your order has been received and is currently being packed. You will receive an SMS/WhatsApp update once dispatched.
          </p>
        </div>

        {/* Order Details Badge */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-around gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Order Number</span>
            <span className="text-sm font-black font-mono text-emerald-700">{order.orderNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Amount to Pay</span>
            <span className="text-sm font-black text-slate-900">{formatPrice(order.total)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Method</span>
            <span className="font-bold text-slate-800">
              {order.paymentMethod === "COD" ? "Cash on Delivery (COD)" : order.paymentMethod}
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* WhatsApp Direct Confirmation */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm on WhatsApp</span>
          </a>

          {/* Print Invoice */}
          <Link
            href={`/orders/${order.orderNumber}/invoice`}
            target="_blank"
            className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Invoice</span>
          </Link>

          {/* Track Order */}
          <Link
            href={`/track-order?orderNumber=${order.orderNumber}&phone=${order.customerPhone}`}
            className="w-full sm:w-auto px-5 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Track Order</span>
          </Link>
        </div>
      </div>

      {/* Shipping & Delivery Summary */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>Delivery Details</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div>
            <p className="font-semibold text-slate-900">{order.customerName}</p>
            <p className="font-mono mt-0.5">{order.customerPhone}</p>
            {order.customerEmail && <p>{order.customerEmail}</p>}
          </div>

          <div>
            <p className="text-slate-900 font-medium">{order.shippingAddress}</p>
            {order.shippingArea && <p>Area: {order.shippingArea}</p>}
            {order.landmark && <p className="text-slate-500">Landmark: {order.landmark}</p>}
            <p className="font-bold text-slate-800">{order.shippingCity}, {order.shippingProvince}</p>
          </div>
        </div>

        {order.deliveryNotes && (
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
            <strong>Delivery Instructions:</strong> {order.deliveryNotes}
          </div>
        )}
      </div>

      {/* Items Breakdown */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Ordered Products ({order.items.length})
        </h2>

        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">{item.productTitle}</p>
                {item.variantTitle && (
                  <p className="text-[11px] text-slate-500">Option: {item.variantTitle}</p>
                )}
                <p className="text-slate-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
              </div>
              <span className="font-bold text-slate-900">{formatPrice(item.total)}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm font-black text-slate-900">
          <span>Total Payable</span>
          <span className="text-emerald-700">{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* Back to Home CTA */}
      <div className="text-center">
        <Link
          href="/"
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
