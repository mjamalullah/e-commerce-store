"use client";

import React, { useState } from "react";
import { Sliders, Palette, Layout, Trash2, Copy, MoveUp, MoveDown } from "lucide-react";
import { BuilderElement } from "@/types/builder";

interface InspectorPanelProps {
  element: BuilderElement | null;
  onUpdateElement: (updated: BuilderElement) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
}

export default function InspectorPanel({
  element,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
}: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<"content" | "layout" | "design">("content");

  if (!element) {
    return (
      <aside className="w-80 bg-white border-l border-slate-200/90 h-full p-6 flex flex-col items-center justify-center text-center text-slate-400">
        <Sliders className="w-10 h-10 stroke-[1.5] text-slate-300 mb-2" />
        <p className="text-xs font-bold text-slate-600">No Element Selected</p>
        <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
          Click any element on the live canvas to inspect and edit its content, layout, and styling.
        </p>
      </aside>
    );
  }

  const updateContent = (key: string, value: any) => {
    onUpdateElement({
      ...element,
      content: { ...element.content, [key]: value },
    });
  };

  const updateLayout = (key: string, value: any) => {
    onUpdateElement({
      ...element,
      layout: { ...element.layout, [key]: value },
    });
  };

  const updateDesign = (key: string, value: any) => {
    onUpdateElement({
      ...element,
      design: { ...element.design, [key]: value },
    });
  };

  return (
    <aside className="w-80 bg-white border-l border-slate-200/90 h-full flex flex-col justify-between shrink-0">
      <div>
        {/* Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              {element.type}
            </span>
            <h3 className="text-xs font-black text-slate-900 mt-1">Properties Inspector</h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onDuplicateElement(element.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Duplicate Element"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteElement(element.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete Element"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 p-1">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-colors ${
              activeTab === "content" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab("layout")}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-colors ${
              activeTab === "layout" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Layout
          </button>
          <button
            onClick={() => setActiveTab("design")}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-colors ${
              activeTab === "design" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Design
          </button>
        </div>

        {/* Inspector Fields */}
        <div className="p-4 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto">
          {/* TAB 1: CONTENT */}
          {activeTab === "content" && (
            <div className="space-y-3">
              {(element.type === "heading" || element.type === "text" || element.type === "button" || element.type === "countdown" || element.type === "reviews") && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700">Text Content</label>
                  <textarea
                    rows={3}
                    value={element.content.text || ""}
                    onChange={(e) => updateContent("text", e.target.value)}
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              )}

              {element.type === "heading" && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700">HTML Tag</label>
                  <select
                    value={element.content.tag || "h2"}
                    onChange={(e) => updateContent("tag", e.target.value)}
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="h1">H1 (Hero Title)</option>
                    <option value="h2">H2 (Section Heading)</option>
                    <option value="h3">H3 (Sub-heading)</option>
                    <option value="h4">H4 (Card Title)</option>
                    <option value="p">Paragraph</option>
                  </select>
                </div>
              )}

              {(element.type === "button" || element.type === "product_card") && (
                <>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Button Label</label>
                    <input
                      type="text"
                      value={element.content.buttonText || ""}
                      onChange={(e) => updateContent("buttonText", e.target.value)}
                      className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Target URL / Link</label>
                    <input
                      type="text"
                      value={element.content.url || ""}
                      onChange={(e) => updateContent("url", e.target.value)}
                      placeholder="/shop"
                      className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                    />
                  </div>
                </>
              )}

              {(element.type === "image" || element.type === "product_card") && (
                <>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Image URL</label>
                    <input
                      type="text"
                      value={element.content.imageUrl || ""}
                      onChange={(e) => updateContent("imageUrl", e.target.value)}
                      className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Alt Text (SEO)</label>
                    <input
                      type="text"
                      value={element.content.alt || ""}
                      onChange={(e) => updateContent("alt", e.target.value)}
                      className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                    />
                  </div>
                </>
              )}

              {element.type === "video" && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700">Video Embed URL</label>
                  <input
                    type="text"
                    value={element.content.videoUrl || ""}
                    onChange={(e) => updateContent("videoUrl", e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              )}

              {element.type === "html" && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700">Custom HTML Code</label>
                  <textarea
                    rows={6}
                    value={element.content.htmlCode || ""}
                    onChange={(e) => updateContent("htmlCode", e.target.value)}
                    className="mt-1 w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LAYOUT */}
          {activeTab === "layout" && (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700">Alignment</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(["left", "center", "right"] as const).map((a) => (
                    <button
                      key={a}
                      onClick={() => updateLayout("align", a)}
                      className={`py-1.5 text-xs font-bold rounded-lg border capitalize ${
                        element.layout.align === a
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">Padding</label>
                <input
                  type="text"
                  value={element.layout.padding || ""}
                  onChange={(e) => updateLayout("padding", e.target.value)}
                  placeholder="e.g. 10px 20px"
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">Margin</label>
                <input
                  type="text"
                  value={element.layout.margin || ""}
                  onChange={(e) => updateLayout("margin", e.target.value)}
                  placeholder="e.g. 0 0 16px 0"
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* TAB 3: DESIGN */}
          {activeTab === "design" && (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700">Text Color</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={element.design.color || "#0f172a"}
                    onChange={(e) => updateDesign("color", e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={element.design.color || ""}
                    onChange={(e) => updateDesign("color", e.target.value)}
                    placeholder="#0f172a"
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">Background Color</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={element.design.bgColor || "#ffffff"}
                    onChange={(e) => updateDesign("bgColor", e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={element.design.bgColor || ""}
                    onChange={(e) => updateDesign("bgColor", e.target.value)}
                    placeholder="transparent"
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">Font Size</label>
                <input
                  type="text"
                  value={element.design.fontSize || ""}
                  onChange={(e) => updateDesign("fontSize", e.target.value)}
                  placeholder="e.g. 24px or 1.5rem"
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">Border Radius</label>
                <input
                  type="text"
                  value={element.design.borderRadius || ""}
                  onChange={(e) => updateDesign("borderRadius", e.target.value)}
                  placeholder="e.g. 16px"
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">Box Shadow</label>
                <input
                  type="text"
                  value={element.design.shadow || ""}
                  onChange={(e) => updateDesign("shadow", e.target.value)}
                  placeholder="e.g. 0 10px 15px -3px rgba(0,0,0,0.1)"
                  className="mt-1 w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
