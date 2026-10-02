import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Apex Commerce (Qadri Gadgets Style CMS)...");

  // 1. Super Admin User
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@apexgadgets.pk" },
    update: {
      passwordHash: adminPasswordHash,
      role: "SUPER_ADMIN",
      name: "Apex Store Administrator",
    },
    create: {
      email: "admin@apexgadgets.pk",
      passwordHash: adminPasswordHash,
      name: "Apex Store Administrator",
      role: "SUPER_ADMIN",
      phone: "03218273588",
    },
  });
  console.log("✅ Super Admin ready:", adminUser.email);

  // 2. Categories
  const categoriesData = [
    {
      name: "Smart Watches",
      slug: "smart-watches",
      description: "AMOLED, Bluetooth calling, fitness & health tracking smartwatches",
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
      isFeatured: true,
      sortOrder: 1,
    },
    {
      name: "Wireless Earbuds",
      slug: "wireless-earbuds",
      description: "True Wireless Stereo (TWS) earbuds with Active Noise Cancellation (ANC)",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
      isFeatured: true,
      sortOrder: 2,
    },
    {
      name: "Power Banks",
      slug: "power-banks",
      description: "High capacity 10000mAh, 20000mAh & 30000mAh PD fast charging power banks",
      image: "https://images.unsplash.com/photo-1609592426867-d8c9735dcae9?auto=format&fit=crop&w=600&q=80",
      isFeatured: true,
      sortOrder: 3,
    },
    {
      name: "Fast Chargers & Cables",
      slug: "fast-chargers-cables",
      description: "GaN Fast Chargers, 65W/100W PD Type-C and lightning braided cables",
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80",
      isFeatured: true,
      sortOrder: 4,
    },
    {
      name: "Gaming Gear & Audio",
      slug: "gaming-gear",
      description: "7.1 surround sound headphones, RGB wireless headsets & mobile gaming triggers",
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
      isFeatured: true,
      sortOrder: 5,
    },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories[cat.slug] = created;
  }

  // 3. Brands
  const brandsData = [
    { name: "QCY", slug: "qcy" },
    { name: "Soundpeats", slug: "soundpeats" },
    { name: "Haylou", slug: "haylou" },
    { name: "Anker", slug: "anker" },
    { name: "Joyroom", slug: "joyroom" },
    { name: "Faster", slug: "faster" },
  ];

  const brands = {};
  for (const brand of brandsData) {
    const created = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: brand,
      create: brand,
    });
    brands[brand.slug] = created;
  }

  // 4. Products with Secondary Images (for Hover Flip)
  const products = [
    {
      name: "QCY Watch GT Smart Watch (1.43-inch AMOLED, Bluetooth Calling)",
      slug: "qcy-watch-gt-smart-watch-amoled",
      sku: "QCY-W-GT",
      barcode: "6957141408112",
      shortDesc: "1.43-inch HD AMOLED Display with 466x466 resolution, zinc alloy case, and Bluetooth HD calling with 10-day battery.",
      description: "Stunning 1.43 AMOLED display, Bluetooth calling with high fidelity mic, IP68 water resistance, and 100+ sports modes. Official 1-Year Brand Warranty.",
      regularPrice: 8999,
      salePrice: 6499,
      costPrice: 4800,
      stock: 45,
      lowStockAlert: 5,
      warranty: "1 Year Official Warranty",
      tags: "smartwatch,amoled,qcy,bluetooth calling",
      categoryId: categories["smart-watches"].id,
      brandId: brands["qcy"].id,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      images: [
        { url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80", alt: "QCY Watch GT Primary", isPrimary: true, sortOrder: 0 },
        { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", alt: "QCY Watch GT Secondary Angle", isPrimary: false, sortOrder: 1 },
      ],
      specifications: [
        { name: "Screen Size", value: "1.43 inch AMOLED" },
        { name: "Resolution", value: "466 x 466 pixels" },
        { name: "Battery Life", value: "Up to 10 Days" },
      ],
      variants: [
        { title: "Space Black", sku: "QCY-W-GT-BLK", price: 6499, stock: 30, attributes: JSON.stringify({ Color: "Space Black" }) },
        { title: "Titanium Silver", sku: "QCY-W-GT-SLV", price: 6499, stock: 15, attributes: JSON.stringify({ Color: "Titanium Silver" }) },
      ],
    },
    {
      name: "Soundpeats Engine 4 Wireless Dual-Driver Earbuds with Hi-Res Audio",
      slug: "soundpeats-engine-4-wireless-earbuds-hi-res",
      sku: "SP-ENG4-TWS",
      barcode: "6941590852331",
      shortDesc: "Dual coaxial dynamic drivers (10mm + 6mm), Hi-Res Audio certification with LDAC codec support and 43-hour total playtime.",
      description: "Audiophile-grade dual coaxial dynamic drivers, LDAC high bit-rate streaming, dual device multipoint connection, and 43 hours playtime.",
      regularPrice: 12500,
      salePrice: 9499,
      costPrice: 7200,
      stock: 28,
      lowStockAlert: 4,
      warranty: "1 Year Official Warranty",
      tags: "earbuds,audio,soundpeats,hi-res,ldac",
      categoryId: categories["wireless-earbuds"].id,
      brandId: brands["soundpeats"].id,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      images: [
        { url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", alt: "Soundpeats Engine 4 Earbuds", isPrimary: true, sortOrder: 0 },
        { url: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80", alt: "Soundpeats Case Angle", isPrimary: false, sortOrder: 1 },
      ],
      specifications: [
        { name: "Bluetooth Version", value: "Bluetooth 5.3" },
        { name: "Audio Codecs", value: "LDAC, AAC, SBC" },
      ],
      variants: [],
    },
    {
      name: "Joyroom JR-T03S Pro ANC True Wireless Earbuds with Wireless Charging",
      slug: "joyroom-jr-t03s-pro-anc-earbuds",
      sku: "JR-T03S-PRO",
      barcode: "6956116744021",
      shortDesc: "Active Noise Cancellation up to 25dB, Transparency Mode, spatial audio experience and Qi Wireless Charging case.",
      description: "Active Noise Cancellation up to 25dB, Transparency Mode, in-ear detection sensor, and Qi wireless charging.",
      regularPrice: 6500,
      salePrice: 4750,
      costPrice: 3200,
      stock: 50,
      lowStockAlert: 5,
      warranty: "6 Months Brand Warranty",
      tags: "joyroom,anc,earbuds,wireless charging",
      categoryId: categories["wireless-earbuds"].id,
      brandId: brands["joyroom"].id,
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      images: [
        { url: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80", alt: "Joyroom JR-T03S Pro Primary", isPrimary: true, sortOrder: 0 },
        { url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", alt: "Joyroom Case Open", isPrimary: false, sortOrder: 1 },
      ],
      specifications: [
        { name: "ANC Depth", value: "Up to 25dB" },
      ],
      variants: [
        { title: "Glossy White", sku: "JR-T03S-PRO-WHT", price: 4750, stock: 35, attributes: JSON.stringify({ Color: "Glossy White" }) },
        { title: "Midnight Black", sku: "JR-T03S-PRO-BLK", price: 4750, stock: 15, attributes: JSON.stringify({ Color: "Midnight Black" }) },
      ],
    },
    {
      name: "Anker 325 Power Bank 20,000mAh PowerCore External Battery",
      slug: "anker-325-power-bank-20000mah-powercore",
      sku: "ANK-325-20K",
      barcode: "194644026388",
      shortDesc: "Massive 20,000mAh battery pack with PowerIQ technology, dual USB outputs, and MultiProtect safety system.",
      description: "Massive 20,000mAh battery capacity with twin high-speed USB outputs, trickle charging for low-power earbuds, and 18-month Anker warranty.",
      regularPrice: 10999,
      salePrice: 8499,
      costPrice: 6500,
      stock: 22,
      lowStockAlert: 3,
      warranty: "18 Months Official Anker Warranty",
      tags: "powerbank,anker,20000mah,fast charging",
      categoryId: categories["power-banks"].id,
      brandId: brands["anker"].id,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      images: [
        { url: "https://images.unsplash.com/photo-1609592426867-d8c9735dcae9?auto=format&fit=crop&w=800&q=80", alt: "Anker 325 Power Bank", isPrimary: true, sortOrder: 0 },
        { url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80", alt: "Anker Ports Angle", isPrimary: false, sortOrder: 1 },
      ],
      specifications: [
        { name: "Capacity", value: "20,000 mAh" },
      ],
      variants: [],
    },
    {
      name: "Joyroom 65W GaN Fast Charger Ultra-Compact 3-Port (2C+1A)",
      slug: "joyroom-65w-gan-fast-charger-3-port",
      sku: "JR-GAN-65W",
      barcode: "6956116789912",
      shortDesc: "Next-gen GaN semiconductor technology with 65W Power Delivery. Charges laptops, MacBooks, tablets, and smartphones simultaneously.",
      description: "65W max output with GaN III technology. Dual USB-C and single USB-A fast charging. Runs cool and ultra-compact.",
      regularPrice: 5500,
      salePrice: 3999,
      costPrice: 2600,
      stock: 35,
      lowStockAlert: 5,
      warranty: "1 Year Official Warranty",
      tags: "charger,gan,65w,type-c,fast charger",
      categoryId: categories["fast-chargers-cables"].id,
      brandId: brands["joyroom"].id,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: true,
      images: [
        { url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80", alt: "Joyroom 65W GaN", isPrimary: true, sortOrder: 0 },
      ],
      specifications: [
        { name: "Max Wattage", value: "65W" },
      ],
      variants: [],
    },
    {
      name: "Faster TG-300 Pro Wireless Gaming Headset with 7.1 Surround & RGB",
      slug: "faster-tg-300-pro-wireless-gaming-headset",
      sku: "FST-TG300",
      barcode: "6921345678901",
      shortDesc: "2.4GHz ultra-low latency wireless gaming headset with 50mm drivers, detachable noise-cancelling boom mic, and dynamic RGB.",
      description: "Esports 2.4GHz wireless dongle audio with 50mm drivers, ClearCast microphone, and memory foam breathable earcups.",
      regularPrice: 7500,
      salePrice: 5499,
      costPrice: 3800,
      stock: 18,
      lowStockAlert: 3,
      warranty: "1 Year Brand Warranty",
      tags: "gaming,headset,faster,rgb,surround sound",
      categoryId: categories["gaming-gear"].id,
      brandId: brands["faster"].id,
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      images: [
        { url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80", alt: "Faster TG-300 Gaming Headset", isPrimary: true, sortOrder: 0 },
        { url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", alt: "Faster RGB Glow", isPrimary: false, sortOrder: 1 },
      ],
      specifications: [
        { name: "Driver Diameter", value: "50mm" },
      ],
      variants: [],
    },
  ];

  for (const prod of products) {
    const { images, specifications, variants, ...prodData } = prod;
    const createdProduct = await prisma.product.upsert({
      where: { slug: prodData.slug },
      update: prodData,
      create: prodData,
    });

    if (images && images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: createdProduct.id } });
      for (const img of images) {
        await prisma.productImage.create({
          data: { ...img, productId: createdProduct.id },
        });
      }
    }

    if (specifications && specifications.length > 0) {
      await prisma.productSpecification.deleteMany({ where: { productId: createdProduct.id } });
      for (const spec of specifications) {
        await prisma.productSpecification.create({
          data: { ...spec, productId: createdProduct.id },
        });
      }
    }

    if (variants && variants.length > 0) {
      await prisma.productVariant.deleteMany({ where: { productId: createdProduct.id } });
      for (const v of variants) {
        await prisma.productVariant.create({
          data: { ...v, productId: createdProduct.id },
        });
      }
    }
  }

  // 5. Seed Hero Slides
  const slides = [
    {
      heading: "Next-Gen AMOLED Smartwatches",
      subheading: "HD Bluetooth Calling, 60Hz Retina Display & Zinc Alloy Luxury Build",
      badge: "Summer 2026 Collection",
      buttonText: "Shop Watches Now",
      buttonUrl: "/shop?category=smart-watches",
      desktopImage: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1600&q=80",
      mobileImage: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
      sortOrder: 1,
      isActive: true,
    },
    {
      heading: "Audiophile Wireless ANC Earbuds",
      subheading: "Up to 40 Hours Playtime with 45ms Ultra-Low Gaming Latency",
      badge: "Hi-Res Audio Certified",
      buttonText: "Discover Audio Gear",
      buttonUrl: "/shop?category=wireless-earbuds",
      desktopImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1600&q=80",
      mobileImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      sortOrder: 2,
      isActive: true,
    },
    {
      heading: "Turbo 65W GaN Chargers & Power Banks",
      subheading: "Power your MacBook, Laptop, and Smartphones simultaneously on the go",
      badge: "Official Anker & Joyroom",
      buttonText: "Shop Charging Gear",
      buttonUrl: "/shop?category=power-banks",
      desktopImage: "https://images.unsplash.com/photo-1609592426867-d8c9735dcae9?auto=format&fit=crop&w=1600&q=80",
      mobileImage: "https://images.unsplash.com/photo-1609592426867-d8c9735dcae9?auto=format&fit=crop&w=800&q=80",
      sortOrder: 3,
      isActive: true,
    },
  ];

  await prisma.heroSlide.deleteMany();
  for (const s of slides) {
    await prisma.heroSlide.create({ data: s });
  }
  console.log("✅ Hero Slides seeded");

  // 6. Seed Trust Features
  const trustFeatures = [
    {
      title: "Nationwide Cash on Delivery",
      description: "Pay with cash at your doorstep across 200+ cities in Pakistan",
      iconName: "Truck",
      sortOrder: 1,
      isEnabled: true,
    },
    {
      title: "100% Genuine Tech Brands",
      description: "Direct official imports with verified authentic factory seals",
      iconName: "ShieldCheck",
      sortOrder: 2,
      isEnabled: true,
    },
    {
      title: "7-Day Checking Warranty",
      description: "Hassle-free replacement for transit damage or factory faults",
      iconName: "RotateCcw",
      sortOrder: 3,
      isEnabled: true,
    },
    {
      title: "WhatsApp Live Support",
      description: "Mon - Sat: 10 AM to 9 PM dedicated technical support",
      iconName: "Headphones",
      sortOrder: 4,
      isEnabled: true,
    },
  ];

  await prisma.trustFeature.deleteMany();
  for (const tf of trustFeatures) {
    await prisma.trustFeature.create({ data: tf });
  }
  console.log("✅ Trust Features seeded");

  // 7. Seed Motion / Watch & Shop Products
  const motionItems = [
    {
      title: "QCY Watch GT AMOLED",
      subtitle: "HD Calling • 1.43 Display",
      badge: "Trending #1",
      price: 8999,
      salePrice: 6499,
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
      linkUrl: "/products/qcy-watch-gt-smart-watch-amoled",
      sortOrder: 1,
      isEnabled: true,
    },
    {
      title: "Soundpeats Engine 4 LDAC",
      subtitle: "Dual Dynamic Hi-Res Drivers",
      badge: "Top Audio",
      price: 12500,
      salePrice: 9499,
      imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
      linkUrl: "/products/soundpeats-engine-4-wireless-earbuds-hi-res",
      sortOrder: 2,
      isEnabled: true,
    },
    {
      title: "Joyroom JR-T03S Pro ANC",
      subtitle: "Hybrid Active Noise Cancelling",
      badge: "-27% OFF",
      price: 6500,
      salePrice: 4750,
      imageUrl: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=600&q=80",
      linkUrl: "/products/joyroom-jr-t03s-pro-anc-earbuds",
      sortOrder: 3,
      isEnabled: true,
    },
    {
      title: "Anker 325 20,000mAh",
      subtitle: "MultiProtect PowerIQ Brick",
      badge: "Best Seller",
      price: 10999,
      salePrice: 8499,
      imageUrl: "https://images.unsplash.com/photo-1609592426867-d8c9735dcae9?auto=format&fit=crop&w=600&q=80",
      linkUrl: "/products/anker-325-power-bank-20000mah-powercore",
      sortOrder: 4,
      isEnabled: true,
    },
  ];

  await prisma.motionProduct.deleteMany();
  for (const m of motionItems) {
    await prisma.motionProduct.create({ data: m });
  }
  console.log("✅ Motion / Watch & Shop items seeded");

  // 8. Seed Verified Customer Reviews
  const reviewsData = [
    {
      productId: (await prisma.product.findFirst({ where: { slug: "qcy-watch-gt-smart-watch-amoled" } })).id,
      customerName: "Usman Ghani",
      customerEmail: "usman.lhr@gmail.com",
      rating: 5,
      title: "Superb AMOLED Display & 24hr delivery",
      comment: "Ordered QCY Watch GT to Lahore. Parcel delivered in exactly 24 hours via Trax. Sealed box and amazing vibrant AMOLED screen. Best wholesale price in Pakistan!",
      status: "APPROVED",
      isVerifiedPurchase: true,
      isFeatured: true,
    },
    {
      productId: (await prisma.product.findFirst({ where: { slug: "soundpeats-engine-4-wireless-earbuds-hi-res" } })).id,
      customerName: "Farhan Siddiqui",
      customerEmail: "farhan.khi@gmail.com",
      rating: 5,
      title: "Audiophile Grade Sound",
      comment: "Soundpeats Engine 4 sound quality is unbelievable for this price range. LDAC codec works flawlessly on my Galaxy phone. 10/10 recommended store!",
      status: "APPROVED",
      isVerifiedPurchase: true,
      isFeatured: true,
    },
    {
      productId: (await prisma.product.findFirst({ where: { slug: "joyroom-jr-t03s-pro-anc-earbuds" } })).id,
      customerName: "Dr. Ayesha Malik",
      customerEmail: "ayesha.isb@gmail.com",
      rating: 5,
      title: "Very safe Cash on Delivery experience",
      comment: "Parcel arrived in Islamabad on time. Rider let me inspect the seal before paying cash. Noise cancellation is very impressive on calls.",
      status: "APPROVED",
      isVerifiedPurchase: true,
      isFeatured: true,
    },
    {
      productId: (await prisma.product.findFirst({ where: { slug: "joyroom-65w-gan-fast-charger-3-port" } })).id,
      customerName: "Zubair Ahmed",
      customerEmail: "zubair.rwp@gmail.com",
      rating: 5,
      title: "Charges my Dell XPS and phone together",
      comment: "Joyroom 65W GaN charger charges my laptop and smartphone simultaneously without getting warm. 100% original product.",
      status: "APPROVED",
      isVerifiedPurchase: true,
      isFeatured: true,
    },
  ];

  await prisma.review.deleteMany();
  for (const r of reviewsData) {
    await prisma.review.create({ data: r });
  }
  console.log("✅ Customer Reviews seeded");

  // 9. Seed Complete Qadri Gadgets-Style Homepage Section Hierarchy
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
      sectionKey: "trust_features",
      type: "TRUST_FEATURES",
      title: "Service & Trust Badges",
      sortOrder: 2,
      isEnabled: true,
      config: JSON.stringify({ layout: "grid-4" }),
    },
    {
      sectionKey: "shop_categories",
      type: "SHOP_CATEGORIES",
      title: "Shop By Categories",
      subtitle: "Explore our curated collection of verified smart electronics",
      sortOrder: 3,
      isEnabled: true,
      config: JSON.stringify({ showCount: true, perRow: 5 }),
    },
    {
      sectionKey: "flash_sale",
      type: "FLASH_SALE",
      title: "⚡ Flash Deals of the Week",
      subtitle: "Grab limited-stock premium devices before time runs out",
      badge: "Limited Stock",
      sortOrder: 4,
      isEnabled: true,
      config: JSON.stringify({ selectionMethod: "ON_SALE", count: 4 }),
    },
    {
      sectionKey: "featured_products",
      type: "PRODUCT_CAROUSEL",
      title: "🔥 Featured Gadgets",
      subtitle: "Top-rated smart gadgets handpicked by our specialists",
      viewAllUrl: "/shop",
      sortOrder: 5,
      isEnabled: true,
      config: JSON.stringify({ selectionMethod: "FEATURED", count: 8, perRow: 4 }),
    },
    {
      sectionKey: "promo_banners",
      type: "PROMO_BANNERS",
      title: "Promotional Highlights",
      sortOrder: 6,
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
      sectionKey: "new_arrivals",
      type: "PRODUCT_CAROUSEL",
      title: "✨ Fresh New Arrivals",
      subtitle: "The newest tech gadgets just landed in Pakistan",
      viewAllUrl: "/shop",
      sortOrder: 7,
      isEnabled: true,
      config: JSON.stringify({ selectionMethod: "LATEST", count: 4, perRow: 4 }),
    },
    {
      sectionKey: "motion_shop",
      type: "MOTION_PRODUCTS",
      title: "Watch & Shop",
      subtitle: "In-Motion Spotlight — Tap any gadget to order instantly",
      badge: "Moving Showcase",
      sortOrder: 8,
      isEnabled: true,
      config: JSON.stringify({ autoplay: true, speed: 3000 }),
    },
    {
      sectionKey: "exclusive_collection",
      type: "PRODUCT_CAROUSEL",
      title: "💎 Exclusive Smartwatches Collection",
      subtitle: "Luxury design meets cutting-edge fitness & biometric metrics",
      viewAllUrl: "/shop?category=smart-watches",
      sortOrder: 9,
      isEnabled: true,
      config: JSON.stringify({ selectionMethod: "CATEGORY", categorySlug: "smart-watches", count: 4, perRow: 4 }),
    },
    {
      sectionKey: "customer_reviews",
      type: "REVIEWS_CAROUSEL",
      title: "What Our Verified Clients Say",
      subtitle: "Honest customer feedback from across Karachi, Lahore, Islamabad and Peshawar",
      sortOrder: 10,
      isEnabled: true,
      config: JSON.stringify({ autoPlay: true, showVerified: true }),
    },
    {
      sectionKey: "whatsapp_banner",
      type: "WHATSAPP_BANNER",
      title: "Need Quick Advice or Bulk Wholesale Deal?",
      subtitle: "Chat directly with our tech experts on WhatsApp for instant assistance and bulk volume pricing.",
      sortOrder: 11,
      isEnabled: true,
      config: JSON.stringify({ whatsappNumber: "923218273588", buttonText: "Chat on WhatsApp" }),
    },
  ];

  await prisma.homepageSection.deleteMany();
  for (const sec of sections) {
    await prisma.homepageSection.create({ data: sec });
  }
  console.log("✅ CMS Homepage Sections hierarchy seeded");

  // 10. Seed Header & Footer Configs
  await prisma.headerConfig.deleteMany();
  await prisma.headerConfig.create({
    data: {
      name: "Main Header",
      layoutType: "DEFAULT",
      sticky: true,
      showAnnouncement: true,
      announcementText: "⚡ Direct Wholesale Hub Pakistan — Free Courier Shipping Over Rs. 3,500!",
      navLinks: JSON.stringify([
        { label: "Home", url: "/" },
        { label: "Smart Watches", url: "/shop?category=smart-watches" },
        { label: "Wireless Earbuds", url: "/shop?category=wireless-earbuds" },
        { label: "GaN Fast Chargers", url: "/shop?category=fast-chargers-cables" },
        { label: "Power Banks", url: "/shop?category=power-banks" },
        { label: "Wholesale Enquiry", url: "/wholesale" },
        { label: "Track Order", url: "/track-order" },
      ]),
      phone: "0321-8273588",
      whatsappNumber: "923218273588",
      isDefault: true,
    },
  });

  await prisma.footerConfig.deleteMany();
  await prisma.footerConfig.create({
    data: {
      name: "Main Footer",
      aboutText: "Apex Commerce is Pakistan's premier wholesale and direct-to-consumer technology distributor, delivering 100% original AMOLED smartwatches, ANC earbuds, and charging gear.",
      showNewsletter: true,
      columns: JSON.stringify([
        {
          title: "Shop Gadgets",
          links: [
            { label: "Smart Watches", url: "/shop?category=smart-watches" },
            { label: "Wireless Earbuds", url: "/shop?category=wireless-earbuds" },
            { label: "Power Banks", url: "/shop?category=power-banks" },
            { label: "GaN Fast Chargers", url: "/shop?category=fast-chargers-cables" },
          ],
        },
        {
          title: "Customer Support",
          links: [
            { label: "Track Your Order", url: "/track-order" },
            { label: "7-Day Return Policy", url: "/return-policy" },
            { label: "Shipping & Delivery", url: "/shipping-policy" },
            { label: "Warranty Verification", url: "/warranty" },
          ],
        },
        {
          title: "Corporate & Wholesale",
          links: [
            { label: "Wholesale Enquiry", url: "/wholesale" },
            { label: "Corporate Gifting", url: "/corporate" },
            { label: "About Our Hub", url: "/about" },
            { label: "Contact Us", url: "/contact" },
          ],
        },
      ]),
      copyrightText: "© 2026 Apex Commerce Pakistan. All rights reserved. 100% Genuine Technology Products.",
      isDefault: true,
    },
  });
  console.log("✅ Visual Header & Footer Configs seeded");

  // 11. Seed Visual Landing Page
  await prisma.visualPage.deleteMany();
  await prisma.visualPage.create({
    data: {
      title: "VIP Tech Launch 2026",
      slug: "vip-launch-2026",
      templateType: "CAMPAIGN",
      status: "PUBLISHED",
      isPublished: true,
      publishedAt: new Date(),
      metaTitle: "VIP Tech Launch 2026 | Apex Commerce Pakistan",
      metaDescription: "Explore our exclusive flagship smartwatches and audio accessories with 1-Year official warranty and Cash on Delivery nationwide.",
      builderData: JSON.stringify({
        sections: [
          {
            id: "sec_hero",
            layoutType: "container",
            paddingY: "60px",
            bgColor: "#0f172a",
            columns: [
              {
                id: "col_1",
                widthDesktop: 100,
                elements: [
                  {
                    id: "el_head",
                    type: "heading",
                    content: { text: "Apex VIP Tech Showcase 2026", tag: "h1" },
                    layout: { align: "center" },
                    design: { color: "#ffffff", fontSize: "36px" },
                  },
                  {
                    id: "el_p",
                    type: "text",
                    content: { text: "Experience next-generation AMOLED smartwatches and Hi-Res wireless audio with verified genuine brand seals and door-to-door Cash on Delivery in 200+ cities." },
                    layout: { align: "center", margin: "16px 0" },
                    design: { color: "#94a3b8" },
                  },
                  {
                    id: "el_btn",
                    type: "button",
                    content: { buttonText: "Explore Collection", url: "/shop" },
                    layout: { align: "center" },
                    design: { bgColor: "#10b981", color: "#ffffff" },
                  },
                ],
              },
            ],
          },
          {
            id: "sec_features",
            layoutType: "container",
            paddingY: "40px",
            columns: [
              {
                id: "col_feat",
                widthDesktop: 100,
                elements: [
                  {
                    id: "el_trust",
                    type: "trust_badges",
                    content: {},
                    layout: {},
                    design: {},
                  },
                ],
              },
            ],
          },
        ],
      }),
    },
  });
  console.log("✅ Visual Landing Page seeded");

  // 12. Seed Forms
  await prisma.form.deleteMany();
  await prisma.form.create({
    data: {
      name: "Wholesale & Bulk Orders Enquiry",
      slug: "wholesale-enquiry",
      description: "Direct wholesale quote request for retailers and corporate buyers.",
      submitButtonText: "Request Wholesale Pricing",
      successMessage: "Thank you! Our wholesale desk will contact your WhatsApp within 2 hours.",
      recipientEmails: "wholesale@apexgadgets.pk",
      isActive: true,
      fields: JSON.stringify([
        { name: "companyName", label: "Business / Shop Name", type: "text", required: true, placeholder: "e.g. Apex Tech Lahore" },
        { name: "contactName", label: "Contact Person", type: "text", required: true, placeholder: "e.g. Muhammad Usman" },
        { name: "phone", label: "WhatsApp Number", type: "phone", required: true, placeholder: "0321-8273588" },
        { name: "city", label: "City", type: "text", required: true, placeholder: "Karachi / Lahore / Islamabad" },
        { name: "volume", label: "Estimated Monthly Quantity", type: "dropdown", required: true, options: ["50 - 100 units", "100 - 500 units", "500+ units"] },
        { name: "notes", label: "Products of Interest", type: "textarea", required: false, placeholder: "List models or categories you need..." },
      ]),
    },
  });
  console.log("✅ WordPress-Style Forms seeded");

  // 13. Seed Popups
  await prisma.popup.deleteMany();
  await prisma.popup.create({
    data: {
      name: "First Order Welcome Discount",
      type: "DISCOUNT",
      title: "Get Rs. 500 OFF Your First Order!",
      subtitle: "Use exclusive promo code on any AMOLED smartwatch or ANC earbuds over Rs. 4,000.",
      couponCode: "WELCOME500",
      buttonText: "Shop Gadgets Now",
      buttonUrl: "/shop",
      triggerType: "DELAY",
      triggerValue: "5",
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
      isEnabled: true,
    },
  });
  console.log("✅ Marketing Popups seeded");

  // 14. Seed Collections
  await prisma.collection.deleteMany();
  await prisma.collection.create({
    data: {
      name: "Elite AMOLED Smartwatches",
      slug: "elite-amoled-smartwatches",
      description: "Premium smartwatches featuring vivid 60Hz AMOLED screens, Bluetooth calling, and titanium finishes.",
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
      type: "AUTOMATED",
      rules: JSON.stringify([{ field: "category", operator: "equals", value: "smart-watches" }]),
      isPublished: true,
    },
  });
  console.log("✅ Collections seeded");

  // 15. Seed Product Bundles
  await prisma.productBundle.deleteMany();
  await prisma.productBundle.create({
    data: {
      name: "Ultimate AMOLED Fitness Combo",
      slug: "ultimate-amoled-fitness-combo",
      description: "QCY AMOLED Smartwatch + Soundpeats Wireless Earbuds + Extra Magnetic Charging Cable.",
      regularPrice: 18999,
      bundlePrice: 14499,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
      isActive: true,
    },
  });
  console.log("✅ Product Bundles seeded");

  // 16. Seed Flash Sale
  const now = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  await prisma.flashSale.deleteMany();
  await prisma.flashSale.create({
    data: {
      name: "Weekend Tech Blitz",
      badge: "⚡ 72 Hours Blitz",
      discountPercentage: 25,
      startDate: now,
      endDate: threeDaysLater,
      isActive: true,
    },
  });
  console.log("✅ Flash Sales seeded");

  // 17. Seed Gift Card
  await prisma.giftCard.deleteMany();
  await prisma.giftCard.create({
    data: {
      code: "APEX-VIP2026",
      initialValue: 5000,
      balance: 5000,
      status: "ACTIVE",
      notes: "Corporate VIP welcome gift voucher",
    },
  });
  console.log("✅ Gift Cards seeded");

  // 18. Seed SEO Redirect
  await prisma.redirect.deleteMany();
  await prisma.redirect.create({
    data: {
      sourceUrl: "/old-smartwatches-link",
      targetUrl: "/shop?category=smart-watches",
      statusCode: 301,
      isActive: true,
    },
  });
  console.log("✅ SEO Redirects seeded");

  console.log("🎉 Complete Enterprise E-Commerce Platform DB Ready!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
