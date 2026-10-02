"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileSpreadsheet, Download, Upload, CheckCircle2 } from "lucide-react";

export default function AdminBulkToolsPage() {
  const [statusMsg, setStatusMsg] = useState("");

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
          <span>Bulk Product & Order Tools</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Export data to Microsoft Excel / CSV and execute batch updates across your store.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Products CSV Export */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              Product Catalog
            </span>
            <h2 className="text-base font-bold text-slate-900">Export All Products</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Download your complete product roster including Name, SKU, Category, Brand, Regular & Sale Prices, and Current Stock.
            </p>
          </div>

          <a
            href="/api/admin/bulk?type=products"
            download
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Products CSV</span>
          </a>
        </div>

        {/* Orders CSV Export */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              Order Ledger
            </span>
            <h2 className="text-base font-bold text-slate-900">Export Order Records</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Export sales orders with customer mobile numbers, cities, delivery amounts, and Cash on Delivery fulfillment status.
            </p>
          </div>

          <a
            href="/api/admin/bulk?type=orders"
            download
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Orders CSV</span>
          </a>
        </div>
      </div>
    </div>
  );
}
