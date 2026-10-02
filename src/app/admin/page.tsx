"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Clock,
  AlertTriangle,
  Package,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xs font-semibold text-slate-500">
        Loading real-time enterprise metrics...
      </div>
    );
  }

  const kpis = [
    {
      label: "Total Sales",
      value: formatPrice(stats?.totalSales || 0),
      icon: DollarSign,
      color: "bg-emerald-500",
      sub: "Lifetime gross revenue",
    },
    {
      label: "Today's Sales",
      value: formatPrice(stats?.todaySales || 0),
      icon: TrendingUp,
      color: "bg-teal-500",
      sub: "Midnight to present",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "bg-indigo-500",
      sub: `${stats?.pendingOrders || 0} pending processing`,
    },
    {
      label: "Low Stock Alert",
      value: stats?.lowStock || 0,
      icon: AlertTriangle,
      color: "bg-amber-500",
      sub: `${stats?.outOfStock || 0} items completely out of stock`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time sales, order flows, and inventory telemetry across Pakistan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
          <Link
            href="/admin/customizer"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
          >
            Store Customizer
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{kpi.label}</span>
                <div
                  className={`w-9 h-9 rounded-xl ${kpi.color} text-white flex items-center justify-center shadow-sm`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900">{kpi.value}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Low Stock Warning Box */}
      {(stats?.lowStock > 0 || stats?.outOfStock > 0) && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-900 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Inventory Attention Needed: {stats.lowStock} products are running low, and {stats.outOfStock} are out of stock.
            </span>
          </div>
          <Link
            href="/admin/inventory"
            className="font-bold text-amber-800 hover:underline shrink-0"
          >
            Manage Inventory →
          </Link>
        </div>
      )}

      {/* Recent Orders & Top Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-600" />
              <span>Recent Orders</span>
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              View All Orders
            </Link>
          </div>

          {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">
              No orders placed yet. As customers order via COD, they appear here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                    <th className="pb-2">Order #</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">City</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentOrders.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-mono font-bold text-emerald-700">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-slate-900 block">{ord.customerName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{ord.customerPhone}</span>
                      </td>
                      <td className="py-3 text-slate-600">{ord.shippingCity}</td>
                      <td className="py-3 font-black text-slate-900">{formatPrice(ord.total)}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px]"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Stock / Products (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Catalog Snapshot</span>
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              All Products
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {stats?.topProducts?.map((prod: any) => (
              <div key={prod.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5 min-w-0 pr-2">
                  <p className="font-bold text-slate-900 truncate">{prod.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">SKU: {prod.sku}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-slate-900 block">
                    {formatPrice(prod.salePrice || prod.regularPrice)}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      prod.stock > 5 ? "text-emerald-700" : "text-amber-600"
                    }`}
                  >
                    Stock: {prod.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
