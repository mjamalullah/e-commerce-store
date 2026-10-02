"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Clock,
  Phone,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AbandonedCartsPage() {
  const [carts, setCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCarts = () => {
    setLoading(true);
    fetch("/api/admin/abandoned-carts")
      .then((res) => res.json())
      .then((data) => {
        if (data.carts) setCarts(data.carts);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCarts();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin/abandoned-carts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setCarts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Abandoned Cart Recovery
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track visitors who added gadgets to their bag but exited before completing checkout. Send WhatsApp reminders to recover sales.
          </p>
        </div>
      </div>

      {/* Carts Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading abandoned carts...</div>
        ) : carts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            No abandoned carts recorded. Cart activity is automatically tracked as visitors add items.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {carts.map((cart) => {
              let items: any[] = [];
              try {
                items = JSON.parse(cart.items || "[]");
              } catch {}

              return (
                <div
                  key={cart.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {cart.customerName || "Guest Customer"}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cart.status === "RECOVERED"
                            ? "bg-emerald-100 text-emerald-800"
                            : cart.status === "REMINDED"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {cart.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {cart.customerPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cart.customerPhone}</span>
                        </span>
                      )}
                      {cart.customerEmail && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cart.customerEmail}</span>
                        </span>
                      )}
                      <span className="text-slate-400">•</span>
                      <span>{items.length} items in bag</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900 block">
                        {formatPrice(cart.totalAmount)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(cart.lastActiveAt).toLocaleString()}
                      </span>
                    </div>

                    {cart.customerPhone && (
                      <a
                        href={`https://wa.me/${cart.customerPhone.replace(/[^0-9]/g, "")}?text=Salam%20${encodeURIComponent(
                          cart.customerName || "Customer"
                        )}!%20You%20left%20items%20in%20your%20bag%20at%20Apex%20Commerce.%20Complete%20your%20order%20now%20for%20free%20TCS%20delivery!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleUpdateStatus(cart.id, "REMINDED")}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send WhatsApp Recovery</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
