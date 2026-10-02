"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Menu as MenuIcon,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

export default function MegaMenuBuilderPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const loadMenus = () => {
    setLoading(true);
    fetch("/api/admin/mega-menu")
      .then((res) => res.json())
      .then((data) => {
        if (data.menus) setMenus(data.menus);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMenus();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenu) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/mega-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMenu),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setEditingMenu(null);
        loadMenus();
      } else {
        alert(data.error || "Failed to save mega menu");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this mega menu?")) return;
    try {
      await fetch(`/api/admin/mega-menu?id=${id}`, { method: "DELETE" });
      setMenus((prev) => prev.filter((m) => m.id !== id));
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
              <MenuIcon className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Mega Menu & Navigation Builder
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build multi-column category dropdowns with featured product showcases and promotional campaign cards.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingMenu({
              title: "Smartwatches & Wearables",
              slug: "smartwatches-mega-menu",
              columnsCount: 4,
              content: [
                {
                  title: "By Display Type",
                  links: [
                    { label: "AMOLED Smartwatches", url: "/shop?category=smart-watches" },
                    { label: "HD Calling Watches", url: "/shop?category=smart-watches" },
                    { label: "Sports & Fitness Bands", url: "/shop?category=smart-watches" },
                  ],
                },
                {
                  title: "Top Brands",
                  links: [
                    { label: "QCY Watches", url: "/shop?brand=qcy" },
                    { label: "Soundpeats", url: "/shop?brand=soundpeats" },
                    { label: "Joyroom", url: "/shop?brand=joyroom" },
                  ],
                },
              ],
              sortOrder: menus.length + 1,
              isActive: true,
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Mega Menu</span>
        </button>
      </div>

      {/* Menus List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-xs text-slate-400">Loading mega menus...</div>
        ) : menus.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No custom mega menus configured. Click &ldquo;Add Mega Menu&rdquo; to build your first category dropdown.
          </div>
        ) : (
          menus.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    {m.columnsCount} Columns
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Order: #{m.sortOrder}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-2">{m.title}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">/{m.slug}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">
                  {m.isActive ? "Active" : "Disabled"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingMenu(JSON.parse(JSON.stringify(m)));
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Edit Mega Menu */}
      {isModalOpen && editingMenu && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-slate-900">
              {editingMenu.id ? "Edit Mega Menu" : "Create Mega Menu"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Menu Title (Shown in Header)</label>
                <input
                  type="text"
                  required
                  value={editingMenu.title}
                  onChange={(e) => setEditingMenu({ ...editingMenu, title: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">URL Slug</label>
                <input
                  type="text"
                  required
                  value={editingMenu.slug}
                  onChange={(e) => setEditingMenu({ ...editingMenu, slug: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Columns Count</label>
                  <select
                    value={editingMenu.columnsCount}
                    onChange={(e) => setEditingMenu({ ...editingMenu, columnsCount: parseInt(e.target.value) })}
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns (Default)</option>
                    <option value={5}>5 Columns</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Sort Order</label>
                  <input
                    type="number"
                    value={editingMenu.sortOrder || 1}
                    onChange={(e) => setEditingMenu({ ...editingMenu, sortOrder: parseInt(e.target.value) })}
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="menuActive"
                  checked={editingMenu.isActive}
                  onChange={(e) => setEditingMenu({ ...editingMenu, isActive: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <label htmlFor="menuActive" className="text-xs font-bold text-slate-700">
                  Mega Menu is Active
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
                  Save Mega Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
