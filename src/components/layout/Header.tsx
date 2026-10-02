"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  PhoneCall,
  User,
  ChevronDown,
  Sparkles,
  ChevronRight,
  Flame,
  Award,
  Watch,
  Headphones,
  BatteryCharging,
  Zap,
  Gamepad2,
  Home,
  MessageSquare,
  HelpCircle,
  Package,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import LiveSearchModal from "../search/LiveSearchModal";

interface HeaderProps {
  storeName?: string;
  contactPhone?: string;
  whatsappNumber?: string;
}

interface CategoryFlyout {
  id: string;
  name: string;
  slug: string;
  icon: any;
  subcategories: { name: string; slug: string }[];
}

export default function Header({
  storeName = "Apex Gadgets",
  contactPhone = "0321-8273588",
  whatsappNumber = "923218273588",
}: HeaderProps) {
  const { itemCount, total, setIsCartDrawerOpen } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("smart-watches");
  const [isSticky, setIsSticky] = useState(false);

  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // Categories list with icons and nested subcategories for the flyout dropdown
  const categoryList: CategoryFlyout[] = [
    {
      id: "1",
      name: "Smart Watches",
      slug: "smart-watches",
      icon: Watch,
      subcategories: [
        { name: "AMOLED Smartwatches", slug: "smart-watches?type=amoled" },
        { name: "Calling Smartwatches", slug: "smart-watches?type=calling" },
        { name: "Fitness & Sport Bands", slug: "smart-watches?type=fitness" },
        { name: "Kids Smartwatches", slug: "smart-watches?type=kids" },
        { name: "Replacement Straps", slug: "smart-watches?type=straps" },
      ],
    },
    {
      id: "2",
      name: "Wireless Earbuds & Audio",
      slug: "wireless-earbuds",
      icon: Headphones,
      subcategories: [
        { name: "Active Noise Cancellation (ANC)", slug: "wireless-earbuds?type=anc" },
        { name: "Gaming Ultra-Low Latency", slug: "wireless-earbuds?type=gaming" },
        { name: "Hi-Res LDAC Audio", slug: "wireless-earbuds?type=hires" },
        { name: "Wireless Neckbands", slug: "wireless-earbuds?type=neckbands" },
        { name: "Bluetooth Speakers", slug: "wireless-earbuds?type=speakers" },
      ],
    },
    {
      id: "3",
      name: "Power Banks",
      slug: "power-banks",
      icon: BatteryCharging,
      subcategories: [
        { name: "10,000 mAh Compact", slug: "power-banks?cap=10000" },
        { name: "20,000 mAh Heavy Duty", slug: "power-banks?cap=20000" },
        { name: "30,000 mAh High Capacity", slug: "power-banks?cap=30000" },
        { name: "Wireless MagSafe Power Banks", slug: "power-banks?type=magsafe" },
      ],
    },
    {
      id: "4",
      name: "GaN Fast Chargers & Cables",
      slug: "fast-chargers-cables",
      icon: Zap,
      subcategories: [
        { name: "65W & 100W Laptop Chargers", slug: "fast-chargers-cables?watts=65" },
        { name: "30W & 45W Mobile Fast Chargers", slug: "fast-chargers-cables?watts=30" },
        { name: "Braided 100W PD Cables", slug: "fast-chargers-cables?type=pd" },
        { name: "Multi-Port Desktop Docks", slug: "fast-chargers-cables?type=dock" },
      ],
    },
    {
      id: "5",
      name: "Gaming Gear & Accessories",
      slug: "gaming-gear",
      icon: Gamepad2,
      subcategories: [
        { name: "RGB Surround Headsets", slug: "gaming-gear?type=headset" },
        { name: "Mechanical Keyboards", slug: "gaming-gear?type=keyboard" },
        { name: "Finger Sleeves & Triggers", slug: "gaming-gear?type=mobile" },
      ],
    },
    {
      id: "6",
      name: "Smart Home & Lifestyle",
      slug: "home-living",
      icon: Home,
      subcategories: [
        { name: "LED Desk Lamps & Ambient Lights", slug: "home-living?type=lights" },
        { name: "Storage Organizers & Boxes", slug: "home-living?type=organizers" },
        { name: "Mini Portable Fans", slug: "home-living?type=fans" },
      ],
    },
  ];

  // Sticky header scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close category dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`w-full z-40 transition-all duration-300 ${
          isSticky
            ? "sticky top-0 shadow-2xl shadow-emerald-950/30"
            : "relative py-2.5 px-2 sm:px-4"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto bg-gradient-to-r from-[#033f24] via-[#095f37] to-[#0e7c48] text-white transition-all duration-300 border border-emerald-600/40 ${
            isSticky ? "rounded-none px-4 sm:px-6" : "rounded-2xl sm:rounded-3xl px-4 sm:px-6 shadow-xl shadow-emerald-950/20"
          }`}
        >
          {/* Main Top Row */}
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            {/* Left: Mobile Toggle + Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Toggle Navigation"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white text-emerald-800 flex items-center justify-center font-black shadow-md shadow-emerald-950/30 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-2xl font-black tracking-tight text-white drop-shadow-sm group-hover:text-emerald-100 transition-colors">
                    {storeName}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-emerald-200/90 -mt-0.5">
                    Original Tech & Wholesale
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links (Compact & Centered) */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-xs font-bold text-white">
              <Link
                href="/"
                className="px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                Home
              </Link>

              <Link
                href="/shop"
                className="px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                All Products
              </Link>

              {/* Product Categories Dropdown Trigger */}
              <div
                className="relative"
                ref={categoryMenuRef}
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                <button
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isCategoryMenuOpen ? "bg-white/20 text-white" : "hover:bg-white/10 text-white"
                  }`}
                >
                  <Package className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Product Categories</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isCategoryMenuOpen ? "rotate-180 text-emerald-200" : ""
                    }`}
                  />
                </button>

                {/* Nested Category Flyout Panel */}
                {isCategoryMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[560px] bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* Left List of Categories with Icons */}
                    <div className="w-1/2 bg-slate-50/80 border-r border-slate-100 p-2 space-y-1 max-h-[380px] overflow-y-auto">
                      {categoryList.map((cat) => {
                        const Icon = cat.icon;
                        const isHovered = activeCategory === cat.slug;
                        return (
                          <div
                            key={cat.id}
                            onMouseEnter={() => setActiveCategory(cat.slug)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                              isHovered
                                ? "bg-emerald-600 text-white font-bold shadow-xs"
                                : "text-slate-700 hover:bg-slate-100 font-semibold"
                            }`}
                          >
                            <Link
                              href={`/shop?category=${cat.slug}`}
                              className="flex items-center gap-2.5 flex-1 min-w-0"
                            >
                              <Icon className={`w-4 h-4 shrink-0 ${isHovered ? "text-white" : "text-emerald-600"}`} />
                              <span className="truncate text-xs">{cat.name}</span>
                            </Link>
                            <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isHovered ? "text-white" : "text-slate-400"}`} />
                          </div>
                        );
                      })}
                    </div>

                    {/* Right Flyout: Subcategories of the active category */}
                    <div className="w-1/2 p-4 bg-white flex flex-col justify-between">
                      {(() => {
                        const current =
                          categoryList.find((c) => c.slug === activeCategory) ||
                          categoryList[0];
                        return (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                                {current.name}
                              </h4>
                              <Link
                                href={`/shop?category=${current.slug}`}
                                className="text-[11px] font-bold text-emerald-600 hover:underline"
                              >
                                View All
                              </Link>
                            </div>

                            <div className="space-y-1.5">
                              {current.subcategories.map((sub, sIdx) => (
                                <Link
                                  key={sIdx}
                                  href={`/shop/${sub.slug}`}
                                  className="block px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })()}

                      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Certified 100% Genuine</span>
                        <Link href="/shop" className="text-emerald-600 font-bold hover:underline">
                          Catalog
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/wholesale"
                className="px-3 py-2 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-1"
              >
                <span>Wholesale & Bulk</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                  Save
                </span>
              </Link>

              <Link
                href="/reviews"
                className="px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                Reviews
              </Link>

              <Link
                href="/contact"
                className="px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </nav>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Search Overlay Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 transition-all cursor-pointer shadow-xs border border-white/10"
                title="Search products (Ctrl+K)"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-emerald-200" />
                <span className="hidden xl:inline text-xs font-medium text-white/90">
                  Search...
                </span>
              </button>

              {/* Direct Hotline Call */}
              <a
                href={`tel:${contactPhone.replace(/\D/g, "")}`}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
                title="Direct Phone Call"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-200" />
                <span className="hidden lg:inline">{contactPhone}</span>
              </a>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 text-white" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Customer Account */}
              <Link
                href="/account"
                className="hidden sm:flex p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
                title="My Account"
                aria-label="Account"
              >
                <User className="w-4 h-4 text-white" />
              </Link>

              {/* Cart Drawer Trigger Button */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold transition-all shadow-md shadow-emerald-950/30 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4 text-slate-950" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 w-4 h-4 bg-slate-950 text-amber-400 text-[10px] font-black rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-[9px] uppercase font-black text-slate-800 tracking-wider">Cart</span>
                  <span className="text-xs font-black">{formatPrice(total)}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex animate-in fade-in duration-200">
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col overflow-y-auto">
              {/* Drawer Header with Green Gradient */}
              <div className="p-4 bg-gradient-to-r from-[#033f24] to-[#0e7c48] text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white text-emerald-800 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block leading-tight">{storeName}</span>
                    <span className="text-[10px] text-emerald-200 font-medium">Smart Wholesale</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-1.5 text-xs font-bold text-slate-800">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 transition-colors"
                >
                  All Products
                </Link>

                <div className="pt-3 pb-1 px-3 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Product Categories
                </div>
                {categoryList.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700"
                    >
                      <Icon className="w-4 h-4 text-emerald-600" />
                      <span>{cat.name}</span>
                    </Link>
                  );
                })}

                <div className="pt-3 border-t border-slate-100 space-y-1">
                  <Link
                    href="/wholesale"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg hover:bg-slate-100"
                  >
                    Wholesale & Bulk Buying
                  </Link>
                  <Link
                    href="/reviews"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg hover:bg-slate-100"
                  >
                    Customer Reviews
                  </Link>
                  <Link
                    href="/track-order"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg hover:bg-slate-100"
                  >
                    Track Order
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg hover:bg-slate-100"
                  >
                    My Wishlist ({wishlistCount})
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-emerald-700 font-bold bg-emerald-50"
                  >
                    Admin Portal
                  </Link>
                </div>
              </div>

              {/* Drawer Footer Contact */}
              <div className="mt-auto p-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-800">Direct Contact & Orders</p>
                <a
                  href={`tel:${contactPhone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 text-slate-700 font-semibold"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call: {contactPhone}</span>
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-700 font-bold"
                >
                  <span>WhatsApp: {whatsappNumber}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Live Search Popup Overlay */}
      <LiveSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
