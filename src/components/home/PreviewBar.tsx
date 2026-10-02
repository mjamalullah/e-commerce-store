"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowLeft, Edit3, Send, CheckCircle, AlertCircle, X } from "lucide-react";

export default function PreviewBar() {
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handlePublish = async () => {
    setPublishing(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/sections/publish", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setStatus("Published successfully! Storefront is now updated.");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } else {
        setStatus("Publish failed: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      setStatus("Error: " + err.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-slate-950 px-4 py-2.5 shadow-lg border-b border-amber-400/50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Preview Status Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-slate-950 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xs uppercase tracking-wider bg-slate-950/20 px-2 py-0.5 rounded text-slate-950">
                Preview Mode Active
              </span>
              <span className="text-xs font-bold text-slate-950 hidden md:inline">
                Viewing unpublished draft changes. Public storefront remains unaffected.
              </span>
            </div>
            {status && (
              <p className="text-[11px] font-bold text-slate-950 bg-white/40 px-2 py-0.5 rounded mt-1">
                {status}
              </p>
            )}
          </div>
        </div>

        {/* Right: Admin Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/10 hover:bg-slate-900/20 text-slate-950 rounded-lg text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>

          <Link
            href="/admin/homepage-builder"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/10 hover:bg-slate-900/20 text-slate-950 rounded-lg text-xs font-bold transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Sections</span>
          </Link>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 text-white rounded-lg text-xs font-bold shadow-md shadow-slate-950/20 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${publishing ? "animate-spin" : ""}`} />
            <span>{publishing ? "Publishing..." : "Publish to Live"}</span>
          </button>

          <Link
            href="/"
            className="p-1 text-slate-900 hover:text-slate-950 hover:bg-slate-900/10 rounded-md transition-colors"
            title="Exit Preview"
          >
            <X className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
