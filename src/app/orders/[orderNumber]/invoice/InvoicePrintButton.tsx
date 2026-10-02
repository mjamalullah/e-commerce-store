"use client";

import React from "react";
import { Printer } from "lucide-react";

export default function InvoicePrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
    >
      <Printer className="w-3.5 h-3.5" />
      <span>Print / Save as PDF</span>
    </button>
  );
}
