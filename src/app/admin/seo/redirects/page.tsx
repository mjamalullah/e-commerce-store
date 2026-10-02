"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Plus,
  Trash2,
  Edit2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function RedirectsManagementPage() {
  const [redirects, setRedirects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRedirect, setEditingRedirect] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const loadRedirects = () => {
    setLoading(true);
    fetch("/api/admin/redirects")
      .then((res) => res.json())
      .then((data) => {
        if (data.redirects) setRedirects(data.redirects);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRedirects();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRedirect) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingRedirect),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setEditingRedirect(null);
        loadRedirects();
      } else {
        alert(data.error || "Failed to save redirect");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this URL redirect?")) return;
    try {
      await fetch(`/api/admin/redirects?id=${id}`, { method: "DELETE" });
      setRedirects((prev) => prev.filter((r) => r.id !== id));
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
              <Compass className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              SEO 301 / 302 Redirect Manager
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Map legacy or modified product and category URLs to new destinations without losing Google rank or customer traffic.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingRedirect({
              sourceUrl: "/old-smartwatch-link",
              targetUrl: "/shop?category=smart-watches",
              statusCode: 301,
              isActive: true,
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Redirect</span>
        </button>
      </div>

      {/* Redirects List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading redirects...</div>
        ) : redirects.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No URL redirects configured yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {redirects.map((r) => (
              <div
                key={r.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono font-bold text-xs">
                    {r.statusCode}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-800 font-bold">{r.sourceUrl}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-emerald-600 font-bold">{r.targetUrl}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 mr-2">{r.hits} Hits</span>
                  <button
                    onClick={() => {
                      setEditingRedirect(JSON.parse(JSON.stringify(r)));
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && editingRedirect && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">
              {editingRedirect.id ? "Edit URL Redirect" : "Add URL Redirect"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Source Path (Old URL)</label>
                <input
                  type="text"
                  required
                  value={editingRedirect.sourceUrl}
                  onChange={(e) => setEditingRedirect({ ...editingRedirect, sourceUrl: e.target.value })}
                  placeholder="/old-category-name"
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Target Path (New URL)</label>
                <input
                  type="text"
                  required
                  value={editingRedirect.targetUrl}
                  onChange={(e) => setEditingRedirect({ ...editingRedirect, targetUrl: e.target.value })}
                  placeholder="/shop?category=smart-watches"
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">HTTP Status Code</label>
                <select
                  value={editingRedirect.statusCode}
                  onChange={(e) => setEditingRedirect({ ...editingRedirect, statusCode: parseInt(e.target.value) })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  <option value={301}>301 Permanent Redirect (Recommended for SEO)</option>
                  <option value={302}>302 Temporary Redirect</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="redirActive"
                  checked={editingRedirect.isActive}
                  onChange={(e) => setEditingRedirect({ ...editingRedirect, isActive: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <label htmlFor="redirActive" className="text-xs font-bold text-slate-700">
                  Redirect is Active
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
                  Save Redirect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
