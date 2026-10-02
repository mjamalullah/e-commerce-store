import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import ElementRenderer from "@/components/builder/ElementRenderer";
import { BuilderPageData } from "@/types/builder";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = await prisma.visualPage.findUnique({
    where: { slug: params.slug },
  });

  if (!page) return {};

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || `Explore ${page.title} at Apex Commerce Pakistan.`,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || undefined,
      images: page.ogImage ? [{ url: page.ogImage }] : undefined,
    },
  };
}

export default async function PublicVisualPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = await prisma.visualPage.findUnique({
    where: { slug: params.slug },
  });

  if (!page) {
    notFound();
  }

  let pageData: BuilderPageData = { sections: [] };
  try {
    pageData = JSON.parse(page.builderData || "{\"sections\":[]}");
  } catch {
    pageData = { sections: [] };
  }

  return (
    <main className="min-h-screen pb-16">
      {pageData.sections.length === 0 ? (
        <div className="py-24 text-center">
          <h1 className="text-2xl font-bold text-slate-800">{page.title}</h1>
          <p className="text-xs text-slate-400 mt-2">This page has no content yet.</p>
        </div>
      ) : (
        pageData.sections.map((section) => (
          <section
            key={section.id}
            style={{
              backgroundColor: section.bgColor || "transparent",
              backgroundImage: section.bgImage ? `url(${section.bgImage})` : undefined,
              paddingTop: section.paddingY || "48px",
              paddingBottom: section.paddingY || "48px",
            }}
            className={
              section.layoutType === "container"
                ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                : "w-full"
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {section.columns.map((column) => {
                const spanDesktop = Math.round((column.widthDesktop / 100) * 12) || 12;

                return (
                  <div
                    key={column.id}
                    className={`space-y-4 ${
                      spanDesktop === 12
                        ? "md:col-span-12"
                        : spanDesktop === 6
                        ? "md:col-span-6"
                        : spanDesktop === 4
                        ? "md:col-span-4"
                        : spanDesktop === 3
                        ? "md:col-span-3"
                        : "md:col-span-12"
                    }`}
                  >
                    {column.elements.map((element) => (
                      <ElementRenderer key={element.id} element={element} isEditor={false} />
                    ))}
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </main>
  );
}
