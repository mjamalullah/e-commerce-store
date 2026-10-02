"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
  storeName?: string;
}

export default function FloatingWhatsApp({
  whatsappNumber = "923218273588",
  storeName = "Apex Gadgets",
}: FloatingWhatsAppProps) {
  const message = encodeURIComponent(`Salam ${storeName}! I need assistance with a product enquiry.`);
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      <span className="hidden sm:inline-block mr-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Chat on WhatsApp
      </span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
}
