"use client";

import React, { useState, useEffect } from "react";
import {
  Gift,
  Plus,
  Trash2,
  Tag,
  Clock,
  Mail,
  Copy,
  CheckCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function GiftCardsPage() {
  const [giftCards, setGiftCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialValue, setInitialValue] = useState(5000);
  const [code, setCode] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadGiftCards = () => {
    setLoading(true);
    fetch("/api/admin/gift-cards")
      .then((res) => res.json())
      .then((data) => {
        if (data.giftCards) setGiftCards(data.giftCards);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadGiftCards();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/gift-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code || undefined,
          initialValue,
          recipientEmail,
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setCode("");
        setRecipientEmail("");
        setNotes("");
        loadGiftCards();
      } else {
        alert(data.error || "Failed to issue gift card");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gift card?")) return;
    try {
      await fetch(`/api/admin/gift-cards?id=${id}`, { method: "DELETE" });
      setGiftCards((prev) => prev.filter((g) => g.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const copyCode = (gcCode: string, id: string) => {
    navigator.clipboard.writeText(gcCode);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Gift Cards & Store Credits
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Issue digital gift vouchers and store credits to corporate clients and rewarding buyers.
          </p>
        </div>

        <button
          onClick={() => {
            setCode(`APEX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Gift Card</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-xs text-slate-400">Loading gift cards...</div>
        ) : giftCards.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No gift cards issued yet. Click &ldquo;Issue Gift Card&rdquo; above.
          </div>
        ) : (
          giftCards.map((gc) => (
            <div
              key={gc.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      gc.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {gc.status}
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {formatPrice(gc.balance)}
                  </span>
                </div>

                {/* Card Code */}
                <div className="mt-4 p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                  <span className="font-mono text-xs font-bold tracking-widest text-emerald-400">
                    {gc.code}
                  </span>
                  <button
                    onClick={() => copyCode(gc.code, gc.id)}
                    className="p-1 hover:text-emerald-400 text-slate-400 transition-colors"
                    title="Copy code"
                  >
                    {copiedId === gc.id ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {gc.recipientEmail && (
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{gc.recipientEmail}</span>
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Initial: {formatPrice(gc.initialValue)}</span>
                <button
                  onClick={() => handleDelete(gc.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Revoke / Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Issue New Gift Card</h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Gift Card Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono uppercase"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Initial Balance (PKR)</label>
                <input
                  type="number"
                  required
                  value={initialValue}
                  onChange={(e) => setInitialValue(parseFloat(e.target.value) || 0)}
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Recipient Email (Optional)</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="client@company.com"
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Notes / Purpose</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Corporate gifting voucher for Ramadan"
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
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
                  Issue Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
