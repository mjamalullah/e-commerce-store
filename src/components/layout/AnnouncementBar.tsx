"use client";

import React from "react";
import Link from "next/link";
import { Truck, MessageCircle, ShieldCheck, Sparkles, PhoneCall } from "lucide-react";

interface AnnouncementBarProps {
  text?: string;
  whatsappNumber?: string;
  contactPhone?: string;
}

export default function AnnouncementBar({
  text = "🚚 FREE Nationwide Delivery on Orders Above Rs. 3,500! ✦ 100% Original Brand Guarantee ✦ Cash on Delivery Available Across Pakistan ✦ 7 Days Easy Checking Warranty",
  whatsappNumber = "923218273588",
  contactPhone = "0321-8273588",
}: AnnouncementBarProps) {
  const tickerItems = [
    { text: "🚚 FREE Nationwide Delivery on Orders Above Rs. 3,500", link: "/shop" },
    { text: "✦ 100% Genuine Tech Brands with Official Warranty", link: "/shop" },
    { text: "⚡ Fast Cash on Delivery (COD) to Karachi, Lahore, Islamabad & 250+ Cities", link: "/shop" },
    { text: "✦ Wholesale & Bulk Pricing Available for Retailers", link: "/wholesale" },
    { text: "🔥 Flash Sale Deals Live — Save Up To 45% This Week", link: "/shop?onSale=true" },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 text-[11px] py-1.5 px-3 border-b border-slate-800/80 overflow-hidden relative select-none">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Quick Label */}
        <div className="hidden lg:flex items-center gap-1.5 text-emerald-400 font-bold tracking-wider uppercase text-[10px] shrink-0 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Announcements</span>
        </div>

        {/* Center: Infinite Continuous Scrolling Ticker */}
        <div className="flex-1 overflow-hidden relative group py-0.5">
          <div className="animate-marquee whitespace-nowrap flex items-center">
            {/* First Set */}
            {tickerItems.map((item, idx) => (
              <span key={`t1-${idx}`} className="inline-flex items-center mx-6">
                <Link
                  href={item.link}
                  className="hover:text-emerald-400 font-medium transition-colors cursor-pointer"
                >
                  {item.text}
                </Link>
                <span className="mx-6 text-emerald-500 font-black">✦</span>
              </span>
            ))}
            {/* Repeated Set for Seamless Looping */}
            {tickerItems.map((item, idx) => (
              <span key={`t2-${idx}`} className="inline-flex items-center mx-6">
                <Link
                  href={item.link}
                  className="hover:text-emerald-400 font-medium transition-colors cursor-pointer"
                >
                  {item.text}
                </Link>
                <span className="mx-6 text-emerald-500 font-black">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Contact Quick Links */}
        <div className="hidden md:flex items-center gap-4 shrink-0 text-slate-300 text-[11px]">
          <a
            href={`tel:${contactPhone.replace(/\D/g, "")}`}
            className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            <span>Call: {contactPhone}</span>
          </a>

          <a
            href={`https://wa.me/${whatsappNumber}?text=Salam!%20I%20need%20assistance%20with%20an%20order.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
          >
            <MessageCircle className="w-3 h-3 text-emerald-400" />
            <span>WhatsApp Support</span>
          </a>
        </div>
      </div>
    </div>
  );
}
