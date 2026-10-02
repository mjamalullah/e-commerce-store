"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  Palette,
  Image as ImageIcon,
  Tag,
  Star,
  FileSpreadsheet,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Layers,
  FileText,
  Layout,
  PackagePlus,
  Zap,
  Gift,
  Compass,
  Code,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/admin/login");
        } else {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-100">{children}</div>;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Homepage Builder", href: "/admin/homepage-builder", icon: Layers },
    { label: "Visual Page Builder", href: "/admin/pages", icon: FileText },
    { label: "Header Builder", href: "/admin/header-builder", icon: Layout },
    { label: "Footer Builder", href: "/admin/footer-builder", icon: Layout },
    { label: "Mega Menu", href: "/admin/navigation", icon: Menu },
    { label: "Products Catalog", href: "/admin/products", icon: Package },
    { label: "Collections", href: "/admin/collections", icon: Boxes },
    { label: "Product Bundles", href: "/admin/bundles", icon: PackagePlus },
    { label: "Flash Deals", href: "/admin/flash-sales", icon: Zap },
    { label: "Orders & Fulfillment", href: "/admin/orders", icon: ShoppingCart },
    { label: "Abandoned Carts", href: "/admin/abandoned-carts", icon: ShoppingCart },
    { label: "Inventory Ledger", href: "/admin/inventory", icon: Boxes },
    { label: "Forms & Leads", href: "/admin/forms", icon: FileSpreadsheet },
    { label: "Marketing Popups", href: "/admin/popups", icon: Sparkles },
    { label: "Gift Cards", href: "/admin/gift-cards", icon: Gift },
    { label: "Discount Coupons", href: "/admin/coupons", icon: Tag },
    { label: "Customer Reviews", href: "/admin/reviews", icon: Star },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    { label: "Theme Customizer", href: "/admin/customizer", icon: Palette },
    { label: "SEO Redirects", href: "/admin/seo/redirects", icon: Compass },
    { label: "Custom Code / Pixel", href: "/admin/settings/custom-code", icon: Code },
    { label: "Store Settings", href: "/admin/settings", icon: Settings },
    { label: "Bulk Data Tools", href: "/admin/bulk", icon: FileSpreadsheet },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center">
            A
          </div>
          <span className="font-bold text-sm">Apex Admin Portal</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-black text-white text-base tracking-tight block">
                  Apex Commerce
                </span>
                <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase block">
                  Enterprise Control
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Profile and Store Links */}
          <div className="p-4 border-t border-slate-800 space-y-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2 bg-slate-800 hover:bg-slate-700/80 rounded-xl text-xs font-semibold text-emerald-400 transition-colors"
            >
              <span>View Live Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {currentUser && (
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white shrink-0">
                    {currentUser.name?.[0] || "A"}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <span className="text-[10px] text-emerald-400 font-mono block">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* WordPress-style Top Admin Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Apex Gadgets Store
            </span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-xs font-bold text-slate-600 capitalize">
              {pathname === "/admin" ? "Dashboard" : pathname.replace("/admin/", "").replace(/-/g, " ")}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Live Store Button (WordPress Style) */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow-sm transition-all"
              title="Open public live store in a new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>👁 VIEW STORE</span>
            </Link>

            {/* Live Preview (Draft Mode) Button */}
            <Link
              href="/?preview=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold shadow-xs hover:shadow-sm transition-all"
              title="Preview unpublished draft changes with admin bar"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">LIVE PREVIEW</span>
              <span className="sm:hidden">PREVIEW</span>
            </Link>

            {/* Homepage Builder Quick Link */}
            <Link
              href="/admin/homepage-builder"
              className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Homepage Builder</span>
            </Link>

            {currentUser && (
              <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs font-medium text-slate-600">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px]">
                  {currentUser.name?.[0] || "A"}
                </div>
                <span className="truncate max-w-[100px]">{currentUser.name}</span>
              </div>
            )}
          </div>
        </header>

        {/* Main Admin Page Content */}
        <main className="flex-1 overflow-y-auto min-h-screen p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
