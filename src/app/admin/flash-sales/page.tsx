"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  Flame,
} from "lucide-react";

export default function FlashSalesManagementPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const loadSales = () => {
    setLoading(true);
    fetch("/api/admin/flash-sales")
      .then((res) => res.json())
      .then((data) => {
        if (data.flashSales) setSales(data.flashSales);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSales();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSale) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/flash-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSale),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setEditingSale(null);
        loadSales();
      } else {
        alert(data.error || "Failed to save flash sale");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this flash sale campaign?")) return;
    try {
      await fetch(`/api/admin/flash-sales?id=${id}`, { method: "DELETE" });
      setSales((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Zap className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Flash Deals & Urgent Sales
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Schedule limited-time discount blitz campaigns with live ticking countdown timers.
          </p>
        </div>

        <button
          onClick={() => {
            const start = new Date();
            const end = new Date();
            end.setDate(end.getDate() + 3);

            setEditingSale({
              name: "Weekend AMOLED Flash Blitz",
              badge: "⚡ 72 Hours Only",
              discountPercentage: 25,
              startDate: start.toISOString().substring(0, 16),
              endDate: end.toISOString().substring(0, 16),
              isActive: true,
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Flash Sale</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-xs text-slate-400">Loading flash sales...</div>
        ) : sales.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No flash sales configured. Click &ldquo;Create Flash Sale&rdquo; above.
          </div>
        ) : (
          sales.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                    {s.badge}
                  </span>
                  {s.discountPercentage && (
                    <span className="text-xs font-black text-rose-600">
                      -{s.discountPercentage}% OFF
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2">{s.name}</h3>

                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Starts: {new Date(s.startDate).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Ends: {new Date(s.endDate).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">
                  {s.isActive ? "Active" : "Disabled"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingSale({
                        ...s,
                        startDate: new Date(s.startDate).toISOString().substring(0, 16),
                        endDate: new Date(s.endDate).toISOString().substring(0, 16),
                      });
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-slate-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && editingSale && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">
              {editingSale.id ? "Edit Flash Sale" : "Create Flash Sale"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Campaign Name</label>
                <input
                  type="text"
                  required
                  value={editingSale.name}
                  onChange={(e) => setEditingSale({ ...editingSale, name: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Badge Label</label>
                  <input
                    type="text"
                    value={editingSale.badge}
                    onChange={(e) => setEditingSale({ ...editingSale, badge: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Discount %</label>
                  <input
                    type="number"
                    value={editingSale.discountPercentage || ""}
                    onChange={(e) => setEditingSale({ ...editingSale, discountPercentage: e.target.value })}
                    placeholder="25"
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Start Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={editingSale.startDate}
                  onChange={(e) => setEditingSale({ ...editingSale, startDate: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">End Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={editingSale.endDate}
                  onChange={(e) => setEditingSale({ ...editingSale, endDate: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="saleAct"
                  checked={editingSale.isActive}
                  onChange={(e) => setEditingSale({ ...editingSale, isActive: e.target.checked })}
                  className="rounded text-amber-500"
                />
                <label htmlFor="saleAct" className="text-xs font-bold text-slate-700">
                  Flash Sale is Active
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-xs"
                >
                  Save Flash Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
