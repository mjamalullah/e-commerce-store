"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: Array<{
    id?: string;
    url: string;
    alt?: string | null;
  }>;
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images && images.length > 0
    ? images
    : [{ url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80", alt: title }];

  const activeImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Preview Box */}
      <div className="relative aspect-square w-full rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm group">
        <Image
          src={activeImage.url}
          alt={activeImage.alt || title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden bg-white border-2 shrink-0 transition-all ${
                selectedIndex === idx
                  ? "border-emerald-600 shadow-md ring-2 ring-emerald-600/20"
                  : "border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${title} thumbnail ${idx + 1}`}
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
