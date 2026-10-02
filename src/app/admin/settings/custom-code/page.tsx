"use client";

import React, { useState, useEffect } from "react";
import {
  Code,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

export default function CustomCodePage() {
  const [scripts, setScripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScript, setEditingScript] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const loadScripts = () => {
    setLoading(true);
    fetch("/api/admin/custom-scripts")
      .then((res) => res.json())
      .then((data) => {
        if (data.scripts) setScripts(data.scripts);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadScripts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScript) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/custom-scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingScript),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setEditingScript(null);
        loadScripts();
      } else {
        alert(data.error || "Failed to save script");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this custom code script?")) return;
    try {
      await fetch(`/api/admin/custom-scripts?id=${id}`, { method: "DELETE" });
      setScripts((prev) => prev.filter((s) => s.id !== id));
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
              <Code className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Custom Code & Tracking Script Manager
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Safely inject Google Analytics 4, Tag Manager, Meta Pixel, TikTok Pixel, or chat widgets into the storefront without touching files.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingScript({
              name: "Google Tag Manager (GA4)",
              location: "HEAD",
              code: `<!-- Google tag (gtag.js) -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-DEMO"></script>`,
              isEnabled: true,
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Script</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-xs text-slate-400">Loading custom scripts...</div>
        ) : scripts.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No custom scripts configured yet. Click &ldquo;Add Custom Script&rdquo; to embed your tracking codes.
          </div>
        ) : (
          scripts.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
                    Location: {s.location}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.isEnabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {s.isEnabled ? "Active" : "Disabled"}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2">{s.name}</h3>

                <pre className="mt-3 p-3 bg-slate-900 text-emerald-300 font-mono text-[11px] rounded-xl overflow-x-auto max-h-36">
                  {s.code}
                </pre>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setEditingScript(JSON.parse(JSON.stringify(s)));
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
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
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && editingScript && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">
              {editingScript.id ? "Edit Script" : "Add Custom Script"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Script Name</label>
                <input
                  type="text"
                  required
                  value={editingScript.name}
                  onChange={(e) => setEditingScript({ ...editingScript, name: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Injection Location</label>
                <select
                  value={editingScript.location}
                  onChange={(e) => setEditingScript({ ...editingScript, location: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  <option value="HEAD">&lt;head&gt; (Google Analytics, Meta Pixel, Verification)</option>
                  <option value="BODY_START">&lt;body&gt; Start (Google Tag Manager noscript)</option>
                  <option value="BODY_END">&lt;body&gt; End (Live Chat widgets, Conversion trackers)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Code / Script Content</label>
                <textarea
                  rows={6}
                  required
                  value={editingScript.code}
                  onChange={(e) => setEditingScript({ ...editingScript, code: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl bg-slate-900 text-emerald-300"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="scrActive"
                  checked={editingScript.isEnabled}
                  onChange={(e) => setEditingScript({ ...editingScript, isEnabled: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <label htmlFor="scrActive" className="text-xs font-bold text-slate-700">
                  Script is Enabled
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
                  Save Script
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
