"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileSpreadsheet,
  ArrowLeft,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  Settings,
  Send,
} from "lucide-react";

interface FormFieldItem {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "phone" | "number" | "dropdown" | "radio" | "checkbox" | "date" | "textarea" | "file";
  placeholder?: string;
  required: boolean;
  options?: string[]; // For dropdown/radio
}

export default function FormBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form details
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [fields, setFields] = useState<FormFieldItem[]>([]);
  const [submitButtonText, setSubmitButtonText] = useState("Submit");
  const [successMessage, setSuccessMessage] = useState("Thank you! Your submission has been received.");
  const [recipientEmails, setRecipientEmails] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Selected field for editing
  const [selectedFieldIdx, setSelectedFieldIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!formId) return;
    setLoading(true);
    fetch(`/api/admin/forms/${formId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.form) {
          setFormName(data.form.name);
          setFormSlug(data.form.slug);
          setSubmitButtonText(data.form.submitButtonText || "Submit");
          setSuccessMessage(data.form.successMessage || "");
          setRecipientEmails(data.form.recipientEmails || "");
          setWebhookUrl(data.form.webhookUrl || "");
          setIsActive(data.form.isActive);
          try {
            const parsed = JSON.parse(data.form.fields || "[]");
            setFields(
              parsed.map((f: any, idx: number) => ({
                id: f.id || `f_${idx}_${Date.now()}`,
                name: f.name || `field_${idx}`,
                label: f.label || "Field Label",
                type: f.type || "text",
                placeholder: f.placeholder || "",
                required: !!f.required,
                options: f.options || [],
              }))
            );
          } catch {
            setFields([]);
          }
        }
      })
      .catch((err) => {
        setStatusMessage({ type: "error", text: "Failed to load form: " + err.message });
      })
      .finally(() => setLoading(false));
  }, [formId]);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const addField = (type: FormFieldItem["type"]) => {
    const newField: FormFieldItem = {
      id: `f_${Date.now()}`,
      name: `field_${fields.length + 1}`,
      label: type === "phone" ? "Mobile / WhatsApp" : type === "email" ? "Email Address" : type === "textarea" ? "Message" : "New Field",
      type,
      placeholder: "",
      required: false,
      options: type === "dropdown" || type === "radio" ? ["Option 1", "Option 2"] : undefined,
    };
    setFields([...fields, newField]);
    setSelectedFieldIdx(fields.length);
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= fields.length) return;
    const copy = [...fields];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setFields(copy);
    setSelectedFieldIdx(target);
  };

  const deleteField = (index: number) => {
    setFields(fields.filter((_, idx) => idx !== index));
    setSelectedFieldIdx(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/forms/${formId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          slug: formSlug,
          fields,
          submitButtonText,
          successMessage,
          recipientEmails,
          webhookUrl,
          isActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showStatus("success", "Form saved successfully!");
      } else {
        showStatus("error", data.error || "Failed to save form");
      }
    } catch (err: any) {
      showStatus("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const currentField = selectedFieldIdx !== null ? fields[selectedFieldIdx] : null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-100">
      {/* Top Header */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 shadow-xs z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/forms"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="text-sm font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-hidden"
            />
            <span className="text-[10px] text-slate-400 block font-mono">
              embed: {formSlug}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Form"}</span>
          </button>
        </div>
      </header>

      {/* Status Bar */}
      {statusMessage && (
        <div
          className={`px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 ${
            statusMessage.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          {statusMessage.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Add Fields Toolbar */}
        <aside className="w-64 bg-white border-r border-slate-200 p-4 space-y-4 overflow-y-auto shrink-0">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Add Form Field
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Click to add to form</p>
          </div>

          <div className="space-y-1.5">
            {[
              { type: "text" as const, label: "Single Line Text" },
              { type: "email" as const, label: "Email Address" },
              { type: "phone" as const, label: "Phone / WhatsApp" },
              { type: "number" as const, label: "Number" },
              { type: "textarea" as const, label: "Multi-line Textarea" },
              { type: "dropdown" as const, label: "Dropdown Select" },
              { type: "radio" as const, label: "Radio Buttons" },
              { type: "checkbox" as const, label: "Checkbox" },
              { type: "date" as const, label: "Date Picker" },
              { type: "file" as const, label: "File Upload" },
            ].map((f) => (
              <button
                key={f.type}
                onClick={() => addField(f.type)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors flex items-center justify-between"
              >
                <span>{f.label}</span>
                <Plus className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Form Settings & Automations</h4>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block">Recipient Emails (Alerts)</label>
              <input
                type="text"
                value={recipientEmails}
                onChange={(e) => setRecipientEmails(e.target.value)}
                placeholder="admin@store.pk, sales@store.pk"
                className="mt-1 w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block">Webhook URL (CRM / Zapier)</label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.zapier.com/..."
                className="mt-1 w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block">Submit Button Label</label>
              <input
                type="text"
                value={submitButtonText}
                onChange={(e) => setSubmitButtonText(e.target.value)}
                className="mt-1 w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
              />
            </div>
          </div>
        </aside>

        {/* Center: Live Interactive Form Preview */}
        <main className="flex-1 p-6 overflow-y-auto flex justify-center">
          <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-5 self-start">
            <div>
              <h2 className="text-xl font-black text-slate-900">{formName}</h2>
              <p className="text-xs text-slate-400 mt-1">Live customer preview</p>
            </div>

            {fields.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                No fields added yet. Select a field type from the left sidebar.
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, idx) => {
                  const isSelected = selectedFieldIdx === idx;
                  return (
                    <div
                      key={field.id}
                      onClick={() => setSelectedFieldIdx(idx)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative group ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/20 shadow-xs"
                          : "border-slate-100 hover:border-slate-300"
                      }`}
                    >
                      {/* Floating Reorder Actions */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveField(idx, "up");
                          }}
                          disabled={idx === 0}
                          className="p-1 hover:text-slate-900 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveField(idx, "down");
                          }}
                          disabled={idx === fields.length - 1}
                          className="p-1 hover:text-slate-900 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteField(idx);
                          }}
                          className="p-1 text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>

                      {field.type === "textarea" ? (
                        <textarea
                          disabled
                          placeholder={field.placeholder || ""}
                          rows={3}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 cursor-pointer"
                        />
                      ) : field.type === "dropdown" ? (
                        <select
                          disabled
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 cursor-pointer"
                        >
                          <option>Select an option</option>
                          {field.options?.map((opt, oIdx) => (
                            <option key={oIdx}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type === "phone" ? "tel" : field.type}
                          disabled
                          placeholder={field.placeholder || ""}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 cursor-pointer"
                        />
                      )}
                    </div>
                  );
                })}

                <button
                  disabled
                  className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-default"
                >
                  {submitButtonText}
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Right: Field Inspector */}
        <aside className="w-72 bg-white border-l border-slate-200 p-4 space-y-4 overflow-y-auto shrink-0">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Field Properties
          </h3>

          {currentField ? (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block">Field Label</label>
                <input
                  type="text"
                  value={currentField.label}
                  onChange={(e) => {
                    const copy = [...fields];
                    copy[selectedFieldIdx!].label = e.target.value;
                    setFields(copy);
                  }}
                  className="mt-1 w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block">Variable / Key Name</label>
                <input
                  type="text"
                  value={currentField.name}
                  onChange={(e) => {
                    const copy = [...fields];
                    copy[selectedFieldIdx!].name = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
                    setFields(copy);
                  }}
                  className="mt-1 w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block">Placeholder</label>
                <input
                  type="text"
                  value={currentField.placeholder || ""}
                  onChange={(e) => {
                    const copy = [...fields];
                    copy[selectedFieldIdx!].placeholder = e.target.value;
                    setFields(copy);
                  }}
                  className="mt-1 w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              {(currentField.type === "dropdown" || currentField.type === "radio") && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Options (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={currentField.options?.join("\n") || ""}
                    onChange={(e) => {
                      const copy = [...fields];
                      copy[selectedFieldIdx!].options = e.target.value.split("\n").filter(Boolean);
                      setFields(copy);
                    }}
                    className="mt-1 w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="fieldReq"
                  checked={currentField.required}
                  onChange={(e) => {
                    const copy = [...fields];
                    copy[selectedFieldIdx!].required = e.target.checked;
                    setFields(copy);
                  }}
                  className="rounded text-emerald-600"
                />
                <label htmlFor="fieldReq" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Required Field
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => deleteField(selectedFieldIdx!)}
                  className="w-full py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete This Field</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Select any field from the preview to inspect.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
