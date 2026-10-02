"use client";

import React, { useState, useEffect } from "react";
import {
  Palette,
  Save,
  CheckCircle2,
  Sparkles,
  Eye,
  Layers,
  Phone,
  MessageCircle,
  Truck,
  Globe,
} from "lucide-react";

export default function AdminCustomizerPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/customizer")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings(data.settings);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage("");

    try {
      const res = await fetch("/api/admin/customizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage("Store appearance and homepage layout updated successfully!");
        setSettings(data.settings);
      } else {
        alert(data.message || "Failed to update customizer");
      }
    } catch {
      alert("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleSection = (index: number) => {
    const copy = [...settings.homepageSections];
    copy[index].enabled = !copy[index].enabled;
    setSettings({ ...settings, homepageSections: copy });
  };

  const handleUpdateSectionTitle = (index: number, val: string) => {
    const copy = [...settings.homepageSections];
    copy[index].title = val;
    setSettings({ ...settings, homepageSections: copy });
  };

  if (isLoading || !settings) {
    return (
      <div className="py-20 text-center text-xs font-semibold text-slate-400">
        Loading customizer engine...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Palette className="w-6 h-6 text-emerald-600" />
            <span>Store Appearance & Layout Customizer</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Customize store branding, colors, announcement text, and homepage sections with zero coding.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 self-start cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save All Changes"}</span>
        </button>
      </div>

      {saveMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (6 cols): Store Branding & Theme Colors */}
        <div className="lg:col-span-6 space-y-6">
          {/* 1. Branding Information */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Store Identity & Branding</span>
            </h2>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Store Tagline / Slogan</label>
              <input
                type="text"
                value={settings.storeTagline}
                onChange={(e) => setSettings({ ...settings, storeTagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">WhatsApp Order Number</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Support Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Physical Store Address</label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          {/* 2. Top Announcement Bar */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Top Announcement Bar</span>
              </h2>
              <label className="flex items-center gap-2 cursor-pointer font-bold">
                <input
                  type="checkbox"
                  checked={settings.theme.showAnnouncement}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      theme: { ...settings.theme, showAnnouncement: e.target.checked },
                    })
                  }
                  className="rounded text-emerald-600"
                />
                <span>Active</span>
              </label>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Announcement Message</label>
              <input
                type="text"
                value={settings.theme.announcementText}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    theme: { ...settings.theme, announcementText: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Homepage Section Builder */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Homepage Section Layout Manager</span>
            </h2>
            <p className="text-slate-500 text-[11px]">
              Enable or disable individual sections shown on the store front page.
            </p>

            <div className="space-y-3">
              {settings.homepageSections?.map((section: any, idx: number) => (
                <div
                  key={section.id || idx}
                  className={`p-4 rounded-xl border-2 transition-all space-y-3 ${
                    section.enabled
                      ? "border-emerald-200 bg-emerald-50/30"
                      : "border-slate-200 bg-slate-50 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 capitalize">
                      {section.type.replace(/_/g, " ")} Section
                    </span>

                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={section.enabled}
                        onChange={() => handleToggleSection(idx)}
                        className="rounded text-emerald-600"
                      />
                      <span className={section.enabled ? "text-emerald-700" : "text-slate-400"}>
                        {section.enabled ? "Visible" : "Hidden"}
                      </span>
                    </label>
                  </div>

                  {section.title !== undefined && (
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">
                        Section Heading Title
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleUpdateSectionTitle(idx, e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
