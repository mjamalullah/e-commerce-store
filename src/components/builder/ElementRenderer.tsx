"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  ChevronDown,
  ChevronUp,
  Play,
  Share2,
  Clock,
  Flame,
} from "lucide-react";
import { BuilderElement } from "@/types/builder";

interface ElementRendererProps {
  element: BuilderElement;
  isEditor?: boolean;
}

export default function ElementRenderer({ element, isEditor = false }: ElementRendererProps) {
  const { type, content, layout, design } = element;

  // Custom styling computed from element properties
  const customStyle: React.CSSProperties = {
    color: design.color || undefined,
    backgroundColor: design.bgColor || undefined,
    fontSize: design.fontSize || undefined,
    fontWeight: design.fontWeight || undefined,
    borderRadius: design.borderRadius || undefined,
    boxShadow: design.shadow || undefined,
    border: design.border || undefined,
    padding: layout.padding || undefined,
    margin: layout.margin || undefined,
    textAlign: layout.align || "left",
  };

  switch (type) {
    case "heading": {
      const Tag = (content.tag || "h2") as keyof JSX.IntrinsicElements;
      return (
        <Tag
          style={customStyle}
          className="font-black tracking-tight text-slate-900 leading-tight"
        >
          {content.text || "Heading Text"}
        </Tag>
      );
    }

    case "text":
      return (
        <div
          style={customStyle}
          className="text-xs sm:text-sm text-slate-600 leading-relaxed"
        >
          {content.text || "Add your paragraph description here. This can be edited from the visual inspector panel."}
        </div>
      );

    case "button":
      return (
        <div style={{ textAlign: layout.align || "left" }}>
          <Link
            href={content.url || "/shop"}
            style={customStyle}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md group"
          >
            <span>{content.buttonText || "Shop Now"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      );

    case "image":
      return (
        <div style={{ textAlign: layout.align || "center" }}>
          <div className="relative inline-block overflow-hidden rounded-2xl max-w-full">
            <Image
              src={content.imageUrl || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80"}
              alt={content.alt || "Visual Page Image"}
              width={600}
              height={400}
              className="object-cover rounded-2xl"
              style={customStyle}
            />
          </div>
        </div>
      );

    case "video":
      return (
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
          <div className="text-center text-white space-y-2 p-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/80 text-white flex items-center justify-center mx-auto hover:scale-110 transition-transform cursor-pointer shadow-lg">
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </div>
            <p className="text-xs text-slate-300">
              {content.videoUrl ? `Video Source: ${content.videoUrl}` : "Embedded Video Showcase"}
            </p>
          </div>
        </div>
      );

    case "divider":
      return (
        <hr
          style={{ borderColor: design.color || "#e2e8f0", margin: layout.margin || "20px 0" }}
          className="border-t"
        />
      );

    case "spacer":
      return <div style={{ height: layout.padding || "40px" }} />;

    case "product_card":
      return (
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs max-w-sm mx-auto">
          <div className="relative aspect-square rounded-xl bg-slate-100 overflow-hidden mb-3">
            <Image
              src={content.imageUrl || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=500&q=80"}
              alt="Featured Gadget"
              fill
              className="object-cover"
            />
          </div>
          <h4 className="text-sm font-bold text-slate-900">{content.text || "Apex AMOLED Smartwatch"}</h4>
          <p className="text-xs font-black text-emerald-600 mt-1">Rs. 6,499</p>
          <Link
            href={content.url || "/shop"}
            className="mt-3 block text-center py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Order Now
          </Link>
        </div>
      );

    case "countdown":
      return (
        <div className="bg-slate-900 text-white p-6 rounded-2xl text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold">
            <Flame className="w-3.5 h-3.5 fill-slate-950" />
            <span>Flash Deal Ends In</span>
          </div>
          <h3 className="text-lg font-black">{content.text || "Special Limited Sale"}</h3>
          <div className="flex items-center justify-center gap-3 font-mono font-bold text-lg text-amber-300">
            <div className="bg-white/10 px-3 py-1.5 rounded-xl">02d</div>
            <span>:</span>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl">14h</div>
            <span>:</span>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl">35m</div>
            <span>:</span>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl">12s</div>
          </div>
        </div>
      );

    case "trust_badges":
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Cash on Delivery</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>100% Original Brands</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>7-Day Return Warranty</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>24/7 WhatsApp Support</span>
          </div>
        </div>
      );

    case "reviews":
      return (
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs max-w-md mx-auto space-y-3">
          <div className="flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <p className="text-xs text-slate-600 italic">
            &ldquo;{content.text || "Best tech store in Pakistan! Order delivered to Lahore in 24 hours. Sealed pack and original warranty."}&rdquo;
          </p>
          <div className="flex items-center gap-2 pt-2 border-t text-[11px] font-bold text-slate-800">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
              U
            </div>
            <span>Usman Tariq — Verified Buyer</span>
          </div>
        </div>
      );

    case "accordion": {
      const items = content.items || [
        { title: "What is your delivery timeframe?", desc: "We deliver within 24-48 hours across major cities in Pakistan via TCS and Trax." },
        { title: "Do you offer Cash on Delivery?", desc: "Yes! Cash on Delivery is available in over 200 cities across Pakistan." },
      ];
      return (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <details
              key={idx}
              className="p-4 bg-white rounded-xl border border-slate-200 group cursor-pointer"
            >
              <summary className="font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between">
                <span>{item.title}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
            </details>
          ))}
        </div>
      );
    }

    case "html":
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: content.htmlCode || `<div style="padding:15px; background:#f8fafc; border-radius:12px; font-size:12px;">Custom HTML Block</div>`,
          }}
        />
      );

    default:
      return (
        <div className="p-4 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-400">
          Element: {type}
        </div>
      );
  }
}
