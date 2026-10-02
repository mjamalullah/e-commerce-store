import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding complete 20 Qadri Gadgets-Style Homepage Section Hierarchy...");

  const sections = [
    {
      sectionKey: "hero_slider",
      type: "HERO_SLIDER",
      title: "Main Hero Slider",
      sortOrder: 1,
      isEnabled: true,
      config: JSON.stringify({ autoplay: true, duration: 4000, dots: true, arrows: true }),
    },
    {
      sectionKey: "shop_categories",
      type: "SHOP_CATEGORIES",
      title: "Shop By Categories",
      subtitle: "Explore our curated collection of verified smart electronics",
      sortOrder: 2,
      isEnabled: true,
      config: JSON.stringify({ showCount: true, perRow: 5 }),
    },
    {
      sectionKey: "trust_features",
      type: "TRUST_FEATURES",
      title: "Service & Trust Badges",
      sortOrder: 3,
      isEnabled: true,
      config: JSON.stringify({ layout: "grid-4" }),
    },
    {
      sectionKey: "category_pills",
      type: "CATEGORY_PILLS",
      title: "Trending Collections",
      subtitle: "Quickly navigate through our most popular lifestyle categories",
      badge: "Fast Navigation",
      sortOrder: 4,
      isEnabled: true,
      config: JSON.stringify({}),
    },
    {
      sectionKey: "featured_products",
      type: "PRODUCT_CAROUSEL",
      title: "🔥 Featured Gadgets",
      subtitle: "Top-rated smart gadgets handpicked by our tech specialists",
      viewAllUrl: "/shop",
      sortOrder: 5,
      isEnabled: true,
      config: JSON.stringify({ selectionMethod: "FEATURED", count: 8, perRow: 4 }),
    },
    {
      sectionKey: "shop_under_price",
      type: "SHOP_UNDER_PRICE",
      title: "Shop By Budget",
      subtitle: "Find high quality verified gadgets and essentials suited to your pocket",
      badge: "Budget Friendly",
      sortOrder: 6,
      isEnabled: true,
      config: JSON.stringify({}),
    },
    {
      sectionKey: "new_arrivals",
      type: "NEW_ARRIVALS",
      title: "✨ Fresh New Arrivals",
      subtitle: "The newest smart accessories and gadgets just landed in Pakistan",
      badge: "Just Landed",
      viewAllUrl: "/shop",
      sortOrder: 7,
      isEnabled: true,
      config: JSON.stringify({ selectionMethod: "LATEST", count: 8, layout: "grid" }),
    },
    {
      sectionKey: "hot_selling",
      type: "HOT_SELLING",
      title: "⚡ Hot Selling Products",
      subtitle: "The most popular products flying off the shelves this week",
      badge: "Bestseller Choice",
      viewAllUrl: "/shop",
      sortOrder: 8,
      isEnabled: true,
      config: JSON.stringify({ selectionMethod: "BESTSELLER", count: 8, layout: "carousel" }),
    },
    {
      sectionKey: "home_essentials",
      type: "HOME_ESSENTIALS",
      title: "🏡 Smart Home Essentials",
      subtitle: "Modern gadgets to upgrade your bedroom, workspace, and living space",
      badge: "Daily Lifestyle",
      viewAllUrl: "/shop",
      sortOrder: 9,
      isEnabled: true,
      config: JSON.stringify({ selectionMethod: "FEATURED", count: 6, layout: "carousel" }),
    },
    {
      sectionKey: "promo_banners",
      type: "PROMO_BANNERS",
      title: "Promotional Highlights",
      sortOrder: 10,
      isEnabled: true,
      config: JSON.stringify({
        banners: [
          {
            title: "Pro Gaming Audio Gear",
            subtitle: "7.1 Spatial Surround with Dynamic RGB",
            link: "/shop?category=gaming-gear",
            buttonText: "Shop Gaming Audio",
            image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
          },
          {
            title: "65W GaN Fast Chargers",
            subtitle: "Ultra Compact 3-Port Laptop & Mobile Power",
            link: "/shop?category=fast-chargers-cables",
            buttonText: "Shop Chargers",
            image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
          },
        ],
      }),
    },
    {
      sectionKey: "search_promo",
      type: "SEARCH_PROMO",
      title: "Looking For Something Specific?",
      subtitle: "Search across hundreds of certified gadgets, smart devices, and daily lifestyle essentials",
      sortOrder: 11,
      isEnabled: true,
      config: JSON.stringify({}),
    },
    {
      sectionKey: "top_picks",
      type: "TOP_PICKS",
      title: "🎧 Top Picks Audio & Earbuds",
      subtitle: "Crystal clear acoustic fidelity with active noise reduction",
      badge: "Audiophile Pick",
      viewAllUrl: "/shop?category=wireless-earbuds",
      sortOrder: 12,
      isEnabled: true,
      config: JSON.stringify({ selectionMethod: "CATEGORY", categorySlug: "wireless-earbuds", count: 6, layout: "carousel" }),
    },
    {
      sectionKey: "trending_now",
      type: "TRENDING_NOW",
      title: "🔥 Trending Now Across Pakistan",
      subtitle: "High demand tech gadgets receiving rave reviews from customers",
      badge: "Trending",
      viewAllUrl: "/shop",
      sortOrder: 13,
      isEnabled: true,
      config: JSON.stringify({ selectionMethod: "BESTSELLER", count: 8 }),
    },
    {
      sectionKey: "jewelry_accessories",
      type: "JEWELRY_ACCESSORIES",
      title: "💍 Elegant Jewelry & Lifestyle Accents",
      subtitle: "Refined aesthetic accessories, magnetic straps, and fine chains",
      badge: "Premium Accents",
      viewAllUrl: "/shop",
      sortOrder: 14,
      isEnabled: true,
      config: JSON.stringify({ selectionMethod: "FEATURED", count: 6, layout: "carousel" }),
    },
    {
      sectionKey: "exclusive_watches",
      type: "EXCLUSIVE_COLLECTION",
      title: "⌚ Exclusive Smartwatches Collection",
      subtitle: "Luxury design meets cutting-edge biometric health & calling metrics",
      badge: "Flagship Wearables",
      viewAllUrl: "/shop?category=smart-watches",
      sortOrder: 15,
      isEnabled: true,
      config: JSON.stringify({ selectionMethod: "CATEGORY", categorySlug: "smart-watches", count: 8 }),
    },
    {
      sectionKey: "flash_sale",
      type: "FLASH_SALE",
      title: "⚡ Flash Deals of the Week",
      subtitle: "Grab limited-stock premium devices before time runs out",
      badge: "Limited Stock",
      sortOrder: 16,
      isEnabled: true,
      config: JSON.stringify({ selectionMethod: "ON_SALE", count: 4 }),
    },
    {
      sectionKey: "motion_shop",
      type: "MOTION_PRODUCTS",
      title: "Watch & Shop",
      subtitle: "In-Motion Spotlight — Tap any gadget to order instantly",
      badge: "Moving Showcase",
      sortOrder: 17,
      isEnabled: true,
      config: JSON.stringify({ autoplay: true, speed: 3000 }),
    },
    {
      sectionKey: "you_may_like",
      type: "YOU_MAY_LIKE",
      title: "💡 You May Also Like",
      subtitle: "Smart complementary devices that pair perfectly with your setup",
      badge: "Recommended",
      viewAllUrl: "/shop",
      sortOrder: 18,
      isEnabled: true,
      config: JSON.stringify({ selectionMethod: "FEATURED", count: 8 }),
    },
    {
      sectionKey: "customer_reviews",
      type: "REVIEWS_CAROUSEL",
      title: "What Our Verified Clients Say",
      subtitle: "Honest customer feedback from across Karachi, Lahore, Islamabad, Faisalabad and Peshawar",
      sortOrder: 19,
      isEnabled: true,
      config: JSON.stringify({ autoPlay: true, showVerified: true }),
    },
    {
      sectionKey: "whatsapp_banner",
      type: "WHATSAPP_BANNER",
      title: "Need Quick Advice or Bulk Wholesale Deal?",
      subtitle: "Chat directly with our tech experts on WhatsApp for instant assistance, bulk pricing, and custom orders.",
      sortOrder: 20,
      isEnabled: true,
      config: JSON.stringify({ whatsappNumber: "923218273588", buttonText: "Chat on WhatsApp" }),
    },
  ];

  await prisma.homepageSection.deleteMany();
  for (const sec of sections) {
    await prisma.homepageSection.create({ data: sec });
  }

  console.log("✅ Successfully seeded 20 Qadri Gadgets sections into database!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
