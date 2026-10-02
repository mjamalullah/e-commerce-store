"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  MapPin,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";

interface FooterProps {
  storeName?: string;
  contactEmail?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  address?: string;
}

export default function Footer({
  storeName = "Apex Gadgets Pakistan",
  contactEmail = "support@apexgadgets.pk",
  contactPhone = "0321-8273588",
  whatsappNumber = "923218273588",
  address = "Shop # 14-16, Electronics City, Saddar, Karachi, Pakistan",
}: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* Trust Highlights Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cash on Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Pay safely at your doorstep across 200+ Pakistani cities</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine Tech</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direct official import from verified manufacturers</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7 Days Warranty</h4>
              <p className="text-xs text-slate-400 mt-0.5">Checking warranty & easy replacement assistance</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">WhatsApp Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Mon - Sat: 10 AM to 9 PM instant customer care</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white">{storeName}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Pakistan&apos;s leading platform for genuine smartwatches, wireless ANC earbuds, power banks, and smartphone accessories at wholesale competitive rates.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{contactPhone} / WhatsApp: 0321-8273588</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop?category=smart-watches" className="hover:text-emerald-400 transition-colors">
                  Smart Watches
                </Link>
              </li>
              <li>
                <Link href="/shop?category=wireless-earbuds" className="hover:text-emerald-400 transition-colors">
                  Wireless Earbuds
                </Link>
              </li>
              <li>
                <Link href="/shop?category=power-banks" className="hover:text-emerald-400 transition-colors">
                  Power Banks
                </Link>
              </li>
              <li>
                <Link href="/shop?category=fast-chargers-cables" className="hover:text-emerald-400 transition-colors">
                  GaN Chargers & Cables
                </Link>
              </li>
              <li>
                <Link href="/shop?category=gaming-gear" className="hover:text-emerald-400 transition-colors">
                  Gaming Gear & Audio
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/track-order" className="hover:text-emerald-400 transition-colors font-semibold text-emerald-400">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-emerald-400 transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-emerald-400 transition-colors">
                  7-Day Return Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-emerald-400 transition-colors">
                  About Our Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Couriers & Payments */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Stay Connected</h4>
            <p className="text-[11px] text-slate-400">Subscribe for secret VIP discounts & new arrivals:</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-1.5">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 flex-1"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Join
              </button>
            </form>

            <p className="text-[11px] text-slate-400 pt-2">Accepted Payment Modes:</p>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
              <span className="px-2 py-1 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">Cash on Delivery</span>
              <span className="px-2 py-1 bg-rose-950 text-rose-300 rounded border border-rose-800">JazzCash</span>
              <span className="px-2 py-1 bg-emerald-900 text-emerald-200 rounded border border-emerald-700">Easypaisa</span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">Bank Transfer</span>
              <span className="px-2 py-1 bg-blue-950 text-blue-300 rounded border border-blue-800">Visa / Mastercard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {storeName}. All Rights Reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/shipping-policy" className="hover:text-slate-400">Shipping Policy</Link>
          <Link href="/return-policy" className="hover:text-slate-400">Return Policy</Link>
          <Link href="/admin" className="hover:text-emerald-400 font-medium">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
