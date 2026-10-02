"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  Save,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layout,
  ExternalLink,
} from "lucide-react";

export default function HeaderBuilderPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [layoutType, setLayoutType] = useState("DEFAULT");
  const [sticky, setSticky] = useState(true);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementLink, setAnnouncementLink] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [navLinks, setNavLinks] = useState<Array<{ label: string; url: string }>>([]);

  const loadHeader = () => {
    setLoading(true);
    fetch("/api/admin/header-builder")
      .then((res) => res.json())
      .then((data) => {
        if (data.header) {
          setLayoutType(data.header.layoutType || "DEFAULT");
          setSticky(data.header.sticky);
          setShowAnnouncement(data.header.showAnnouncement);
          setAnnouncementText(data.header.announcementText || "");
          setAnnouncementLink(data.header.announcementLink || "");
          setPhone(data.header.phone || "");
          setWhatsappNumber(data.header.whatsappNumber || "");
          try {
            setNavLinks(JSON.parse(data.header.navLinks || "[]"));
          } catch {
            setNavLinks([]);
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHeader();
  }, []);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const addNavLink = () => {
    setNavLinks([...navLinks, { label: "New Link", url: "/shop" }]);
  };

  const removeNavLink = (index: number) => {
    setNavLinks(navLinks.filter((_, idx) => idx !== index));
  };

  const moveNavLink = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= navLinks.length) return;
    const copy = [...navLinks];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setNavLinks(copy);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/header-builder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layoutType,
          sticky,
          showAnnouncement,
          announcementText,
          announcementLink,
          phone,
          whatsappNumber,
          navLinks,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showStatus("success", "Header configuration updated successfully!");
      } else {
        showStatus("error", data.error || "Failed to save header");
      }
    } catch (err: any) {
      showStatus("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Layout className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Visual Header Builder
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Customize header layout, announcement bar text, contact badges, and main menu navigation items.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Header"}</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {statusMessage.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Layout & Announcement Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Header Layout & Behavior</h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Header Style</label>
              <select
                value={layoutType}
                onChange={(e) => setLayoutType(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              >
                <option value="DEFAULT">Default (Qadri Gadgets Style: Logo Left + Search Center + Cart Right)</option>
                <option value="CENTER_LOGO">Centered Logo & Split Navigation</option>
                <option value="MINIMAL">Minimalist Compact Header</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="stickyHead"
                checked={sticky}
                onChange={(e) => setSticky(e.target.checked)}
                className="rounded text-emerald-600"
              />
              <label htmlFor="stickyHead" className="text-xs font-bold text-slate-700 cursor-pointer">
                Sticky Header (Stays visible while scrolling)
              </label>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Top Announcement Bar</h3>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="annActive"
                checked={showAnnouncement}
                onChange={(e) => setShowAnnouncement(e.target.checked)}
                className="rounded text-emerald-600"
              />
              <label htmlFor="annActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                Show Announcement Bar
              </label>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Announcement Text</label>
              <textarea
                rows={3}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Link (Optional)</label>
              <input
                type="text"
                value={announcementLink}
                onChange={(e) => setAnnouncementLink(e.target.value)}
                placeholder="/shop"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Right Columns: Main Navigation Menu Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Navigation Menu Items</h3>
                <p className="text-xs text-slate-400">Reorder or edit storefront navigation links.</p>
              </div>
              <button
                type="button"
                onClick={addNavLink}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Menu Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {navLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveNavLink(idx, "up")}
                      disabled={idx === 0}
                      className="text-slate-400 hover:text-slate-800 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveNavLink(idx, "down")}
                      disabled={idx === navLinks.length - 1}
                      className="text-slate-400 hover:text-slate-800 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="w-6 h-6 rounded bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const copy = [...navLinks];
                        copy[idx].label = e.target.value;
                        setNavLinks(copy);
                      }}
                      placeholder="Label"
                      className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => {
                        const copy = [...navLinks];
                        copy[idx].url = e.target.value;
                        setNavLinks(copy);
                      }}
                      placeholder="/shop"
                      className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono text-slate-600"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeNavLink(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
