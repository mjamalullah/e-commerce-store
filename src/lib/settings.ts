import prisma from "./prisma";

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  currency: string;
  currencySymbol: string;
  
  // Shipping & COD
  baseShippingFee: number;
  freeShippingThreshold: number;
  codFee: number;
  codEnabled: boolean;
  bankTransferEnabled: boolean;
  bankDetails: string;

  // WhatsApp
  whatsappNotificationsEnabled: boolean;
  whatsappAdminNumber: string;
  whatsappOrderTemplate: string;

  // Theme & Appearance
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    headerStyle: string;
    footerStyle: string;
    announcementText: string;
    showAnnouncement: boolean;
  };

  // Homepage Sections
  homepageSections: Array<{
    id: string;
    type: string;
    enabled: boolean;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    imageUrl?: string;
    badge?: string;
    categorySlug?: string;
  }>;

  // Analytics & SEO
  metaTitle: string;
  metaDescription: string;
  googleAnalyticsId: string;
  metaPixelId: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "Apex Gadgets Pakistan",
  storeTagline: "Premium Smart Gadgets, Audio & Accessories at Best Wholesale Prices",
  logoUrl: "/images/logo.png",
  faviconUrl: "/favicon.ico",
  contactEmail: "support@apexgadgets.pk",
  contactPhone: "0321-8273588",
  whatsappNumber: "923218273588",
  address: "Shop # 14-16, Electronics City, Saddar, Karachi, Pakistan",
  currency: "PKR",
  currencySymbol: "Rs.",

  baseShippingFee: 250,
  freeShippingThreshold: 3500,
  codFee: 0,
  codEnabled: true,
  bankTransferEnabled: true,
  bankDetails: "Meezan Bank | Account Title: Apex Commerce | IBAN: PK45MEZN0001234567890123",

  whatsappNotificationsEnabled: true,
  whatsappAdminNumber: "923218273588",
  whatsappOrderTemplate: "Salam {customer_name}! Your order {order_number} has been received. Total: {order_total}. We will deliver to {city} via COD. Track your order: {tracking_link}",

  theme: {
    primaryColor: "#0f766e", // Teal/Emerald luxury
    secondaryColor: "#0f172a", // Slate navy
    accentColor: "#f59e0b", // Amber gold
    headerStyle: "modern",
    footerStyle: "multi-column",
    announcementText: "🚚 FREE Nationwide Delivery on all orders above Rs. 3,500! Cash on Delivery Available.",
    showAnnouncement: true,
  },

  homepageSections: [
    {
      id: "hero",
      type: "hero_slider",
      enabled: true,
      title: "Next-Gen Smartwatches & Audio Gear",
      subtitle: "Experience elite performance, AMOLED displays, and noise-cancelling wireless audio with 1-Year Official Warranty.",
      buttonText: "Shop Gadgets Now",
      buttonLink: "/shop",
      badge: "Summer Sale 2026",
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "trust_badges",
      type: "trust_badges",
      enabled: true,
    },
    {
      id: "featured_categories",
      type: "categories",
      enabled: true,
      title: "Shop By Category",
      subtitle: "Explore our curated collection of verified smart electronics",
    },
    {
      id: "flash_sale",
      type: "flash_sale",
      enabled: true,
      title: "⚡ Flash Deals of the Week",
      subtitle: "Grab limited-stock premium devices before time runs out",
    },
    {
      id: "promo_banner_1",
      type: "banner",
      enabled: true,
      title: "ANC Wireless Earbuds Edition",
      subtitle: "Up to 40 hours battery life with ultra-low gaming latency",
      buttonText: "Discover Audio",
      buttonLink: "/shop?category=audio-earbuds",
      imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "best_sellers",
      type: "best_sellers",
      enabled: true,
      title: "🔥 Best Selling Gadgets",
      subtitle: "Top rated by thousands of verified Pakistani customers",
    },
    {
      id: "new_arrivals",
      type: "new_arrivals",
      enabled: true,
      title: "✨ Fresh New Arrivals",
      subtitle: "The newest tech gadgets just landed in Pakistan",
    },
    {
      id: "brand_showcase",
      type: "brands",
      enabled: true,
      title: "Trusted Brands & Manufacturers",
      subtitle: "100% Genuine, authentic and warranty backed tech products",
    },
    {
      id: "whatsapp_banner",
      type: "whatsapp_cta",
      enabled: true,
      title: "Need Quick Advice or Bulk Wholesale Order?",
      subtitle: "Chat directly with our tech experts on WhatsApp for instant assistance and bulk deals.",
      buttonText: "Chat on WhatsApp",
      buttonLink: "https://wa.me/923218273588",
    },
  ],

  metaTitle: "Apex Gadgets Pakistan | Wholesale Smartwatches, Earbuds & Tech Accessories",
  metaDescription: "Pakistan's leading online store for premium smartwatches, ANC wireless earbuds, high-capacity power banks, and smartphone accessories. Cash on delivery nationwide.",
  googleAnalyticsId: "",
  metaPixelId: "",
};

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const settingRecord = await prisma.setting.findUnique({
      where: { key: "STORE_SETTINGS" },
    });

    if (!settingRecord) {
      return DEFAULT_STORE_SETTINGS;
    }

    const parsed = JSON.parse(settingRecord.value);
    return { ...DEFAULT_STORE_SETTINGS, ...parsed };
  } catch (error) {
    return DEFAULT_STORE_SETTINGS;
  }
}

export async function saveStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getStoreSettings();
  const updated = { ...current, ...settings };

  await prisma.setting.upsert({
    where: { key: "STORE_SETTINGS" },
    update: { value: JSON.stringify(updated) },
    create: { key: "STORE_SETTINGS", value: JSON.stringify(updated) },
  });

  return updated;
}
