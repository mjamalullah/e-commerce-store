# Apex Commerce — Production-Ready E-Commerce Software Platform

A commercial-grade, full-stack E-Commerce software platform built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**.

Designed with **zero platform lock-in**, **100% source code and database ownership**, featuring a customer-facing storefront inspired by [qadrigadgets.pk](https://www.qadrigadgets.pk/), paired with an **enterprise admin portal**, **Elementor-style Visual Page Builder**, **drag-and-drop Homepage Builder**, and **Pakistani Cash on Delivery (COD) express checkout**.

---

## 🌟 Key Features

### 🛍️ Customer Storefront
- **Green Gradient Header:** Sticky elevation, rounded corners, brand logo, compact desktop and mobile navigation.
- **Continuous Marquee Announcement Ticker:** Smooth horizontal scrolling ticker with hover-pause.
- **Product Categories Flyout:** Category dropdown with icons and nested subcategory flyouts.
- **Search Popup Overlay:** Debounced live matching modal (`Ctrl + K`) with product thumbnails and popular tags.
- **Product Presentation:** Desktop hover secondary image flip, discount badges, ratings, and wishlist toggles.
- **Quick View Modal:** Gallery thumbnails, variant selector, quantity stepper, specifications link.
- **Cart Confirmation Modal:** Dual action prompts (`[ Continue Shopping ]` and `[ View Cart & Checkout ]`).
- **1-Click Quick Buy (COD):** Minimal 20-second Pakistani express checkout (Karachi, Lahore, Islamabad, etc.).
- **Watch & Shop / In Motion Reels:** Looping video reel cards with individual mute/unmute audio toggles and 1-tap COD ordering.
- **Customer Reviews Carousel:** Verified customer badges, avatar initials, star ratings, and quote styling.
- **Express 1-Page Pakistan Checkout:** Cash on Delivery default, Meezan Bank / JazzCash / Easypaisa support, coupon codes, and shipping calculator.
- **Multi-Column Footer:** Courier badges (TCS, Leopards, Trax, PostEx), accepted payment modes, and newsletter subscription.

### ⚙️ Enterprise Admin Dashboard & CMS
- **WordPress-Style Top Bar:** Permanent **`[ 👁 VIEW STORE ]`** button opening live storefront in a new tab (`target="_blank"`), and **`[ ⚡ LIVE PREVIEW ]`** for draft mode.
- **Draft vs. Live / Publish System:** Edit layout and configs without affecting public visitors until explicitly clicking **"Publish to Live"**.
- **Version History & 1-Click Restore:** Automated immutable snapshots of published homepage configurations with 1-click restore.
- **Elementor-Style Visual Page Builder:** Drag-and-drop canvas with Desktop, Tablet, and Mobile preview breakpoints.
- **WordPress-Style Form Builder:** Drag-and-drop fields, submission inbox with CSV export.
- **Marketing Popups Engine:** Triggers based on exit intent, delay, or scroll depth.
- **Catalog & Inventory:** Unlimited product variants, stock ledger, low stock alerts.
- **Scheduled Maintenance Mode:** Toggle with custom messages while maintaining admin preview access.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ or v20+
- **npm** or **yarn** / **pnpm**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/mjamalullah/e-commerce-store.git
cd e-commerce-store

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 4. Database Setup & Seeding
```bash
# Sync database schema
npx prisma db push

# Seed products, hero slides, categories, and 20 homepage sections
node scripts/seed.mjs
node scripts/seed-sections.mjs
```

### 5. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the customer storefront.

---

## 🔑 Default Admin Credentials

- **Admin Login:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Admin Dashboard:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Email:** `admin@apexgadgets.pk`
- **Password:** `admin123`

*(A 1-click **"⚡ Auto-fill Super Admin"** button is also available on the login page)*

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **Database & ORM:** SQLite (Zero-config local) / PostgreSQL compatible via Prisma ORM
- **State Management:** React Context (Cart, Wishlist)
- **Optimization:** Sharp (Automatic WebP & AVIF conversion pipeline)
