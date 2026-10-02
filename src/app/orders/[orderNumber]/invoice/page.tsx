import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { getStoreSettings } from "@/lib/settings";
import InvoicePrintButton from "./InvoicePrintButton";

interface InvoicePageProps {
  params: {
    orderNumber: string;
  };
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const settings = await getStoreSettings();

  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="bg-slate-100 min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Print Button (hidden on print) */}
        <div className="flex justify-between items-center no-print">
          <span className="text-xs text-slate-500 font-medium">Commercial Tax & Delivery Receipt</span>
          <InvoicePrintButton />
        </div>

        {/* The Printable Invoice Sheet */}
        <div className="bg-white rounded-2xl shadow-md p-8 sm:p-12 border border-slate-200 text-slate-900 text-xs">
          {/* Header */}
          <div className="flex justify-between items-start pb-8 border-b-2 border-slate-900">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                {settings.storeName}
              </h1>
              <p className="text-slate-500 mt-1 max-w-xs leading-relaxed">{settings.address}</p>
              <p className="text-slate-600 mt-1">
                <strong>Phone / WhatsApp:</strong> {settings.contactPhone}
              </p>
              <p className="text-slate-600">
                <strong>Email:</strong> {settings.contactEmail}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xl font-black text-emerald-800 tracking-wider uppercase block">
                INVOICE
              </span>
              <p className="font-mono font-bold text-sm text-slate-900 mt-1">{order.orderNumber}</p>
              <p className="text-slate-500 mt-1">Date: {formatDate(order.createdAt)}</p>
              <span className="inline-block px-2.5 py-1 bg-slate-900 text-white font-bold text-[10px] rounded uppercase mt-2">
                {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}
              </span>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-2 gap-8 py-6 border-b border-slate-200">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                DELIVER TO:
              </span>
              <h3 className="font-bold text-sm text-slate-900 mt-1">{order.customerName}</h3>
              <p className="font-mono text-slate-700">{order.customerPhone}</p>
              <p className="text-slate-600 mt-1">{order.shippingAddress}</p>
              {order.shippingArea && <p className="text-slate-600">Area: {order.shippingArea}</p>}
              {order.landmark && <p className="text-slate-500">Landmark: {order.landmark}</p>}
              <p className="font-bold text-slate-800 mt-0.5">{order.shippingCity}, {order.shippingProvince}</p>
            </div>

            <div className="text-right">
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                SHIPMENT DETAILS:
              </span>
              <p className="mt-1">
                <strong>Courier Partner:</strong> {order.courierName || "TCS / Trax Express"}
              </p>
              <p>
                <strong>Tracking Number:</strong> {order.trackingNumber || "Pending Dispatch"}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <span className="font-bold text-emerald-700">{order.paymentStatus}</span>
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-300 text-[10px] font-bold text-slate-400 uppercase">
                  <th className="pb-2">#</th>
                  <th className="pb-2">Description</th>
                  <th className="pb-2">SKU</th>
                  <th className="pb-2 text-center">Qty</th>
                  <th className="pb-2 text-right">Unit Price</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={item.id} className="py-3">
                    <td className="py-2.5 font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-2.5">
                      <span className="font-bold text-slate-900 block">{item.productTitle}</span>
                      {item.variantTitle && (
                        <span className="text-slate-500 text-[10px]">Option: {item.variantTitle}</span>
                      )}
                    </td>
                    <td className="py-2.5 font-mono text-slate-500">{item.sku || "N/A"}</td>
                    <td className="py-2.5 text-center font-bold">{item.quantity}</td>
                    <td className="py-2.5 text-right font-mono">{formatPrice(item.price)}</td>
                    <td className="py-2.5 text-right font-bold font-mono">{formatPrice(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Calculation */}
          <div className="pt-4 border-t-2 border-slate-900 flex justify-end">
            <div className="w-64 space-y-1.5 text-right">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal:</span>
                <span className="font-semibold font-mono">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span className="font-mono">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Shipping Delivery:</span>
                <span className="font-semibold font-mono">
                  {order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-300">
                <span>TOTAL DUE (COD):</span>
                <span className="text-emerald-800 font-mono">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Terms & Barcode representation */}
          <div className="mt-12 pt-6 border-t border-slate-200 text-center space-y-2 text-[10px] text-slate-500">
            <p className="font-bold uppercase tracking-wider text-slate-700">
              Thank you for your business with {settings.storeName}!
            </p>
            <p>
              Please keep this invoice as proof of warranty. For any warranty assistance, contact us on WhatsApp: {settings.contactPhone}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
