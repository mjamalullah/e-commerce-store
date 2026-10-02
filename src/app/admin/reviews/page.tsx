"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle, XCircle, Trash2, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews(reviews.map((r) => (r.id === id ? { ...r, status } : r)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
          <span>Customer Reviews Moderation</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Approve, filter, and moderate ratings submitted by Pakistani customers.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-xs font-semibold text-slate-400">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Star className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No reviews submitted yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Review Comment</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{rev.customerName}</td>
                    <td className="py-3 px-4 font-medium text-emerald-700">
                      {rev.product?.name || "Product"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < rev.rating ? "fill-amber-400" : "text-slate-200"}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs">{rev.comment}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {formatDate(rev.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          rev.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : rev.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {rev.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {rev.status !== "APPROVED" && (
                          <button
                            onClick={() => handleUpdateStatus(rev.id, "APPROVED")}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[10px]"
                          >
                            Approve
                          </button>
                        )}
                        {rev.status !== "REJECTED" && (
                          <button
                            onClick={() => handleUpdateStatus(rev.id, "REJECTED")}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-lg text-[10px]"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(rev.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
