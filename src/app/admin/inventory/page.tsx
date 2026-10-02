"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL"); // ALL, LOW, OUT
  const [isLoading, setIsLoading] = useState(true);

  // Adjustment Modal State
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [newStock, setNewStock] = useState("");
  const [adjustReason, setAdjustReason] = useState("Restock Shipment Received");
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/products?limit=100");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "LOW") return p.stock > 0 && p.stock <= p.lowStockAlert;
    if (filter === "OUT") return p.stock <= 0;
    return true;
  });

  const handleOpenAdjust = (prod: any) => {
    setSelectedProduct(prod);
    setNewStock(prod.stock.toString());
    setAdjustReason("Restock Shipment Received");
    setMsg("");
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || newStock === "") return;
    setIsAdjusting(true);
    setMsg("");

    try {
      const res = await fetch("/api/admin/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          newStock: parseInt(newStock, 10),
          reason: adjustReason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg(data.message);
        fetchInventory();
        setTimeout(() => setSelectedProduct(null), 1000);
      } else {
        setMsg(data.message || "Adjustment failed");
      }
    } catch {
      setMsg("Error adjusting stock");
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Inventory Telemetry</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time stock ledger, automated low-stock warnings, and audit logging.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            filter === "ALL" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          All Items ({products.length})
        </button>
        <button
          onClick={() => setFilter("LOW")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            filter === "LOW" ? "bg-amber-500 text-slate-950" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          Low Stock Warning
        </button>
        <button
          onClick={() => setFilter("OUT")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            filter === "OUT" ? "bg-rose-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          Out of Stock
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-xs font-semibold text-slate-400">
            Loading inventory...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Boxes className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No matching stock items</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Cost</th>
                  <th className="py-3.5 px-4">Retail</th>
                  <th className="py-3.5 px-4">Stock Level</th>
                  <th className="py-3.5 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isLow = p.stock > 0 && p.stock <= p.lowStockAlert;
                  const isOut = p.stock <= 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">
                        {p.name}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-600">{p.sku}</td>
                      <td className="py-3 px-4 text-slate-600">{p.category?.name || "General"}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {p.costPrice ? formatPrice(p.costPrice) : "—"}
                      </td>
                      <td className="py-3 px-4 font-mono font-black text-slate-900">
                        {formatPrice(p.salePrice || p.regularPrice)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isOut
                              ? "bg-rose-100 text-rose-800"
                              : isLow
                              ? "bg-amber-100 text-amber-900"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isOut ? (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>0 (Out of Stock)</span>
                            </>
                          ) : isLow ? (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              <span>{p.stock} (Low Stock)</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{p.stock} in stock</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenAdjust(p)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-bold rounded-lg text-[11px] transition-colors"
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                Inventory Movement Entry
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">
                Adjust Stock: {selectedProduct.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">SKU: {selectedProduct.sku}</p>
            </div>

            {msg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
                {msg}
              </div>
            )}

            <form onSubmit={handleSaveAdjustment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  New Current Quantity in Warehouse *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-base font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Adjustment Reason / Audit Trail *
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="Restock Shipment Received">Restock Shipment Received</option>
                  <option value="Inventory Count Correction">Physical Inventory Count Correction</option>
                  <option value="Damaged / Faulty Unit Written Off">Damaged / Faulty Unit Written Off</option>
                  <option value="Customer Return Restocked">Customer Return Restocked</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm"
                >
                  {isAdjusting ? "Updating..." : "Confirm & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
