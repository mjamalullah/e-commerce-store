"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Boxes,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ExternalLink,
  Layers,
  CheckCircle,
} from "lucide-react";

export default function CollectionsManagementPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const loadCollections = () => {
    setLoading(true);
    fetch("/api/admin/collections")
      .then((res) => res.json())
      .then((data) => {
        if (data.collections) setCollections(data.collections);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollection) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCollection),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setEditingCollection(null);
        loadCollections();
      } else {
        alert(data.error || "Failed to save collection");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this collection?")) return;
    try {
      await fetch(`/api/admin/collections?id=${id}`, { method: "DELETE" });
      setCollections((prev) => prev.filter((c) => c.id !== id));
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
              <Boxes className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Shopify-Style Collections
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Group products into curated or automated collections with dynamic rule criteria and custom banners.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCollection({
              name: "Elite AMOLED Smartwatches",
              slug: "elite-amoled-smartwatches",
              description: "Handpicked premium smartwatches with vivid AMOLED displays and zinc alloy bezels.",
              image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
              type: "AUTOMATED",
              rules: [{ field: "category", operator: "equals", value: "smart-watches" }],
              isPublished: true,
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Collection</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-xs text-slate-400">Loading collections...</div>
        ) : collections.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No custom collections created yet. Click &ldquo;Create Collection&rdquo; above.
          </div>
        ) : (
          collections.map((col) => (
            <div
              key={col.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              {col.image && (
                <div className="relative aspect-video bg-slate-900">
                  <Image src={col.image} alt={col.name} fill className="object-cover" />
                </div>
              )}

              <div className="p-5 space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    {col.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">/{col.slug}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{col.name}</h3>
                {col.description && <p className="text-xs text-slate-500 line-clamp-2">{col.description}</p>}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">
                  {col.isPublished ? "Published" : "Draft"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingCollection(JSON.parse(JSON.stringify(col)));
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-slate-200 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(col.id)}
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

      {/* Modal: Edit Collection */}
      {isModalOpen && editingCollection && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-slate-900">
              {editingCollection.id ? "Edit Collection" : "Create Collection"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Collection Title</label>
                <input
                  type="text"
                  required
                  value={editingCollection.name}
                  onChange={(e) => setEditingCollection({ ...editingCollection, name: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Slug</label>
                <input
                  type="text"
                  required
                  value={editingCollection.slug}
                  onChange={(e) => setEditingCollection({ ...editingCollection, slug: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Type</label>
                <select
                  value={editingCollection.type}
                  onChange={(e) => setEditingCollection({ ...editingCollection, type: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  <option value="AUTOMATED">Automated (Matches rules like category, price)</option>
                  <option value="MANUAL">Manual (Hand-selected products)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={editingCollection.description || ""}
                  onChange={(e) => setEditingCollection({ ...editingCollection, description: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Banner Image URL</label>
                <input
                  type="text"
                  value={editingCollection.image || ""}
                  onChange={(e) => setEditingCollection({ ...editingCollection, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="colPub"
                  checked={editingCollection.isPublished}
                  onChange={(e) => setEditingCollection({ ...editingCollection, isPublished: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <label htmlFor="colPub" className="text-xs font-bold text-slate-700">
                  Collection is Published
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
                  Save Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
