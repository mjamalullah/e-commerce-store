"use client";

import React from "react";
import {
  Type,
  AlignLeft,
  Square,
  Image as ImageIcon,
  Video,
  Minus,
  MoveVertical,
  ShoppingBag,
  Grid,
  Clock,
  Star,
  ShieldCheck,
  List,
  Code,
  Share2,
  FileText,
} from "lucide-react";
import { ElementType } from "@/types/builder";

interface ElementsSidebarProps {
  onAddElement: (type: ElementType) => void;
}

export default function ElementsSidebar({ onAddElement }: ElementsSidebarProps) {
  const categories = [
    {
      name: "Typography & Content",
      items: [
        { type: "heading" as ElementType, label: "Heading", icon: Type, desc: "H1, H2, H3 titles" },
        { type: "text" as ElementType, label: "Text / Paragraph", icon: AlignLeft, desc: "Rich descriptions" },
        { type: "button" as ElementType, label: "Call to Action", icon: Square, desc: "Button linking to pages" },
        { type: "image" as ElementType, label: "Image", icon: ImageIcon, desc: "Banner or visual asset" },
        { type: "video" as ElementType, label: "Video Showcase", icon: Video, desc: "Embed YouTube or MP4" },
      ],
    },
    {
      name: "E-Commerce Widgets",
      items: [
        { type: "product_card" as ElementType, label: "Product Card", icon: ShoppingBag, desc: "Single gadget showcase" },
        { type: "countdown" as ElementType, label: "Countdown Timer", icon: Clock, desc: "Urgency flash deals timer" },
        { type: "trust_badges" as ElementType, label: "Trust Badges", icon: ShieldCheck, desc: "Warranty & COD features" },
        { type: "reviews" as ElementType, label: "Customer Reviews", icon: Star, desc: "Verified testimonials" },
      ],
    },
    {
      name: "Structure & Advanced",
      items: [
        { type: "divider" as ElementType, label: "Divider Line", icon: Minus, desc: "Separator rule" },
        { type: "spacer" as ElementType, label: "Spacer", icon: MoveVertical, desc: "Adjust vertical blank space" },
        { type: "accordion" as ElementType, label: "FAQ / Accordion", icon: List, desc: "Expandable questions" },
        { type: "html" as ElementType, label: "Custom HTML / Embed", icon: Code, desc: "Raw code block" },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200/90 h-full overflow-y-auto p-4 space-y-6 shrink-0">
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Elements Library
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Click any widget to insert into the selected section
        </p>
      </div>

      <div className="space-y-5">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="text-[11px] font-bold text-slate-700">{cat.name}</h4>
            <div className="grid grid-cols-2 gap-2">
              {cat.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    onClick={() => onAddElement(item.type)}
                    className="p-3 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all group cursor-pointer flex flex-col justify-between h-20"
                  >
                    <Icon className="w-4 h-4 text-slate-600 group-hover:text-emerald-600 transition-colors" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 block truncate">
                        {item.label}
                      </span>
                      <span className="text-[9px] text-slate-400 block truncate">
                        {item.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
