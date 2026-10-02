import React from "react";
import prisma from "@/lib/prisma";
import { Tag, Plus, CheckCircle2, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-emerald-600" />
            <span>Coupons & Promotions</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create percentage discounts, fixed PKR cash off, or free delivery vouchers for campaigns.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Coupon Code</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Discount Value</th>
              <th className="py-3.5 px-4">Min. Spend</th>
              <th className="py-3.5 px-4">Times Used</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-mono font-black text-emerald-700">{c.code}</td>
                <td className="py-3 px-4 text-slate-600 font-semibold uppercase text-[10px]">
                  {c.type.replace(/_/g, " ")}
                </td>
                <td className="py-3 px-4 font-bold text-slate-900">
                  {c.type === "PERCENTAGE"
                    ? `${c.value}% OFF`
                    : c.type === "FIXED"
                    ? formatPrice(c.value)
                    : "Free Nationwide Shipping"}
                </td>
                <td className="py-3 px-4 text-slate-600">
                  {c.minSpend ? formatPrice(c.minSpend) : "No minimum"}
                </td>
                <td className="py-3 px-4 font-mono text-slate-700">{c.usageCount} orders</td>
                <td className="py-3 px-4">
                  {c.isActive ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                      <XCircle className="w-3.5 h-3.5" />
                      Inactive
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
