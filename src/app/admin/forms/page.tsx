"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileSpreadsheet,
  Plus,
  Inbox,
  Edit2,
  Trash2,
  Sparkles,
  ExternalLink,
  CheckCircle,
} from "lucide-react";

export default function FormsManagementPage() {
  const router = useRouter();
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [template, setTemplate] = useState("CONTACT");
  const [creating, setCreating] = useState(false);

  const loadForms = () => {
    setLoading(true);
    fetch("/api/admin/forms")
      .then((res) => res.json())
      .then((data) => {
        if (data.forms) setForms(data.forms);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadForms();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setCreating(true);

    let presetFields: any[] = [];
    if (template === "CONTACT") {
      presetFields = [
        { name: "fullName", label: "Full Name", type: "text", required: true, placeholder: "e.g. Tariq Mehmood" },
        { name: "email", label: "Email Address", type: "email", required: true, placeholder: "tariq@gmail.com" },
        { name: "phone", label: "Phone / WhatsApp", type: "phone", required: true, placeholder: "0300-1234567" },
        { name: "message", label: "Your Message", type: "textarea", required: true, placeholder: "How can we help you?" },
      ];
    } else if (template === "WHOLESALE") {
      presetFields = [
        { name: "companyName", label: "Company / Shop Name", type: "text", required: true, placeholder: "Apex Tech Karachi" },
        { name: "contactPerson", label: "Contact Person", type: "text", required: true, placeholder: "Muhammad Ali" },
        { name: "phone", label: "WhatsApp Contact", type: "phone", required: true, placeholder: "0321-8273588" },
        { name: "city", label: "City", type: "text", required: true, placeholder: "Lahore / Karachi" },
        { name: "productsOfInterest", label: "Products of Interest", type: "textarea", required: true, placeholder: "Smartwatches, ANC earbuds, 65W chargers" },
        { name: "estimatedVolume", label: "Monthly Order Quantity", type: "dropdown", required: true, options: ["50 - 100 units", "100 - 500 units", "500+ units"] },
      ];
    }

    try {
      const res = await fetch("/api/admin/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          fields: presetFields,
          submitButtonText: template === "WHOLESALE" ? "Request Wholesale Quote" : "Send Message",
          successMessage: "Thank you! Our wholesale & support desk will contact you via WhatsApp shortly.",
        }),
      });
      const data = await res.json();
      if (data.success && data.form) {
        setIsCreateOpen(false);
        router.push(`/admin/forms/builder/${data.form.id}`);
      } else {
        alert(data.error || "Failed to create form");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this form and all its submissions?")) return;
    try {
      await fetch(`/api/admin/forms/${id}`, { method: "DELETE" });
      setForms((prev) => prev.filter((f) => f.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              WordPress-Style Form Builder
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build custom contact, wholesale, and enquiry forms with drag-and-drop fields, validation, and webhook automations.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/admin/forms/submissions"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Inbox className="w-4 h-4 text-slate-500" />
            <span>Submissions Inbox</span>
          </Link>

          <button
            onClick={() => {
              setName("");
              setSlug("");
              setIsCreateOpen(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Form</span>
          </button>
        </div>
      </div>

      {/* Forms List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading forms...</div>
        ) : forms.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Custom Forms Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create your first lead capture, wholesale quotation, or customer enquiry form.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              Create Form
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {forms.map((f) => {
              let fieldsCount = 0;
              try {
                fieldsCount = JSON.parse(f.fields || "[]").length;
              } catch {}

              return (
                <div
                  key={f.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{f.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">
                        {fieldsCount} Fields
                      </span>
                      {f.isActive ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Embed Slug: <span className="text-emerald-600 font-bold">{f.slug}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/forms/submissions?formId=${f.id}`}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Inbox className="w-3.5 h-3.5" />
                      <span>{f._count?.submissions || 0} Submissions</span>
                    </Link>

                    <Link
                      href={`/admin/forms/builder/${f.id}`}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Fields</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(f.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete Form"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Create Form */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">
              Create New Custom Form
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Form Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  placeholder="e.g. Bulk Wholesale Quotation Form"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Slug / Identifier
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="wholesale-quotation"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Starter Template
                </label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  <option value="CONTACT">Contact & Enquiry Form</option>
                  <option value="WHOLESALE">Wholesale & Bulk Orders Form</option>
                  <option value="BLANK">Blank Form</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  {creating ? "Creating..." : "Build Form"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
