"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  Truck,
  Building,
  MessageCircle,
  BarChart,
  ShieldCheck,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/customizer")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSettings(data.settings);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMsg("");

    try {
      const res = await fetch("/api/admin/customizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMsg("Store settings saved successfully!");
        setSettings(data.settings);
      } else {
        alert(data.message || "Failed to update settings");
      }
    } catch {
      alert("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="py-20 text-center text-xs font-semibold text-slate-400">
        Loading store settings...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-600" />
            <span>Store Configuration & Policies</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure nationwide delivery charges, free shipping thresholds, bank accounts, and tracking tags.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 self-start cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {saveMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveMsg}</span>
        </div>
      )}

      {/* 1. Shipping & Cash on Delivery Rules */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
        <h2 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>Shipping & Cash on Delivery (COD) Rules</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Standard Courier Shipping Fee (PKR)
            </label>
            <input
              type="number"
              value={settings.baseShippingFee}
              onChange={(e) =>
                setSettings({ ...settings, baseShippingFee: parseFloat(e.target.value || "0") })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Default rate applied to standard orders across Pakistan.
            </span>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              FREE Shipping Threshold (PKR)
            </label>
            <input
              type="number"
              value={settings.freeShippingThreshold}
              onChange={(e) =>
                setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value || "0") })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-emerald-700"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Orders with subtotal above this qualify for 100% Free Shipping.
            </span>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer font-bold">
            <input
              type="checkbox"
              checked={settings.codEnabled}
              onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
              className="rounded text-emerald-600"
            />
            <span className="text-slate-800">Enable Cash on Delivery (COD) on Checkout</span>
          </label>
        </div>
      </div>

      {/* 2. Direct Bank Transfer Info */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
        <h2 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Building className="w-4 h-4 text-emerald-600" />
          <span>Manual Bank Transfer & Mobile Wallets</span>
        </h2>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Bank Account / IBAN / JazzCash Details
          </label>
          <textarea
            rows={3}
            value={settings.bankDetails}
            onChange={(e) => setSettings({ ...settings, bankDetails: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
          />
        </div>
      </div>

      {/* 3. WhatsApp Integration */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
        <h2 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>WhatsApp Notification & Customer Templates</span>
        </h2>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Admin WhatsApp Phone Number (International format, without &apos;+&apos;)
          </label>
          <input
            type="text"
            value={settings.whatsappNumber}
            onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
            placeholder="923218273588"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Default Order Dispatch Message Template
          </label>
          <textarea
            rows={3}
            value={settings.whatsappOrderTemplate}
            onChange={(e) => setSettings({ ...settings, whatsappOrderTemplate: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
          />
        </div>
      </div>

      {/* 4. Analytics & Pixel Tracking */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
        <h2 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <BarChart className="w-4 h-4 text-emerald-600" />
          <span>Marketing Analytics & Conversion Tracking</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Google Analytics (GA4) Measurement ID
            </label>
            <input
              type="text"
              value={settings.googleAnalyticsId}
              onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Meta (Facebook) Pixel ID
            </label>
            <input
              type="text"
              value={settings.metaPixelId}
              onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
              placeholder="123456789012345"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
