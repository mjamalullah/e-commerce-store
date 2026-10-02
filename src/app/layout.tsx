import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PopupRenderer from "@/components/popups/PopupRenderer";
import prisma from "@/lib/prisma";
import { getStoreSettings } from "@/lib/settings";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return {
    title: {
      default: `${settings.storeName} | Smartwatches, Earbuds & Tech Accessories in Pakistan`,
      template: `%s | ${settings.storeName}`,
    },
    description: settings.metaDescription,
    keywords: [
      "smartwatch pakistan",
      "wireless earbuds karachi",
      "power bank wholesale lahore",
      "gan charger islamabad",
      "cash on delivery pakistan",
      "qcy watch",
      "soundpeats earbuds",
      "anker powercore",
    ],
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://apexgadgets.pk"),
    openGraph: {
      title: `${settings.storeName} | Best Wholesale Gadgets in Pakistan`,
      description: settings.metaDescription,
      url: process.env.NEXT_PUBLIC_APP_URL || "https://apexgadgets.pk",
      siteName: settings.storeName,
      images: [
        {
          url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&h=630&q=80",
          width: 1200,
          height: 630,
          alt: settings.storeName,
        },
      ],
      locale: "en_PK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.storeName,
      description: settings.metaDescription,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, customScripts] = await Promise.all([
    getStoreSettings(),
    prisma.customScript.findMany({ where: { isEnabled: true } }),
  ]);

  const headScripts = customScripts.filter((s) => s.location === "HEAD");
  const bodyStartScripts = customScripts.filter((s) => s.location === "BODY_START");
  const bodyEndScripts = customScripts.filter((s) => s.location === "BODY_END");

  return (
    <html lang="en">
      <head>
        {headScripts.map((s) => (
          <script
            key={s.id}
            dangerouslySetInnerHTML={{ __html: s.code }}
          />
        ))}
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        {bodyStartScripts.map((s) => (
          <div
            key={s.id}
            dangerouslySetInnerHTML={{ __html: s.code }}
          />
        ))}

        <CartProvider>
          <WishlistProvider>
            {/* Header & Announcement Bar */}
            {settings.theme.showAnnouncement && (
              <AnnouncementBar
                text={settings.theme.announcementText}
                whatsappNumber={settings.whatsappNumber}
              />
            )}
            <Header
              storeName={settings.storeName}
              contactPhone={settings.contactPhone}
              whatsappNumber={settings.whatsappNumber}
            />

            {/* Main Page Content */}
            <main className="flex-1">{children}</main>

            {/* Interactive Cart Drawer */}
            <CartDrawer />

            {/* Floating WhatsApp chat widget */}
            <FloatingWhatsApp
              whatsappNumber={settings.whatsappNumber}
              storeName={settings.storeName}
            />

            {/* Marketing Popups Engine */}
            <PopupRenderer />

            {/* Storefront Footer */}
            <Footer
              storeName={settings.storeName}
              contactEmail={settings.contactEmail}
              contactPhone={settings.contactPhone}
              whatsappNumber={settings.whatsappNumber}
              address={settings.address}
            />
          </WishlistProvider>
        </CartProvider>

        {bodyEndScripts.map((s) => (
          <div
            key={s.id}
            dangerouslySetInnerHTML={{ __html: s.code }}
          />
        ))}
      </body>
    </html>
  );
}
