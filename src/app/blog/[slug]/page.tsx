import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) return { title: "Blog Post Not Found" };

  return {
    title: `${post.title} | Apex Tech Blog`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
  };
}

export default async function SingleBlogPostPage({ params }: BlogPostPageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <Link
          href="/blog"
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1.5 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </Link>

        {post.category && (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg uppercase tracking-wide block w-fit mb-2">
            {post.category}
          </span>
        )}

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
          <span>By {post.author}</span>
          <span>•</span>
          <span>Published on {formatDate(post.publishedAt)}</span>
        </div>
      </div>

      {post.featuredImage && (
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200">
          <Image src={post.featuredImage} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xs">
        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </div>
    </div>
  );
}
