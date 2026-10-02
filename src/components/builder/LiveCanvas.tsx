"use client";

import React from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Move, Copy, Sparkles } from "lucide-react";
import { BuilderPageData, BuilderSection, BuilderColumn, BuilderElement } from "@/types/builder";
import ElementRenderer from "./ElementRenderer";

interface LiveCanvasProps {
  pageData: BuilderPageData;
  viewport: "desktop" | "tablet" | "mobile";
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onAddSection: (columnsCount: number) => void;
  onDeleteSection: (sectionId: string) => void;
  onMoveSection: (index: number, direction: "up" | "down") => void;
  onSelectColumnForAdd?: (columnId: string) => void;
}

export default function LiveCanvas({
  pageData,
  viewport,
  selectedElementId,
  onSelectElement,
  onAddSection,
  onDeleteSection,
  onMoveSection,
  onSelectColumnForAdd,
}: LiveCanvasProps) {
  // Compute viewport container width
  const viewportStyles = {
    desktop: "w-full max-w-full",
    tablet: "w-[768px] mx-auto shadow-2xl rounded-3xl border-8 border-slate-800 my-6 overflow-hidden",
    mobile: "w-[375px] mx-auto shadow-2xl rounded-3xl border-8 border-slate-800 my-6 overflow-hidden",
  };

  return (
    <div className="flex-1 bg-slate-100 overflow-y-auto p-4 sm:p-8 flex justify-center">
      <div className={`transition-all duration-300 min-h-screen bg-white ${viewportStyles[viewport]}`}>
        {pageData.sections.length === 0 ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center space-y-4 border-2 border-dashed border-slate-300 m-8 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Your Canvas is Empty</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Start by adding your first layout section below. You can choose 1, 2, 3, or 4 columns.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => onAddSection(1)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                + 1 Column Section
              </button>
              <button
                onClick={() => onAddSection(2)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                + 2 Columns Section
              </button>
              <button
                onClick={() => onAddSection(3)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                + 3 Columns Section
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {pageData.sections.map((section, sIdx) => (
              <section
                key={section.id}
                style={{
                  backgroundColor: section.bgColor || "transparent",
                  backgroundImage: section.bgImage ? `url(${section.bgImage})` : undefined,
                  paddingTop: section.paddingY || "40px",
                  paddingBottom: section.paddingY || "40px",
                }}
                className={`relative group/section border-2 border-transparent hover:border-emerald-400/50 transition-colors ${
                  section.layoutType === "container" ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" : "w-full"
                }`}
              >
                {/* Floating Section Toolbar */}
                <div className="absolute top-2 right-4 z-30 opacity-0 group-hover/section:opacity-100 transition-opacity flex items-center gap-1 bg-slate-900 text-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-lg">
                  <span className="text-emerald-400 mr-1">Section #{sIdx + 1}</span>
                  <button
                    onClick={() => onMoveSection(sIdx, "up")}
                    disabled={sIdx === 0}
                    className="p-1 hover:text-emerald-400 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onMoveSection(sIdx, "down")}
                    disabled={sIdx === pageData.sections.length - 1}
                    className="p-1 hover:text-emerald-400 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDeleteSection(section.id)}
                    className="p-1 hover:text-rose-400"
                    title="Delete Section"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Columns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {section.columns.map((column) => {
                    // Compute col-span based on desktop percentage
                    const spanDesktop = Math.round((column.widthDesktop / 100) * 12) || 12;
                    const colSpanClass = `md:col-span-${spanDesktop}`;

                    return (
                      <div
                        key={column.id}
                        className={`min-h-[100px] border border-dashed border-slate-200/90 rounded-2xl p-4 transition-colors relative group/column ${
                          spanDesktop === 12
                            ? "md:col-span-12"
                            : spanDesktop === 6
                            ? "md:col-span-6"
                            : spanDesktop === 4
                            ? "md:col-span-4"
                            : spanDesktop === 3
                            ? "md:col-span-3"
                            : "md:col-span-12"
                        }`}
                      >
                        {/* Column Elements */}
                        {column.elements.length === 0 ? (
                          <div className="h-24 flex items-center justify-center text-center text-xs text-slate-400">
                            <span className="text-[11px] font-semibold text-slate-400">
                              Select from left sidebar to add widget
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {column.elements.map((element) => {
                              const isSelected = selectedElementId === element.id;
                              return (
                                <div
                                  key={element.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectElement(element.id);
                                  }}
                                  className={`relative group/element cursor-pointer rounded-xl transition-all ${
                                    isSelected
                                      ? "ring-2 ring-emerald-500 shadow-md p-1"
                                      : "hover:ring-1 hover:ring-emerald-400/60 p-1"
                                  }`}
                                >
                                  {/* Floating Element Tag */}
                                  {isSelected && (
                                    <div className="absolute -top-3 left-2 z-20 px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-[9px] font-bold shadow-xs">
                                      {element.type}
                                    </div>
                                  )}

                                  <ElementRenderer element={element} isEditor={true} />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Bottom Add Section Action */}
            <div className="py-8 text-center border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
              <span className="text-xs font-bold text-slate-500">Insert New Section:</span>
              <button
                onClick={() => onAddSection(1)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-all"
              >
                1 Column
              </button>
              <button
                onClick={() => onAddSection(2)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-all"
              >
                2 Columns (50/50)
              </button>
              <button
                onClick={() => onAddSection(3)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-all"
              >
                3 Columns
              </button>
              <button
                onClick={() => onAddSection(4)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-all"
              >
                4 Columns
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
