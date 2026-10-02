"use client";

import React, { useState } from "react";
import { CheckCircle, AlertCircle, Send, Loader2 } from "lucide-react";

interface FormFieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface DynamicFormEmbedProps {
  formSlug: string;
  title?: string;
  subtitle?: string;
  fields: FormFieldConfig[];
  submitButtonText?: string;
  successMessage?: string;
}

export default function DynamicFormEmbed({
  formSlug,
  title,
  subtitle,
  fields,
  submitButtonText = "Submit",
  successMessage = "Thank you! Your submission has been received.",
}: DynamicFormEmbedProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/forms/${formSlug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Submission failed. Please check your fields.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit form.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-black text-emerald-950">Thank You!</h3>
        <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
          {successMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
      {(title || subtitle) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg sm:text-xl font-black text-slate-900">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((f, idx) => (
          <div key={idx}>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              {f.label} {f.required && <span className="text-rose-500">*</span>}
            </label>

            {f.type === "textarea" ? (
              <textarea
                required={f.required}
                rows={4}
                placeholder={f.placeholder || ""}
                value={formData[f.name] || ""}
                onChange={(e) => handleChange(f.name, e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            ) : f.type === "dropdown" ? (
              <select
                required={f.required}
                value={formData[f.name] || ""}
                onChange={(e) => handleChange(f.name, e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select an option</option>
                {f.options?.map((opt, oIdx) => (
                  <option key={oIdx} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={f.type === "phone" ? "tel" : f.type}
                required={f.required}
                placeholder={f.placeholder || ""}
                value={formData[f.name] || ""}
                onChange={(e) => handleChange(f.name, e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{submitButtonText}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
