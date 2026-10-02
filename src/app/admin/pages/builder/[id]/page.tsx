"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Eye,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Sliders,
} from "lucide-react";
import ElementsSidebar from "@/components/builder/ElementsSidebar";
import LiveCanvas from "@/components/builder/LiveCanvas";
import InspectorPanel from "@/components/builder/InspectorPanel";
import { BuilderPageData, BuilderSection, BuilderColumn, BuilderElement, ElementType } from "@/types/builder";

export default function VisualPageBuilderIDE() {
  const params = useParams();
  const router = useRouter();
  const pageId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Page metadata
  const [pageTitle, setPageTitle] = useState("Untitled Landing Page");
  const [pageSlug, setPageSlug] = useState("custom-landing");
  const [pageStatus, setPageStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");

  // Viewport mode
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Canvas page data tree
  const [pageData, setPageData] = useState<BuilderPageData>({ sections: [] });

  // Selection state
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Load page data
  useEffect(() => {
    if (!pageId) return;
    setLoading(true);
    fetch(`/api/admin/pages/${pageId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.page) {
          setPageTitle(data.page.title);
          setPageSlug(data.page.slug);
          setPageStatus(data.page.status || "DRAFT");
          try {
            const parsed = JSON.parse(data.page.builderData || "{\"sections\":[]}");
            setPageData(parsed);
          } catch {
            setPageData({ sections: [] });
          }
        }
      })
      .catch((err) => {
        setStatusMessage({ type: "error", text: "Failed to load page: " + err.message });
      })
      .finally(() => setLoading(false));
  }, [pageId]);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Find selected element from the tree
  const findElementById = (id: string | null): BuilderElement | null => {
    if (!id) return null;
    for (const section of pageData.sections) {
      for (const col of section.columns) {
        const el = col.elements.find((e) => e.id === id);
        if (el) return el;
      }
    }
    return null;
  };

  const selectedElement = findElementById(selectedElementId);

  // -------------------------------------------------------------
  // CANVAS OPERATIONS
  // -------------------------------------------------------------
  const handleAddSection = (columnsCount: number) => {
    const widthEach = Math.floor(100 / columnsCount);
    const newSection: BuilderSection = {
      id: `sec_${Date.now()}`,
      layoutType: "container",
      paddingY: "48px",
      columns: Array.from({ length: columnsCount }).map((_, idx) => ({
        id: `col_${Date.now()}_${idx}`,
        widthDesktop: widthEach,
        widthTablet: columnsCount > 2 ? 50 : widthEach,
        widthMobile: 100,
        elements: [],
      })),
    };

    setPageData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const handleDeleteSection = (sectionId: string) => {
    setPageData((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));
    if (selectedElementId) setSelectedElementId(null);
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= pageData.sections.length) return;
    const copy = [...pageData.sections];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setPageData({ sections: copy });
  };

  // Insert element into active column or first available column
  const handleAddElement = (type: ElementType) => {
    if (pageData.sections.length === 0) {
      // Auto-create a section first
      handleAddSection(1);
    }

    const newElement: BuilderElement = {
      id: `el_${Date.now()}`,
      type,
      content: {
        text: type === "heading" ? "New Section Title" : type === "text" ? "Click to customize this paragraph text." : undefined,
        buttonText: type === "button" ? "Explore Gadgets" : undefined,
        url: "/shop",
        imageUrl: type === "image" ? "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80" : undefined,
      },
      layout: {
        padding: "8px 0",
        align: "left",
      },
      design: {
        fontSize: type === "heading" ? "24px" : "14px",
      },
    };

    // Insert into the last column of the last section
    setPageData((prev) => {
      if (prev.sections.length === 0) return prev;
      const sections = [...prev.sections];
      const lastSec = sections[sections.length - 1];
      const targetCol = lastSec.columns[0];
      targetCol.elements.push(newElement);
      return { sections };
    });

    setSelectedElementId(newElement.id);
  };

  // Update selected element in tree
  const handleUpdateElement = (updated: BuilderElement) => {
    setPageData((prev) => {
      const sections = prev.sections.map((sec) => ({
        ...sec,
        columns: sec.columns.map((col) => ({
          ...col,
          elements: col.elements.map((el) => (el.id === updated.id ? updated : el)),
        })),
      }));
      return { sections };
    });
  };

  // Delete element from tree
  const handleDeleteElement = (id: string) => {
    setPageData((prev) => {
      const sections = prev.sections.map((sec) => ({
        ...sec,
        columns: sec.columns.map((col) => ({
          ...col,
          elements: col.elements.filter((el) => el.id !== id),
        })),
      }));
      return { sections };
    });
    setSelectedElementId(null);
  };

  // Duplicate element
  const handleDuplicateElement = (id: string) => {
    const el = findElementById(id);
    if (!el) return;
    const duplicated: BuilderElement = {
      ...JSON.parse(JSON.stringify(el)),
      id: `el_${Date.now()}`,
    };

    setPageData((prev) => {
      const sections = prev.sections.map((sec) => ({
        ...sec,
        columns: sec.columns.map((col) => {
          const idx = col.elements.findIndex((e) => e.id === id);
          if (idx !== -1) {
            const elements = [...col.elements];
            elements.splice(idx + 1, 0, duplicated);
            return { ...col, elements };
          }
          return col;
        }),
      }));
      return { sections };
    });
    setSelectedElementId(duplicated.id);
  };

  // Save changes to backend
  const handleSave = async (publish = false) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pageTitle,
          slug: pageSlug,
          builderData: pageData,
          status: publish ? "PUBLISHED" : "DRAFT",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPageStatus(publish ? "PUBLISHED" : "DRAFT");
        showStatus("success", publish ? "Page published successfully!" : "Draft saved successfully!");
      } else {
        showStatus("error", data.error || "Failed to save");
      }
    } catch (err: any) {
      showStatus("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-900 text-slate-100">
      {/* 1. Builder Top Bar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-40 shrink-0">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit to Pages"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              className="bg-transparent text-sm font-bold text-white border-b border-transparent hover:border-slate-700 focus:border-emerald-500 focus:outline-hidden px-1"
            />
            <span className="text-[10px] text-slate-500 block px-1">
              /pages/{pageSlug}
            </span>
          </div>
        </div>

        {/* Center: Viewport Switcher */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setViewport("desktop")}
            className={`p-1.5 rounded-lg transition-colors ${
              viewport === "desktop" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
            }`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`p-1.5 rounded-lg transition-colors ${
              viewport === "tablet" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`p-1.5 rounded-lg transition-colors ${
              viewport === "mobile" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
              pageStatus === "PUBLISHED"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
            }`}
          >
            {pageStatus}
          </span>

          <a
            href={`/pages/${pageSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </a>

          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Draft"}</span>
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/30 transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* Status Bar */}
      {statusMessage && (
        <div
          className={`px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 ${
            statusMessage.type === "success"
              ? "bg-emerald-500 text-slate-950 font-bold"
              : "bg-rose-600 text-white"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle className="w-3.5 h-3.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* 2. Builder Work Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Draggable Elements Sidebar */}
        <ElementsSidebar onAddElement={handleAddElement} />

        {/* Center: Live Responsive Canvas */}
        <LiveCanvas
          pageData={pageData}
          viewport={viewport}
          selectedElementId={selectedElementId}
          onSelectElement={(id) => setSelectedElementId(id)}
          onAddSection={handleAddSection}
          onDeleteSection={handleDeleteSection}
          onMoveSection={handleMoveSection}
        />

        {/* Right: Properties Inspector Panel */}
        <InspectorPanel
          element={selectedElement}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
        />
      </div>
    </div>
  );
}
