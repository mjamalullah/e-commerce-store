"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle,
  Eye,
  Mail,
  Phone,
  Clock,
} from "lucide-react";

export default function SubmissionsInboxPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const [formsRes] = await Promise.all([fetch("/api/admin/forms")]);
      const formsData = await formsRes.json();
      if (formsData.forms) setForms(formsData.forms);

      // Collect all submissions from forms
      const allSubmissions: any[] = [];
      for (const f of formsData.forms || []) {
        const singleRes = await fetch(`/api/admin/forms/${f.id}`);
        const singleData = await singleRes.json();
        if (singleData.form?.submissions) {
          for (const s of singleData.form.submissions) {
            allSubmissions.push({ ...s, formName: f.name, formSlug: f.slug });
          }
        }
      }

      // Sort newest first
      allSubmissions.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setSubmissions(allSubmissions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  // Filtered submissions
  const filtered = submissions.filter((s) => {
    if (selectedFormId !== "ALL" && s.formId !== selectedFormId) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const str = (s.data || "") + (s.formName || "");
      if (!str.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const rows: string[] = ["Submission ID,Form Name,Date,Data"];
    for (const sub of filtered) {
      const safeData = (sub.data || "").replace(/"/g, '""');
      rows.push(`"${sub.id}","${sub.formName}","${sub.createdAt}","${safeData}"`);
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `submissions_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/forms"
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-emerald-600" />
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Form Submissions Inbox
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review customer enquiries, quotation leads, and submissions with CSV export.
            </p>
          </div>
        </div>

        <button
          onClick={exportCSV}
          disabled={filtered.length === 0}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto disabled:opacity-40"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search within submission fields or emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={selectedFormId}
          onChange={(e) => setSelectedFormId(e.target.value)}
          className="w-full sm:w-60 px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
        >
          <option value="ALL">All Forms ({submissions.length})</option>
          {forms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading submissions...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No submissions found matching criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((sub) => {
              let parsed: Record<string, any> = {};
              try {
                parsed = JSON.parse(sub.data || "{}");
              } catch {}

              const customerName = parsed.fullName || parsed.contactPerson || parsed.name || "Customer";
              const email = parsed.email || "";
              const phone = parsed.phone || "";

              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubmission(sub)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        {sub.formName}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{customerName}</h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{email}</span>
                        </span>
                      )}
                      {phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{phone}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                    </span>
                    <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: View Submission Details */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  {selectedSubmission.formName}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">Submission Details</h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {(() => {
                let parsed: Record<string, any> = {};
                try {
                  parsed = JSON.parse(selectedSubmission.data || "{}");
                } catch {}

                return Object.entries(parsed).map(([key, val]) => (
                  <div key={key} className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {key}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 break-words block mt-0.5">
                      {String(val)}
                    </span>
                  </div>
                ));
              })()}
            </div>

            <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
              <span>IP: {selectedSubmission.ipAddress || "127.0.0.1"}</span>
              <span>{new Date(selectedSubmission.createdAt).toLocaleString()}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
