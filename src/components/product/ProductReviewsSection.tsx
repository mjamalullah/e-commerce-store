"use client";

import React, { useState } from "react";
import { Star, CheckCircle, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  title?: string | null;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: Date | string;
}

interface ProductReviewsSectionProps {
  productId: string;
  initialReviews: Review[];
}

export default function ProductReviewsSection({
  productId,
  initialReviews,
}: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          customerName,
          customerEmail,
          rating,
          comment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Thank you! Your review has been added.");
        setReviews([data.review, ...reviews]);
        setCustomerName("");
        setCustomerEmail("");
        setComment("");
        setRating(5);
      } else {
        setMessage(data.message || "Failed to submit review");
      }
    } catch {
      setMessage("Error submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-8">
      {/* Reviews Summary Header */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl sm:text-5xl font-black text-slate-900">{averageRating}</div>
          <div>
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    i < Math.round(Number(averageRating)) ? "fill-amber-400" : "text-slate-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Based on {reviews.length} customer reviews
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Existing Reviews List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Customer Feedback ({reviews.length})
          </h3>

          {reviews.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4">
              Be the first to review this gadget! Share your experience below.
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{rev.customerName}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Verified Buyer
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{formatDate(rev.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-amber-400" : "text-slate-200"}`}
                      />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Review Form */}
        <div className="lg:col-span-5 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Write a Review</span>
          </h3>

          {message && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Your Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${star <= rating ? "fill-amber-400" : "text-slate-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Hamza Tariq"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email (Optional)</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="hamza@example.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Review Details *</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the build quality, sound, battery, and delivery?"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
