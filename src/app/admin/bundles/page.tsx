"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  PackagePlus,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Tag,
} from "lucide-react";

export default function BundlesManagementPage() {
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const loadBundles = () => {
    setLoading(true);
    fetch("/api/admin/bundles")
      .then((res) => res.json())
      .then((data) => {
        if (data.bundles) setBundles(data.bundles);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBundles();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBundle) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBundle),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setEditingBundle(null);
        loadBundles();
      } else {
        alert(data.error || "Failed to save bundle");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this bundle?")) return;
    try {
      await fetch(`/api/admin/bundles?id=${id}`, { method: "DELETE" });
      setBundles((prev) => prev.filter((b) => b.id !== id));
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
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <PackagePlus className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Product Bundles & Combos
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create combo packs (e.g. Smartwatch + Extra Straps + Wireless Earbuds) at special bundled prices to increase Average Order Value (AOV).
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBundle({
              name: "Ultimate AMOLED Fitness Combo",
              slug: "ultimate-amoled-fitness-combo",
              description: "QCY AMOLED Smartwatch + Soundpeats Wireless Earbuds + Extra Magnetic Charging Cable.",
              regularPrice: 18999,
              bundlePrice: 14499,
              image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
              isActive: true,
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Bundle</span>
        </button>
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-xs text-slate-400">Loading bundles...</div>
        ) : bundles.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No combo bundles created yet. Click &ldquo;Create Bundle&rdquo; above.
          </div>
        ) : (
          bundles.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              {b.image && (
                <div className="relative aspect-video bg-slate-900">
                  <Image src={b.image} alt={b.name} fill className="object-cover" />
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-[10px] uppercase shadow-md">
                    Save Rs. {b.regularPrice - b.bundlePrice}
                  </span>
                </div>
              )}

              <div className="p-5 space-y-2 flex-1">
                <h3 className="text-sm font-bold text-slate-900">{b.name}</h3>
                {b.description && <p className="text-xs text-slate-500 line-clamp-2">{b.description}</p>}

                <div className="pt-2 flex items-baseline gap-2">
                  <span className="text-lg font-black text-slate-900">Rs. {b.bundlePrice}</span>
                  <span className="text-xs text-slate-400 line-through">Rs. {b.regularPrice}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">
                  {b.isActive ? "Active" : "Disabled"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingBundle(JSON.parse(JSON.stringify(b)));
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-slate-200 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Edit Bundle */}
      {isModalOpen && editingBundle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-slate-900">
              {editingBundle.id ? "Edit Combo Bundle" : "Create Combo Bundle"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Bundle Name</label>
                <input
                  type="text"
                  required
                  value={editingBundle.name}
                  onChange={(e) => setEditingBundle({ ...editingBundle, name: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Slug</label>
                <input
                  type="text"
                  required
                  value={editingBundle.slug}
                  onChange={(e) => setEditingBundle({ ...editingBundle, slug: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Total Regular Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={editingBundle.regularPrice}
                    onChange={(e) => setEditingBundle({ ...editingBundle, regularPrice: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Special Bundle Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={editingBundle.bundlePrice}
                    onChange={(e) => setEditingBundle({ ...editingBundle, bundlePrice: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={editingBundle.description || ""}
                  onChange={(e) => setEditingBundle({ ...editingBundle, description: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Image URL</label>
                <input
                  type="text"
                  value={editingBundle.image || ""}
                  onChange={(e) => setEditingBundle({ ...editingBundle, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="bundleActive"
                  checked={editingBundle.isActive}
                  onChange={(e) => setEditingBundle({ ...editingBundle, isActive: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <label htmlFor="bundleActive" className="text-xs font-bold text-slate-700">
                  Bundle is Active
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
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Save Bundle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
