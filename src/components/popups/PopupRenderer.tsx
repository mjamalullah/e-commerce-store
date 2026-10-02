"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Sparkles, Copy, CheckCircle, Tag } from "lucide-react";

export default function PopupRenderer() {
  const [activePopup, setActivePopup] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Only run on client
    const dismissed = sessionStorage.getItem("apex_popup_dismissed");
    if (dismissed) return;

    fetch("/api/popups/active")
      .then((res) => res.json())
      .then((data) => {
        if (!data.popups || data.popups.length === 0) return;
        const popup = data.popups[0]; // Take top active campaign
        setActivePopup(popup);

        const triggerType = popup.triggerType || "DELAY";
        const triggerValue = parseInt(popup.triggerValue) || 5;

        if (triggerType === "ON_LOAD") {
          setIsOpen(true);
        } else if (triggerType === "DELAY") {
          const timer = setTimeout(() => {
            setIsOpen(true);
          }, triggerValue * 1000);
          return () => clearTimeout(timer);
        } else if (triggerType === "SCROLL") {
          const handleScroll = () => {
            const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            if (scrolled >= triggerValue) {
              setIsOpen(true);
              window.removeEventListener("scroll", handleScroll);
            }
          };
          window.addEventListener("scroll", handleScroll);
          return () => window.removeEventListener("scroll", handleScroll);
        } else if (triggerType === "EXIT_INTENT") {
          const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 10) {
              setIsOpen(true);
              document.removeEventListener("mouseleave", handleMouseLeave);
            }
          };
          document.addEventListener("mouseleave", handleMouseLeave);
          return () => document.removeEventListener("mouseleave", handleMouseLeave);
        }
      })
      .catch(() => {});
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("apex_popup_dismissed", "true");
  };

  const handleCopyCode = () => {
    if (activePopup?.couponCode) {
      navigator.clipboard.writeText(activePopup.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (!isOpen || !activePopup) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/50 hover:bg-slate-900 text-white backdrop-blur-md transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Optional Campaign Visual Banner */}
        {activePopup.imageUrl && (
          <div className="relative aspect-video w-full bg-slate-900">
            <Image
              src={activePopup.imageUrl}
              alt={activePopup.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Special VIP Offer</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            {activePopup.title}
          </h3>

          {activePopup.subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              {activePopup.subtitle}
            </p>
          )}

          {/* Coupon Code Block */}
          {activePopup.couponCode && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-dashed border-emerald-300 flex items-center justify-between gap-3 max-w-xs mx-auto">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span className="font-mono font-black text-slate-900 text-sm tracking-wider">
                  {activePopup.couponCode}
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          )}

          <div className="pt-2">
            <Link
              href={activePopup.buttonUrl || "/shop"}
              onClick={handleClose}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>{activePopup.buttonText || "Shop Collection"}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
