"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Sliders,
  Tv,
  ShieldCheck,
  Tag,
  AlertCircle,
  RefreshCw,
  History,
  Send,
  RotateCcw,
} from "lucide-react";

export default function HomepageBuilderPage() {
  const [activeTab, setActiveTab] = useState<"sections" | "slides" | "motion" | "trust" | "banners" | "versions">("sections");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Data states
  const [sections, setSections] = useState<any[]>([]);
  const [slides, setSlides] = useState<any[]>([]);
  const [motionItems, setMotionItems] = useState<any[]>([]);
  const [trustFeatures, setTrustFeatures] = useState<any[]>([]);
  const [versions, setVersions] = useState<any[]>([]);

  // Editing state for section modal
  const [editingSection, setEditingSection] = useState<any | null>(null);

  // Editing state for slide modal
  const [editingSlide, setEditingSlide] = useState<any | null>(null);

  // Editing state for motion modal
  const [editingMotion, setEditingMotion] = useState<any | null>(null);

  // Editing state for trust modal
  const [editingTrust, setEditingTrust] = useState<any | null>(null);

  // Fetch all initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const [secRes, slideRes, motionRes, trustRes, verRes] = await Promise.all([
        fetch("/api/admin/sections"),
        fetch("/api/admin/hero-slides"),
        fetch("/api/admin/motion-products"),
        fetch("/api/admin/trust-features"),
        fetch("/api/admin/sections/versions"),
      ]);

      const [secData, slideData, motionData, trustData, verData] = await Promise.all([
        secRes.json(),
        slideRes.json(),
        motionRes.json(),
        trustRes.json(),
        verRes.json(),
      ]);

      if (secData.sections) setSections(secData.sections);
      if (slideData.slides) setSlides(slideData.slides);
      if (motionData.items) setMotionItems(motionData.items);
      if (trustData.features) setTrustFeatures(trustData.features);
      if (verData.versions) setVersions(verData.versions);
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to load builder data: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4500);
  };

  // -------------------------------------------------------------
  // SECTIONS REORDERING & SAVING (DRAFT VS PUBLISH)
  // -------------------------------------------------------------
  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Recalculate sortOrder
    const updated = newSections.map((sec, idx) => ({
      ...sec,
      sortOrder: idx + 1,
      isDraftModified: true,
    }));

    setSections(updated);
  };

  const toggleSectionEnabled = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled, isDraftModified: true } : s))
    );
  };

  const handleSaveSections = async (isDraft: boolean = true) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isDraft,
          sections: sections.map((s, idx) => ({
            id: s.id,
            sortOrder: idx + 1,
            isEnabled: s.isEnabled,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(
          "success",
          isDraft
            ? "Draft flow saved! Click 'Live Preview' to preview changes without affecting live site."
            : "Section flow published directly to live storefront!"
        );
        loadData();
      } else {
        showNotification("error", data.error || "Failed to save order");
      }
    } catch (err: any) {
      showNotification("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSectionDetails = async (e: React.FormEvent, isDraft: boolean = true) => {
    e.preventDefault();
    if (!editingSection) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingSection,
          isDraft,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(
          "success",
          isDraft
            ? `Draft saved for "${editingSection.title || editingSection.sectionKey}". Click Live Preview to test.`
            : `Section "${editingSection.title || editingSection.sectionKey}" published live!`
        );
        setEditingSection(null);
        loadData();
      } else {
        showNotification("error", data.error || "Failed to update section");
      }
    } catch (err: any) {
      showNotification("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------
  // PUBLISH ALL DRAFTS TO LIVE STORE
  // -------------------------------------------------------------
  const handlePublishAll = async () => {
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/sections/publish", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showNotification("success", "All draft updates published live to public storefront!");
        loadData();
      } else {
        showNotification("error", data.error || "Publish failed");
      }
    } catch (err: any) {
      showNotification("error", err.message);
    } finally {
      setPublishing(false);
    }
  };

  // -------------------------------------------------------------
  // RESTORE HISTORICAL VERSION
  // -------------------------------------------------------------
  const handleRestoreVersion = async (versionId: string) => {
    if (!confirm("Are you sure you want to restore this version into draft mode?")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/sections/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification("success", data.message);
        loadData();
      } else {
        showNotification("error", data.error || "Restore failed");
      }
    } catch (err: any) {
      showNotification("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------
  // SLIDES CRUD
  // -------------------------------------------------------------
  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSlide),
      });
      const data = await res.json();
      if (data.success) {
        showNotification("success", "Hero slide saved successfully!");
        setEditingSlide(null);
        loadData();
      } else {
        showNotification("error", data.error || "Failed to save slide");
      }
    } catch (err: any) {
      showNotification("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    try {
      const res = await fetch(`/api/admin/hero-slides?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showNotification("success", "Slide deleted!");
        setSlides((prev) => prev.filter((s) => s.id !== id));
      } else {
        showNotification("error", data.error || "Failed to delete slide");
      }
    } catch (err: any) {
      showNotification("error", err.message);
    }
  };

  // -------------------------------------------------------------
  // MOTION ITEMS CRUD
  // -------------------------------------------------------------
  const handleSaveMotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMotion) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/motion-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMotion),
      });
      const data = await res.json();
      if (data.success) {
        showNotification("success", "Watch & Shop item saved!");
        setEditingMotion(null);
        loadData();
      } else {
        showNotification("error", data.error || "Failed to save motion item");
      }
    } catch (err: any) {
      showNotification("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMotion = async (id: string) => {
    if (!confirm("Delete this Watch & Shop item?")) return;
    try {
      const res = await fetch(`/api/admin/motion-products?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showNotification("success", "Item deleted!");
        setMotionItems((prev) => prev.filter((m) => m.id !== id));
      } else {
        showNotification("error", data.error || "Failed to delete item");
      }
    } catch (err: any) {
      showNotification("error", err.message);
    }
  };

  // -------------------------------------------------------------
  // TRUST FEATURES CRUD
  // -------------------------------------------------------------
  const handleSaveTrust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrust) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/trust-features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTrust),
      });
      const data = await res.json();
      if (data.success) {
        showNotification("success", "Trust feature saved!");
        setEditingTrust(null);
        loadData();
      } else {
        showNotification("error", data.error || "Failed to save trust feature");
      }
    } catch (err: any) {
      showNotification("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTrust = async (id: string) => {
    if (!confirm("Delete this trust badge?")) return;
    try {
      const res = await fetch(`/api/admin/trust-features?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showNotification("success", "Trust badge deleted!");
        setTrustFeatures((prev) => prev.filter((t) => t.id !== id));
      } else {
        showNotification("error", data.error || "Failed to delete");
      }
    } catch (err: any) {
      showNotification("error", err.message);
    }
  };

  // -------------------------------------------------------------
  // PROMO BANNERS HANDLER
  // -------------------------------------------------------------
  const promoSection = sections.find((s) => s.type === "PROMO_BANNERS");
  let promoBannersList: any[] = [];
  try {
    const cfg = JSON.parse(promoSection?.config || "{}");
    promoBannersList = cfg.banners || [];
  } catch {
    promoBannersList = [];
  }

  const handleUpdatePromoBanners = async (banners: any[]) => {
    if (!promoSection) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: promoSection.id,
          config: JSON.stringify({ banners }),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification("success", "Promotional banners updated successfully!");
        setSections((prev) =>
          prev.map((s) => (s.id === promoSection.id ? data.section : s))
        );
      } else {
        showNotification("error", data.error || "Failed to update banners");
      }
    } catch (err: any) {
      showNotification("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Homepage Layout & Content Builder
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Customize and control every visible section on the storefront without writing code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          {/* View Live Store (WordPress Style) */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            title="View public live store in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Store</span>
          </a>

          {/* Live Preview (Draft Mode) */}
          <a
            href="/?preview=true"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            title="Live Preview draft changes with floating publish bar"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Preview (Draft)</span>
          </a>

          {/* Publish All to Live */}
          <button
            onClick={handlePublishAll}
            disabled={publishing}
            className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-slate-950/20 cursor-pointer disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${publishing ? "animate-spin" : ""}`} />
            <span>{publishing ? "Publishing..." : "Publish to Live"}</span>
          </button>
        </div>
      </div>

      {/* Status Notification */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("sections")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "sections"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Section Flow & Order</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
            {sections.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("slides")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "slides"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Hero Slides</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
            {slides.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("motion")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "motion"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>Watch & Shop (Motion)</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
            {motionItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("trust")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "trust"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Trust Badges</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
            {trustFeatures.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("banners")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "banners"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Promo Banners</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
            {promoBannersList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("versions")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "versions"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Version History & Restore</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
            {versions.length}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: SECTION FLOW & REORDER */}
      {/* ======================================================== */}
      {activeTab === "sections" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-600">
              Drag or use Up/Down arrows to reorder. Save as draft to preview privately, or publish directly to the live store.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSaveSections(true)}
                disabled={saving}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft Order</span>
              </button>
              <button
                onClick={() => handleSaveSections(false)}
                disabled={saving}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Order Live</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {sections.map((sec, index) => (
              <div
                key={sec.id}
                className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                  !sec.isEnabled ? "bg-slate-50 opacity-60" : "hover:bg-slate-50/50"
                }`}
              >
                {/* Left: Reorder & Number */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveSection(index, "up")}
                      disabled={index === 0}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveSection(index, "down")}
                      disabled={index === sections.length - 1}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="w-7 h-7 rounded-lg bg-slate-100 font-mono text-xs font-black text-slate-700 flex items-center justify-center">
                    {index + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {sec.title || sec.sectionKey}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
                        {sec.type}
                      </span>
                    </div>
                    {sec.subtitle && (
                      <p className="text-xs text-slate-500 mt-0.5 max-w-lg truncate">
                        {sec.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setEditingSection(JSON.parse(JSON.stringify(sec)))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Configure</span>
                  </button>

                  <button
                    onClick={() => toggleSectionEnabled(sec.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      sec.isEnabled
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    {sec.isEnabled ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: HERO SLIDES */}
      {/* ======================================================== */}
      {activeTab === "slides" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Manage the dynamic hero banners on the homepage slider. Supports desktop & mobile visuals, custom buttons, and badges.
            </p>
            <button
              onClick={() =>
                setEditingSlide({
                  heading: "",
                  subheading: "",
                  badge: "",
                  buttonText: "Shop Now",
                  buttonUrl: "/shop",
                  desktopImage: "",
                  mobileImage: "",
                  sortOrder: slides.length + 1,
                  isActive: true,
                })
              }
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Slide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-slate-900">
                  <Image
                    src={s.desktopImage}
                    alt={s.heading}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.isActive
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-600 text-slate-200"
                      }`}
                    >
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1">
                  {s.badge && (
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                      {s.badge}
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {s.heading}
                  </h3>
                  {s.subheading && (
                    <p className="text-xs text-slate-500 line-clamp-2">{s.subheading}</p>
                  )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">
                    Order: #{s.sortOrder}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingSlide(JSON.parse(JSON.stringify(s)))}
                      className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSlide(s.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: WATCH & SHOP (MOTION PRODUCTS) */}
      {/* ======================================================== */}
      {activeTab === "motion" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Manage the in-motion &ldquo;Watch & Shop&rdquo; section items. Showcase high-interest products with live action visuals.
            </p>
            <button
              onClick={() =>
                setEditingMotion({
                  title: "",
                  subtitle: "",
                  badge: "Trending",
                  price: 5000,
                  salePrice: 4000,
                  imageUrl: "",
                  linkUrl: "/shop",
                  sortOrder: motionItems.length + 1,
                  isEnabled: true,
                })
              }
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Motion Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {motionItems.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className="relative h-64 bg-slate-900">
                  <Image
                    src={m.imageUrl}
                    alt={m.title}
                    fill
                    className="object-cover"
                  />
                  {m.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold">
                      {m.badge}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                  <p className="text-xs text-slate-500">{m.subtitle}</p>
                  <p className="text-xs font-black text-emerald-600 pt-1">
                    Rs. {m.salePrice || m.price}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    Order: {m.sortOrder}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingMotion(JSON.parse(JSON.stringify(m)))}
                      className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMotion(m.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: TRUST BADGES */}
      {/* ======================================================== */}
      {activeTab === "trust" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Manage the 4 trust & assurance badges shown directly beneath the hero section.
            </p>
            <button
              onClick={() =>
                setEditingTrust({
                  title: "",
                  description: "",
                  iconName: "Truck",
                  sortOrder: trustFeatures.length + 1,
                  isEnabled: true,
                })
              }
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Trust Badge</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustFeatures.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold mb-2 inline-block">
                    Icon: {t.iconName}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{t.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {t.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Order: {t.sortOrder}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingTrust(JSON.parse(JSON.stringify(t)))}
                      className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTrust(t.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: PROMO BANNERS */}
      {/* ======================================================== */}
      {activeTab === "banners" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Configure promotional campaign cards shown midway on the homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promoBannersList.map((banner, bIdx) => (
              <div
                key={bIdx}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Headline</label>
                    <input
                      type="text"
                      value={banner.title}
                      onChange={(e) => {
                        const copy = [...promoBannersList];
                        copy[bIdx].title = e.target.value;
                        setSections((prev) =>
                          prev.map((s) =>
                            s.type === "PROMO_BANNERS"
                              ? { ...s, config: JSON.stringify({ banners: copy }) }
                              : s
                          )
                        );
                      }}
                      className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Subtitle</label>
                    <input
                      type="text"
                      value={banner.subtitle || ""}
                      onChange={(e) => {
                        const copy = [...promoBannersList];
                        copy[bIdx].subtitle = e.target.value;
                        setSections((prev) =>
                          prev.map((s) =>
                            s.type === "PROMO_BANNERS"
                              ? { ...s, config: JSON.stringify({ banners: copy }) }
                              : s
                          )
                        );
                      }}
                      className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Image URL</label>
                    <input
                      type="text"
                      value={banner.image}
                      onChange={(e) => {
                        const copy = [...promoBannersList];
                        copy[bIdx].image = e.target.value;
                        setSections((prev) =>
                          prev.map((s) =>
                            s.type === "PROMO_BANNERS"
                              ? { ...s, config: JSON.stringify({ banners: copy }) }
                              : s
                          )
                        );
                      }}
                      className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Target Link</label>
                      <input
                        type="text"
                        value={banner.link}
                        onChange={(e) => {
                          const copy = [...promoBannersList];
                          copy[bIdx].link = e.target.value;
                          setSections((prev) =>
                            prev.map((s) =>
                              s.type === "PROMO_BANNERS"
                                ? { ...s, config: JSON.stringify({ banners: copy }) }
                                : s
                            )
                          );
                        }}
                        className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">Button Text</label>
                      <input
                        type="text"
                        value={banner.buttonText || "Shop Now"}
                        onChange={(e) => {
                          const copy = [...promoBannersList];
                          copy[bIdx].buttonText = e.target.value;
                          setSections((prev) =>
                            prev.map((s) =>
                              s.type === "PROMO_BANNERS"
                                ? { ...s, config: JSON.stringify({ banners: copy }) }
                                : s
                            )
                          );
                        }}
                        className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => handleUpdatePromoBanners(promoBannersList)}
              disabled={saving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Promo Banners"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: VERSION HISTORY & RESTORE */}
      {/* ======================================================== */}
      {activeTab === "versions" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">Homepage Version History</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every time you publish to live, an immutable snapshot is preserved. Restore any past version to draft mode with a single click.
              </p>
            </div>
            <button
              onClick={handlePublishAll}
              disabled={publishing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Create New Snapshot / Publish</span>
            </button>
          </div>

          {versions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <History className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Historical Snapshots Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Snapshots are automatically created each time you click &ldquo;Publish to Live&rdquo;. Publish your current layout to create your first backup version!
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
              {versions.map((ver, idx) => (
                <div key={ver.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center font-mono">
                        #{versions.length - idx}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{ver.versionName}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {ver.status}
                      </span>
                    </div>
                    {ver.notes && <p className="text-xs text-slate-500 pl-8">{ver.notes}</p>}
                    <p className="text-[11px] text-slate-400 pl-8 font-mono">
                      Recorded: {new Date(ver.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleRestoreVersion(ver.id)}
                      disabled={saving}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                      <span>Restore to Draft</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT SECTION CONFIG */}
      {/* ======================================================== */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Configure Section: {editingSection.title || editingSection.sectionKey}
                </h3>
                <span className="text-[10px] font-mono text-emerald-600">
                  Type: {editingSection.type}
                </span>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSectionDetails} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={editingSection.title || ""}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={editingSection.subtitle || ""}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, subtitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Badge (e.g. &ldquo;Limited Stock&rdquo;)
                  </label>
                  <input
                    type="text"
                    value={editingSection.badge || ""}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, badge: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    &ldquo;View All&rdquo; Link URL
                  </label>
                  <input
                    type="text"
                    value={editingSection.viewAllUrl || ""}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, viewAllUrl: e.target.value })
                    }
                    placeholder="/shop"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Special options for Product Carousels */}
              {(editingSection.type === "PRODUCT_CAROUSEL" ||
                editingSection.type === "FLASH_SALE" ||
                editingSection.type === "EXCLUSIVE_COLLECTION") && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900">
                    Product Selection Rules
                  </h4>
                  {(() => {
                    let cfg: any = {};
                    try {
                      cfg = JSON.parse(editingSection.config || "{}");
                    } catch {
                      cfg = {};
                    }

                    return (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-600 block mb-1">
                            Selection Method
                          </label>
                          <select
                            value={cfg.selectionMethod || "FEATURED"}
                            onChange={(e) => {
                              const updatedCfg = { ...cfg, selectionMethod: e.target.value };
                              setEditingSection({
                                ...editingSection,
                                config: JSON.stringify(updatedCfg),
                              });
                            }}
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                          >
                            <option value="FEATURED">Featured Products</option>
                            <option value="BESTSELLER">Best Sellers</option>
                            <option value="LATEST">New Arrivals</option>
                            <option value="ON_SALE">On Sale (Discounted)</option>
                            <option value="CATEGORY">Category Filter</option>
                          </select>
                        </div>

                        {cfg.selectionMethod === "CATEGORY" && (
                          <div>
                            <label className="text-xs text-slate-600 block mb-1">
                              Category Slug (e.g. smart-watches, wireless-earbuds)
                            </label>
                            <input
                              type="text"
                              value={cfg.categorySlug || ""}
                              onChange={(e) => {
                                const updatedCfg = { ...cfg, categorySlug: e.target.value };
                                setEditingSection({
                                  ...editingSection,
                                  config: JSON.stringify(updatedCfg),
                                });
                              }}
                              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                            />
                          </div>
                        )}

                        <div>
                          <label className="text-xs text-slate-600 block mb-1">
                            Number of Products to Display
                          </label>
                          <input
                            type="number"
                            min="2"
                            max="24"
                            value={cfg.count || 8}
                            onChange={(e) => {
                              const updatedCfg = {
                                ...cfg,
                                count: parseInt(e.target.value) || 8,
                              };
                              setEditingSection({
                                ...editingSection,
                                config: JSON.stringify(updatedCfg),
                              });
                            }}
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={(e) => handleSaveSectionDetails(e, true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={(e) => handleSaveSectionDetails(e, false)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Save & Publish Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: HERO SLIDE */}
      {/* ======================================================== */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-slate-900">
              {editingSlide.id ? "Edit Hero Slide" : "Create Hero Slide"}
            </h3>

            <form onSubmit={handleSaveSlide} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Heading</label>
                <input
                  type="text"
                  required
                  value={editingSlide.heading}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, heading: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Subheading</label>
                <textarea
                  rows={2}
                  value={editingSlide.subheading || ""}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, subheading: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Badge Text</label>
                  <input
                    type="text"
                    value={editingSlide.badge || ""}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, badge: e.target.value })
                    }
                    placeholder="e.g. Official Warranty"
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Sort Order</label>
                  <input
                    type="number"
                    value={editingSlide.sortOrder || 1}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        sortOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Desktop Image URL</label>
                <input
                  type="text"
                  required
                  value={editingSlide.desktopImage}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, desktopImage: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">
                  Mobile Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={editingSlide.mobileImage || ""}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, mobileImage: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Button Text</label>
                  <input
                    type="text"
                    value={editingSlide.buttonText || "Shop Now"}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, buttonText: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Button Link</label>
                  <input
                    type="text"
                    value={editingSlide.buttonUrl || "/shop"}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, buttonUrl: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="slideActive"
                  checked={editingSlide.isActive}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, isActive: e.target.checked })
                  }
                  className="rounded text-emerald-600"
                />
                <label htmlFor="slideActive" className="text-xs font-bold text-slate-700">
                  Slide is Active
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: WATCH & SHOP (MOTION ITEM) */}
      {/* ======================================================== */}
      {editingMotion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-slate-900">
              {editingMotion.id ? "Edit Motion Item" : "Create Motion Item"}
            </h3>

            <form onSubmit={handleSaveMotion} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingMotion.title}
                  onChange={(e) =>
                    setEditingMotion({ ...editingMotion, title: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">
                  Subtitle / Highlight
                </label>
                <input
                  type="text"
                  value={editingMotion.subtitle || ""}
                  onChange={(e) =>
                    setEditingMotion({ ...editingMotion, subtitle: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Regular Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={editingMotion.price}
                    onChange={(e) =>
                      setEditingMotion({ ...editingMotion, price: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Sale Price (PKR)</label>
                  <input
                    type="number"
                    value={editingMotion.salePrice || ""}
                    onChange={(e) =>
                      setEditingMotion({ ...editingMotion, salePrice: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Badge Text</label>
                  <input
                    type="text"
                    value={editingMotion.badge || ""}
                    onChange={(e) =>
                      setEditingMotion({ ...editingMotion, badge: e.target.value })
                    }
                    placeholder="Trending #1"
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Target Product URL</label>
                  <input
                    type="text"
                    value={editingMotion.linkUrl || "/shop"}
                    onChange={(e) =>
                      setEditingMotion({ ...editingMotion, linkUrl: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Image URL</label>
                <input
                  type="text"
                  required
                  value={editingMotion.imageUrl}
                  onChange={(e) =>
                    setEditingMotion({ ...editingMotion, imageUrl: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingMotion(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TRUST FEATURE */}
      {/* ======================================================== */}
      {editingTrust && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">
              {editingTrust.id ? "Edit Trust Badge" : "Create Trust Badge"}
            </h3>

            <form onSubmit={handleSaveTrust} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Title</label>
                <input
                  type="text"
                  required
                  value={editingTrust.title}
                  onChange={(e) =>
                    setEditingTrust({ ...editingTrust, title: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingTrust.description}
                  onChange={(e) =>
                    setEditingTrust({ ...editingTrust, description: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Icon</label>
                  <select
                    value={editingTrust.iconName}
                    onChange={(e) =>
                      setEditingTrust({ ...editingTrust, iconName: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Truck">Truck (Delivery)</option>
                    <option value="ShieldCheck">ShieldCheck (Warranty)</option>
                    <option value="RotateCcw">RotateCcw (Returns)</option>
                    <option value="Headphones">Headphones (Support)</option>
                    <option value="Zap">Zap (Fast)</option>
                    <option value="Award">Award (Original)</option>
                    <option value="CreditCard">CreditCard (Payment)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Sort Order</label>
                  <input
                    type="number"
                    value={editingTrust.sortOrder || 1}
                    onChange={(e) =>
                      setEditingTrust({
                        ...editingTrust,
                        sortOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingTrust(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Save Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
