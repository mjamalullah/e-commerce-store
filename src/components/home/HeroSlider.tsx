"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";

export interface HeroSlideData {
  id: string;
  heading: string;
  subheading?: string | null;
  badge?: string | null;
  buttonText: string;
  buttonUrl: string;
  desktopImage: string;
  mobileImage?: string | null;
  textAlignment?: string;
}

interface HeroSliderProps {
  slides: HeroSlideData[];
  autoplay?: boolean;
  duration?: number;
}

export default function HeroSlider({
  slides,
  autoplay = true,
  duration = 4500,
}: HeroSliderProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!autoplay || isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, duration);
    return () => clearInterval(interval);
  }, [autoplay, isPaused, slides.length, duration]);

  if (!slides || slides.length === 0) return null;

  const activeSlide = slides[currentIdx];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] flex items-center"
    >
      {/* Background Slides */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id || idx}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === currentIdx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* Desktop Image */}
          <div className="hidden sm:block relative w-full h-full">
            <Image
              src={slide.desktopImage}
              alt={slide.heading}
              fill
              priority={idx === 0}
              className="object-cover object-center brightness-75 scale-105 transition-transform duration-7000 ease-out"
            />
          </div>

          {/* Mobile Image */}
          <div className="block sm:hidden relative w-full h-full">
            <Image
              src={slide.mobileImage || slide.desktopImage}
              alt={slide.heading}
              fill
              priority={idx === 0}
              className="object-cover object-center brightness-75"
            />
          </div>

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
        </div>
      ))}

      {/* Slide Text Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="max-w-2xl space-y-4 sm:space-y-6">
          {activeSlide.badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs rounded-full backdrop-blur-sm shadow-sm animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeSlide.badge}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-md">
            {activeSlide.heading}
          </h1>

          {activeSlide.subheading && (
            <p className="text-xs sm:text-base text-slate-200 max-w-xl leading-relaxed drop-shadow-xs">
              {activeSlide.subheading}
            </p>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href={activeSlide.buttonUrl || "/shop"}
              className="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all flex items-center gap-2 group"
            >
              <span>{activeSlide.buttonText || "Shop Now"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/shop"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm rounded-xl backdrop-blur-sm transition-all"
            >
              View All Categories
            </Link>
          </div>
        </div>
      </div>

      {/* Prev / Next Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/60 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/10 transition-all shadow-lg hover:scale-110 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/60 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/10 transition-all shadow-lg hover:scale-110 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIdx
                  ? "w-8 bg-emerald-400 shadow-md shadow-emerald-400/50"
                  : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
