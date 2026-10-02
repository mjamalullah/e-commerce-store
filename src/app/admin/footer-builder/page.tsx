"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  Save,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Layout,
} from "lucide-react";

export default function FooterBuilderPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [aboutText, setAboutText] = useState("");
  const [showNewsletter, setShowNewsletter] = useState(true);
  const [copyrightText, setCopyrightText] = useState("");
  const [columns, setColumns] = useState<Array<{ title: string; links: Array<{ label: string; url: string }> }>>([]);

  const loadFooter = () => {
    setLoading(true);
    fetch("/api/admin/footer-builder")
      .then((res) => res.json())
      .then((data) => {
        if (data.footer) {
          setAboutText(data.footer.aboutText || "");
          setShowNewsletter(data.footer.showNewsletter);
          setCopyrightText(data.footer.copyrightText || "");
          try {
            setColumns(JSON.parse(data.footer.columns || "[]"));
          } catch {
            setColumns([]);
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFooter();
  }, []);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const addColumn = () => {
    setColumns([
      ...columns,
      {
        title: "New Column",
        links: [{ label: "Link 1", url: "/shop" }],
      },
    ]);
  };

  const removeColumn = (colIdx: number) => {
    setColumns(columns.filter((_, idx) => idx !== colIdx));
  };

  const addLinkToColumn = (colIdx: number) => {
    const copy = [...columns];
    copy[colIdx].links.push({ label: "New Link", url: "/shop" });
    setColumns(copy);
  };

  const removeLinkFromColumn = (colIdx: number, linkIdx: number) => {
    const copy = [...columns];
    copy[colIdx].links = copy[colIdx].links.filter((_, idx) => idx !== linkIdx);
    setColumns(copy);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/footer-builder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aboutText,
          showNewsletter,
          copyrightText,
          columns,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showStatus("success", "Footer layout saved successfully!");
      } else {
        showStatus("error", data.error || "Failed to save footer");
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
              Visual Footer Builder
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure multi-column navigation links, store summary text, and official copyright notices.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Footer"}</span>
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
        {/* Left Column: Store Summary & Copyright */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">About Store Summary</h3>
            <textarea
              rows={4}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
            />

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Copyright Notice</label>
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Right Columns: Multi-Column Link Groups */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Footer Navigation Columns</h3>
                <p className="text-xs text-slate-400">Add or customize link columns shown in the footer.</p>
              </div>
              <button
                type="button"
                onClick={addColumn}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Column</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {columns.map((col, colIdx) => (
                <div key={colIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) => {
                        const copy = [...columns];
                        copy[colIdx].title = e.target.value;
                        setColumns(copy);
                      }}
                      className="px-2.5 py-1 text-xs font-bold bg-white border border-slate-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeColumn(colIdx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {col.links.map((link, linkIdx) => (
                      <div key={linkIdx} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const copy = [...columns];
                            copy[colIdx].links[linkIdx].label = e.target.value;
                            setColumns(copy);
                          }}
                          placeholder="Label"
                          className="flex-1 px-2.5 py-1 text-[11px] bg-white border border-slate-200 rounded-lg"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => {
                            const copy = [...columns];
                            copy[colIdx].links[linkIdx].url = e.target.value;
                            setColumns(copy);
                          }}
                          placeholder="/path"
                          className="flex-1 px-2.5 py-1 text-[11px] bg-white border border-slate-200 rounded-lg font-mono text-slate-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeLinkFromColumn(colIdx, linkIdx)}
                          className="p-1 text-slate-300 hover:text-rose-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addLinkToColumn(colIdx)}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    + Add Link
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
