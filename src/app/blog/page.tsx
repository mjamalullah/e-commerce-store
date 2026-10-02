import React from "react";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { ArrowRight, BookOpen } from "lucide-react";

export default async function BlogListPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Tech Blog</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-emerald-600" />
          <span>Apex Tech Guides & News</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Buyer guides, reviews, battery tips, and comparisons to help you pick the best gadgets in Pakistan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              {post.featuredImage && (
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {post.category && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg uppercase">
                      {post.category}
                    </span>
                  )}
                </div>
              )}

              <div className="p-5 space-y-2">
                <div className="text-[11px] text-slate-400">
                  {formatDate(post.publishedAt)} • By {post.author}
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>
                {post.excerpt && (
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </div>

            <div className="p-5 pt-0">
              <Link
                href={`/blog/${post.slug}`}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1.5"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
