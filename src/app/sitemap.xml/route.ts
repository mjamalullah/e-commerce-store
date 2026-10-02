import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface SitemapEntry {
  loc: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexgadgets.pk";

  const [products, categories, blogPosts, pages] = await Promise.all([
    prisma.product.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.visualPage.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticUrls: SitemapEntry[] = [
    { loc: `${baseUrl}/`, priority: "1.0", changefreq: "daily" },
    { loc: `${baseUrl}/shop`, priority: "0.9", changefreq: "daily" },
    { loc: `${baseUrl}/track-order`, priority: "0.7", changefreq: "monthly" },
    { loc: `${baseUrl}/blog`, priority: "0.8", changefreq: "weekly" },
    { loc: `${baseUrl}/wishlist`, priority: "0.5", changefreq: "monthly" },
  ];

  const productUrls: SitemapEntry[] = products.map((p) => ({
    loc: `${baseUrl}/products/${p.slug}`,
    priority: "0.8",
    changefreq: "weekly",
    lastmod: p.updatedAt.toISOString().split("T")[0],
  }));

  const categoryUrls: SitemapEntry[] = categories.map((c) => ({
    loc: `${baseUrl}/shop?category=${c.slug}`,
    priority: "0.8",
    changefreq: "weekly",
    lastmod: c.updatedAt.toISOString().split("T")[0],
  }));

  const blogUrls: SitemapEntry[] = blogPosts.map((b) => ({
    loc: `${baseUrl}/blog/${b.slug}`,
    priority: "0.7",
    changefreq: "monthly",
    lastmod: b.updatedAt.toISOString().split("T")[0],
  }));

  const visualPageUrls: SitemapEntry[] = pages.map((pg) => ({
    loc: `${baseUrl}/pages/${pg.slug}`,
    priority: "0.8",
    changefreq: "weekly",
    lastmod: pg.updatedAt.toISOString().split("T")[0],
  }));

  const allUrls: SitemapEntry[] = [...staticUrls, ...productUrls, ...categoryUrls, ...blogUrls, ...visualPageUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
