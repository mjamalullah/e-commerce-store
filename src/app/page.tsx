import React from "react";
import prisma from "@/lib/prisma";
import { getStoreSettings } from "@/lib/settings";
import PreviewBar from "@/components/home/PreviewBar";
import HeroSlider from "@/components/home/HeroSlider";
import TrustBadgesSection from "@/components/home/TrustBadgesSection";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import ProductCarousel from "@/components/home/ProductCarousel";
import PromoBannersSection from "@/components/home/PromoBannersSection";
import MotionShopSection from "@/components/home/MotionShopSection";
import ReviewsCarousel from "@/components/home/ReviewsCarousel";
import WhatsAppBanner from "@/components/home/WhatsAppBanner";
import ShopUnderPriceSection from "@/components/home/ShopUnderPriceSection";
import CategoryPillsSection from "@/components/home/CategoryPillsSection";
import SearchPromoSection from "@/components/home/SearchPromoSection";
import PastelProductSection from "@/components/home/PastelProductSection";
import Link from "next/link";
import { Wrench, MessageCircle } from "lucide-react";

export const revalidate = 10;

interface PageProps {
  searchParams?: Promise<{ preview?: string; token?: string }>;
}

export default async function HomePage(props: PageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const isPreview = searchParams.preview === "true";

  const settings = await getStoreSettings();

  // Maintenance mode check: if enabled and not in preview mode, render maintenance screen
  if (settings.maintenance_mode === "true" && !isPreview) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
        <div className="max-w-md w-full text-center space-y-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {settings.maintenance_title || "Store Under Scheduled Maintenance"}
            </h1>
            <p className="text-sm text-slate-600 mt-2">
              {settings.maintenance_message ||
                "We are currently updating our storefront with exciting new arrivals. We will be back online shortly!"}
            </p>
          </div>
          {settings.whatsappNumber && (
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=Hi,%20I%20am%20visiting%20the%20store%20during%20maintenance`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact Us on WhatsApp</span>
            </a>
          )}
          <div className="pt-2 text-xs text-slate-400">
            Store Administrator? <Link href="/admin/login" className="text-emerald-600 font-bold hover:underline">Log in here</Link>
          </div>
        </div>
      </div>
    );
  }

  // 1. Fetch raw Homepage Sections from database
  const rawSections = await prisma.homepageSection.findMany();

  // 2. Resolve draft vs published versions
  const processedSections = rawSections
    .map((sec) => {
      if (isPreview) {
        return {
          ...sec,
          effectiveConfig: sec.draftConfig !== null && sec.draftConfig !== undefined ? sec.draftConfig : sec.config,
          effectiveSortOrder: sec.draftSortOrder !== null && sec.draftSortOrder !== undefined ? sec.draftSortOrder : sec.sortOrder,
          effectiveIsEnabled: sec.draftIsEnabled !== null && sec.draftIsEnabled !== undefined ? sec.draftIsEnabled : sec.isEnabled,
        };
      } else {
        return {
          ...sec,
          effectiveConfig: sec.config,
          effectiveSortOrder: sec.sortOrder,
          effectiveIsEnabled: sec.isEnabled,
        };
      }
    })
    .filter((s) => s.effectiveIsEnabled)
    .sort((a, b) => a.effectiveSortOrder - b.effectiveSortOrder);

  // 3. Pre-fetch shared storefront data pools
  const [
    heroSlides,
    trustFeatures,
    categories,
    motionItems,
    reviews,
  ] = await Promise.all([
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.trustFeature.findMany({
      where: { isEnabled: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      take: 12,
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.motionProduct.findMany({
      where: { isEnabled: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.review.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        product: { select: { name: true, slug: true } },
      },
    }),
  ]);

  // Helper function to query products based on dynamic section config
  async function fetchProductsForSection(configStr: string) {
    let config: any = {};
    try {
      config = JSON.parse(configStr || "{}");
    } catch {
      config = {};
    }

    const count = config.count || 8;
    const where: any = { isPublished: true };

    if (config.selectionMethod === "BESTSELLER") {
      where.isBestSeller = true;
    } else if (config.selectionMethod === "LATEST") {
      where.isNewArrival = true;
    } else if (config.selectionMethod === "ON_SALE") {
      where.salePrice = { not: null };
    } else if (config.selectionMethod === "CATEGORY" && config.categorySlug) {
      where.category = { slug: config.categorySlug };
    } else if (config.selectionMethod === "MANUAL" && Array.isArray(config.productIds) && config.productIds.length > 0) {
      where.id = { in: config.productIds };
    } else {
      where.isFeatured = true;
    }

    const items = await prisma.product.findMany({
      where,
      take: count,
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          orderBy: { isPrimary: "desc" },
          take: 2,
        },
        brand: { select: { name: true } },
      },
    });

    // Fallback if specific filtered query returned empty: return latest products
    if (items.length === 0) {
      return prisma.product.findMany({
        where: { isPublished: true },
        take: count,
        orderBy: { createdAt: "desc" },
        include: {
          images: {
            orderBy: { isPrimary: "desc" },
            take: 2,
          },
          brand: { select: { name: true } },
        },
      });
    }

    return items;
  }

  // 4. Render sections according to database sort order and types
  const renderedSections = await Promise.all(
    processedSections.map(async (sec) => {
      let cfg: any = {};
      try {
        cfg = JSON.parse(sec.effectiveConfig || "{}");
      } catch {
        cfg = {};
      }

      switch (sec.type) {
        case "HERO_SLIDER":
          return (
            <HeroSlider
              key={sec.id}
              slides={heroSlides}
              autoplay={cfg.autoplay !== false}
              duration={cfg.duration || 4500}
            />
          );

        case "TRUST_FEATURES":
          return <TrustBadgesSection key={sec.id} features={trustFeatures} />;

        case "SHOP_CATEGORIES":
          return (
            <CategoriesGrid
              key={sec.id}
              title={sec.title}
              subtitle={sec.subtitle}
              categories={categories}
            />
          );

        case "CATEGORY_PILLS":
          return (
            <CategoryPillsSection
              key={sec.id}
              title={sec.title}
              subtitle={sec.subtitle}
              badge={sec.badge}
              categories={categories}
            />
          );

        case "SHOP_UNDER_PRICE":
          return (
            <ShopUnderPriceSection
              key={sec.id}
              title={sec.title}
              subtitle={sec.subtitle}
              badge={sec.badge}
            />
          );

        case "SEARCH_PROMO":
          return (
            <SearchPromoSection
              key={sec.id}
              title={sec.title}
              subtitle={sec.subtitle}
            />
          );

        case "NEW_ARRIVALS": {
          const prods = await fetchProductsForSection(sec.effectiveConfig);
          return (
            <PastelProductSection
              key={sec.id}
              title={sec.title || "New Arrivals"}
              subtitle={sec.subtitle}
              badge={sec.badge || "Just Landed"}
              viewAllUrl={sec.viewAllUrl || "/shop"}
              products={prods}
              theme="cream"
              layout={cfg.layout || "grid"}
            />
          );
        }

        case "HOT_SELLING": {
          const prods = await fetchProductsForSection(sec.effectiveConfig);
          return (
            <PastelProductSection
              key={sec.id}
              title={sec.title || "Hot Selling Products"}
              subtitle={sec.subtitle}
              badge={sec.badge || "Top Seller"}
              viewAllUrl={sec.viewAllUrl || "/shop"}
              products={prods}
              theme="mint"
              layout={cfg.layout || "carousel"}
            />
          );
        }

        case "HOME_ESSENTIALS": {
          const prods = await fetchProductsForSection(sec.effectiveConfig);
          return (
            <PastelProductSection
              key={sec.id}
              title={sec.title || "Home Essentials"}
              subtitle={sec.subtitle}
              badge={sec.badge || "Daily Comfort"}
              viewAllUrl={sec.viewAllUrl || "/shop"}
              products={prods}
              theme="lavender"
              layout={cfg.layout || "carousel"}
            />
          );
        }

        case "JEWELRY_ACCESSORIES": {
          const prods = await fetchProductsForSection(sec.effectiveConfig);
          return (
            <PastelProductSection
              key={sec.id}
              title={sec.title || "Elegant Jewelry & Accessories"}
              subtitle={sec.subtitle}
              badge={sec.badge || "Fine Accents"}
              viewAllUrl={sec.viewAllUrl || "/shop"}
              products={prods}
              theme="rose"
              layout={cfg.layout || "carousel"}
            />
          );
        }

        case "TOP_PICKS": {
          const prods = await fetchProductsForSection(sec.effectiveConfig);
          return (
            <PastelProductSection
              key={sec.id}
              title={sec.title || "Top Picks & Audio Gear"}
              subtitle={sec.subtitle}
              badge={sec.badge || "Staff Pick"}
              viewAllUrl={sec.viewAllUrl || "/shop"}
              products={prods}
              theme="blue"
              layout={cfg.layout || "carousel"}
            />
          );
        }

        case "FLASH_SALE": {
          const saleProducts = await fetchProductsForSection(sec.effectiveConfig);
          return (
            <FlashSaleSection
              key={sec.id}
              title={sec.title}
              subtitle={sec.subtitle}
              badge={sec.badge}
              products={saleProducts}
            />
          );
        }

        case "PRODUCT_CAROUSEL":
        case "EXCLUSIVE_COLLECTION":
        case "TRENDING_NOW":
        case "YOU_MAY_LIKE": {
          const products = await fetchProductsForSection(sec.effectiveConfig);
          return (
            <ProductCarousel
              key={sec.id}
              title={sec.title || "Featured Collection"}
              subtitle={sec.subtitle}
              badge={sec.badge}
              viewAllUrl={sec.viewAllUrl || "/shop"}
              products={products}
            />
          );
        }

        case "PROMO_BANNERS": {
          const banners = cfg.banners || [];
          return <PromoBannersSection key={sec.id} banners={banners} />;
        }

        case "MOTION_PRODUCTS":
          return (
            <MotionShopSection
              key={sec.id}
              title={sec.title}
              subtitle={sec.subtitle}
              badge={sec.badge}
              items={motionItems}
            />
          );

        case "REVIEWS_CAROUSEL":
          return (
            <ReviewsCarousel
              key={sec.id}
              title={sec.title}
              subtitle={sec.subtitle}
              reviews={reviews}
            />
          );

        case "WHATSAPP_BANNER":
          return (
            <WhatsAppBanner
              key={sec.id}
              title={sec.title}
              subtitle={sec.subtitle}
              whatsappNumber={cfg.whatsappNumber || settings.whatsappNumber}
              buttonText={cfg.buttonText || "Contact Wholesale Desk"}
            />
          );

        default:
          return null;
      }
    })
  );

  return (
    <div className="space-y-10 sm:space-y-14 pb-16">
      {/* Floating Preview Bar if preview=true is active */}
      {isPreview && <PreviewBar />}

      {/* Rendered Dynamic Sections */}
      {renderedSections}
    </div>
  );
}
