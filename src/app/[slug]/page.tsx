import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import prisma from "@/lib/prisma";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
  });

  if (!page) return { title: "Page Not Found" };

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.title,
  };
}

export default async function DynamicCMSPage({ params }: PageProps) {
  // Exclude non-page routes if any collide
  const reservedSlugs = ["api", "admin", "shop", "checkout", "cart", "wishlist", "track-order", "blog"];
  if (reservedSlugs.includes(params.slug)) {
    notFound();
  }

  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
  });

  if (!page || !page.isPublished) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-6">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-emerald-600">Home</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{page.title}</span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm space-y-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {page.title}
        </h1>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {page.content}
        </div>
      </div>
    </div>
  );
}
