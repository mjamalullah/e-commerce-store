import React from "react";
import { MessageCircle, PhoneCall, ShieldCheck } from "lucide-react";

interface WhatsAppBannerProps {
  title?: string | null;
  subtitle?: string | null;
  whatsappNumber?: string;
  buttonText?: string;
}

export default function WhatsAppBanner({
  title = "Looking for Bulk / Wholesale Orders in Pakistan?",
  subtitle = "We supply retail shops, corporate gifting clients, and online resellers with direct wholesale volume pricing and expedited TCS/Trax delivery.",
  whatsappNumber = "923218273588",
  buttonText = "Contact Wholesale Desk",
}: WhatsAppBannerProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-700/20 relative overflow-hidden">
        {/* Glow circle */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Wholesale & Support</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <a
            href={`https://wa.me/${whatsappNumber}?text=Salam!%20I%20am%20interested%20in%20wholesale%20rates.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>{buttonText}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
