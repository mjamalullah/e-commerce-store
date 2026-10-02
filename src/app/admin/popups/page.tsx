"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Tag,
  Clock,
  ExternalLink,
  Save,
  CheckCircle,
} from "lucide-react";

export default function PopupsManagementPage() {
  const [popups, setPopups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const loadPopups = () => {
    setLoading(true);
    fetch("/api/admin/popups")
      .then((res) => res.json())
      .then((data) => {
        if (data.popups) setPopups(data.popups);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPopups();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPopup) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/popups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPopup),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setEditingPopup(null);
        loadPopups();
      } else {
        alert(data.error || "Failed to save popup");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this marketing popup?")) return;
    try {
      await fetch(`/api/admin/popups?id=${id}`, { method: "DELETE" });
      setPopups((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggle = async (popup: any) => {
    try {
      await fetch("/api/admin/popups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...popup, isEnabled: !popup.isEnabled }),
      });
      setPopups((prev) =>
        prev.map((p) => (p.id === popup.id ? { ...p, isEnabled: !p.isEnabled } : p))
      );
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
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Marketing Popup Builder
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create discount popups, newsletter opt-ins, exit intent promotions, and WhatsApp lead captures.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPopup({
              name: "Welcome First Order Discount",
              type: "DISCOUNT",
              title: "Get 10% OFF Your First Order!",
              subtitle: "Sign up today and get an instant discount code valid on all AMOLED smartwatches and audio accessories.",
              couponCode: "WELCOME10",
              buttonText: "Claim 10% Discount",
              buttonUrl: "/shop",
              triggerType: "DELAY",
              triggerValue: "5",
              imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
              isEnabled: true,
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Popup</span>
        </button>
      </div>

      {/* Popups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-xs text-slate-400">Loading popups...</div>
        ) : popups.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No active popups. Click &ldquo;Create Popup&rdquo; above to set up a new campaign.
          </div>
        ) : (
          popups.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              {p.imageUrl && (
                <div className="relative aspect-video bg-slate-900">
                  <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                </div>
              )}

              <div className="p-5 space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    {p.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Trigger: {p.triggerType} ({p.triggerValue}s)
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                {p.subtitle && <p className="text-xs text-slate-500 line-clamp-2">{p.subtitle}</p>}

                {p.couponCode && (
                  <div className="pt-1 flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Code: {p.couponCode}</span>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleToggle(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    p.isEnabled
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {p.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{p.isEnabled ? "Active" : "Disabled"}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingPopup(JSON.parse(JSON.stringify(p)));
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-slate-200 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Edit / Create Popup */}
      {isModalOpen && editingPopup && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-slate-900">
              {editingPopup.id ? "Edit Marketing Popup" : "Create Marketing Popup"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Internal Campaign Name</label>
                <input
                  type="text"
                  required
                  value={editingPopup.name}
                  onChange={(e) => setEditingPopup({ ...editingPopup, name: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Popup Type</label>
                  <select
                    value={editingPopup.type}
                    onChange={(e) => setEditingPopup({ ...editingPopup, type: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="DISCOUNT">Discount Code Offer</option>
                    <option value="NEWSLETTER">Newsletter Opt-in</option>
                    <option value="EXIT_INTENT">Exit Intent Retention</option>
                    <option value="WHATSAPP">WhatsApp Direct VIP</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Trigger Type</label>
                  <select
                    value={editingPopup.triggerType}
                    onChange={(e) => setEditingPopup({ ...editingPopup, triggerType: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="DELAY">Time Delay (Seconds)</option>
                    <option value="SCROLL">Scroll Percentage</option>
                    <option value="EXIT_INTENT">Exit Intent (Mouse Leave)</option>
                    <option value="ON_LOAD">Immediately on Load</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Headline</label>
                <input
                  type="text"
                  required
                  value={editingPopup.title}
                  onChange={(e) => setEditingPopup({ ...editingPopup, title: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={editingPopup.subtitle || ""}
                  onChange={(e) => setEditingPopup({ ...editingPopup, subtitle: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Coupon Code</label>
                  <input
                    type="text"
                    value={editingPopup.couponCode || ""}
                    onChange={(e) => setEditingPopup({ ...editingPopup, couponCode: e.target.value })}
                    placeholder="e.g. SAVE10"
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Trigger Value</label>
                  <input
                    type="text"
                    value={editingPopup.triggerValue || "5"}
                    onChange={(e) => setEditingPopup({ ...editingPopup, triggerValue: e.target.value })}
                    placeholder="e.g. 5 (seconds) or 50 (%)"
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Banner Image URL</label>
                <input
                  type="text"
                  value={editingPopup.imageUrl || ""}
                  onChange={(e) => setEditingPopup({ ...editingPopup, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">CTA Button Text</label>
                  <input
                    type="text"
                    value={editingPopup.buttonText || "Shop Now"}
                    onChange={(e) => setEditingPopup({ ...editingPopup, buttonText: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Target Link</label>
                  <input
                    type="text"
                    value={editingPopup.buttonUrl || "/shop"}
                    onChange={(e) => setEditingPopup({ ...editingPopup, buttonUrl: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="popActive"
                  checked={editingPopup.isEnabled}
                  onChange={(e) => setEditingPopup({ ...editingPopup, isEnabled: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <label htmlFor="popActive" className="text-xs font-bold text-slate-700">
                  Campaign is Active
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
                  {saving ? "Saving..." : "Save Popup"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
