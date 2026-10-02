"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Edit3,
  ExternalLink,
  Trash2,
  Sparkles,
  Layers,
  CheckCircle,
  Copy,
} from "lucide-react";

export default function PagesManagementPage() {
  const router = useRouter();
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newTemplate, setNewTemplate] = useState("BLANK");
  const [creating, setCreating] = useState(false);

  const loadPages = () => {
    setLoading(true);
    fetch("/api/admin/pages")
      .then((res) => res.json())
      .then((data) => {
        if (data.pages) setPages(data.pages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    setCreating(true);

    // Initial starter sections based on template
    let starterSections: any[] = [];
    if (newTemplate === "CAMPAIGN") {
      starterSections = [
        {
          id: "sec_hero",
          layoutType: "container",
          paddingY: "60px",
          bgColor: "#0f172a",
          columns: [
            {
              id: "col_1",
              widthDesktop: 100,
              elements: [
                {
                  id: "el_head",
                  type: "heading",
                  content: { text: newTitle, tag: "h1" },
                  layout: { align: "center" },
                  design: { color: "#ffffff", fontSize: "36px" },
                },
                {
                  id: "el_p",
                  type: "text",
                  content: { text: "Exclusive flash discount available nationwide with 100% official brand warranty and Cash on Delivery." },
                  layout: { align: "center", margin: "16px 0" },
                  design: { color: "#94a3b8" },
                },
                {
                  id: "el_btn",
                  type: "button",
                  content: { buttonText: "Claim Exclusive Deal", url: "/shop" },
                  layout: { align: "center" },
                  design: { bgColor: "#10b981", color: "#ffffff" },
                },
              ],
            },
          ],
        },
      ];
    }

    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          slug: newSlug || newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          templateType: newTemplate,
          builderData: { sections: starterSections },
          status: "DRAFT",
        }),
      });
      const data = await res.json();
      if (data.success && data.page) {
        setIsCreateModalOpen(false);
        router.push(`/admin/pages/builder/${data.page.id}`);
      } else {
        alert(data.error || "Failed to create page");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;
    try {
      await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
      setPages((prev) => prev.filter((p) => p.id !== id));
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
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Visual Pages & Landing Pages
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build custom marketing landing pages, campaign funnels, and store pages with our live visual drag-and-drop builder.
          </p>
        </div>

        <button
          onClick={() => {
            setNewTitle("");
            setNewSlug("");
            setIsCreateModalOpen(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Page with Visual Builder</span>
        </button>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading visual pages...</div>
        ) : pages.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Visual Pages Created Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create your first custom landing page using the Elementor-style Visual Page Builder.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              Start Building Now
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pages.map((p) => (
              <div
                key={p.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === "PUBLISHED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.status}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {p.templateType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">
                    URL: /pages/{p.slug}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/pages/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                    title="View Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <Link
                    href={`/admin/pages/builder/${p.id}`}
                    className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit in Visual Builder</span>
                  </Link>

                  <button
                    onClick={() => handleDeletePage(p.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete Page"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Create Visual Page */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">
              Create New Visual Page
            </h3>

            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug) {
                      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  placeholder="e.g. VIP Ramadan Sale 2026"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  URL Slug
                </label>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <span>/pages/</span>
                  <input
                    type="text"
                    required
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl font-mono text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Starter Template
                </label>
                <select
                  value={newTemplate}
                  onChange={(e) => setNewTemplate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  <option value="BLANK">Blank Canvas (Start from scratch)</option>
                  <option value="CAMPAIGN">Campaign Landing Page (Hero + CTA)</option>
                  <option value="PRODUCT_LANDING">Product Spotlight Page</option>
                  <option value="ABOUT">About Store Story</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  {creating ? "Launching Builder..." : "Launch Visual Builder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
