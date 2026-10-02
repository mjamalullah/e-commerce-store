"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Trash2,
  Check,
  Loader2,
} from "lucide-react";

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.success) {
        setMediaList(data.media);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      try {
        await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        });
      } catch (err) {
        console.error("Upload error", err);
      }
    }
    setIsUploading(false);
    fetchMedia();
  };

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;
    try {
      await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      setMediaList(mediaList.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-emerald-600" />
            <span>Central Media Manager</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload, preview, organize, and reuse product photographs and promotional banners.
          </p>
        </div>

        {/* Upload Button Trigger */}
        <label className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer self-start">
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading Files...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Upload New Photos</span>
            </>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            disabled={isUploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        {mediaList.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No media uploaded yet</h3>
            <p className="text-xs text-slate-400">
              Upload gadget images to easily copy their URL into product cards and banners.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaList.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <Image src={item.url} alt={item.name} fill className="object-cover" />

                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white">
                  <p className="text-[10px] truncate font-medium">{item.name}</p>
                  <div className="flex items-center justify-between gap-1">
                    <button
                      onClick={() => handleCopyUrl(item.url, item.id)}
                      className="px-2 py-1 bg-white text-slate-900 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm"
                      title="Copy Public URL"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
