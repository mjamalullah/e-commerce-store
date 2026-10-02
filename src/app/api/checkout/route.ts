import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { validatePakistanPhone } from "@/lib/pakistan-data";
import { getStoreSettings } from "@/lib/settings";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingProvince,
      shippingCity,
      shippingArea,
      shippingAddress,
      landmark,
      deliveryNotes,
      paymentMethod = "COD",
      couponCode,
      items,
    } = body;

    // 1. Validation
    if (!customerName?.trim()) {
      return NextResponse.json({ success: false, message: "Customer name is required" }, { status: 400 });
    }

    if (!customerPhone?.trim() || !validatePakistanPhone(customerPhone)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid Pakistani mobile number (e.g. 0300-1234567)" },
        { status: 400 }
      );
    }

    if (!shippingCity?.trim()) {
      return NextResponse.json({ success: false, message: "City is required" }, { status: 400 });
    }

    if (!shippingAddress?.trim()) {
      return NextResponse.json({ success: false, message: "Complete delivery address is required" }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "Your cart is empty" }, { status: 400 });
    }

    const settings = await getStoreSettings();

    // 2. Fetch and verify products from database
    let subtotal = 0;
    const verifiedOrderItems: Array<{
      productId: string;
      variantId?: string | null;
      productTitle: string;
      variantTitle?: string | null;
      sku: string;
      price: number;
      quantity: number;
      total: number;
      image?: string;
    }> = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true, images: true },
      });

      if (!product || !product.isPublished) {
        return NextResponse.json(
          { success: false, message: `Product "${item.title}" is no longer available` },
          { status: 400 }
        );
      }

      let price = product.salePrice || product.regularPrice;
      let sku = product.sku;
      let variantTitle: string | null = null;
      let image = product.images[0]?.url || "";

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) {
          return NextResponse.json(
            { success: false, message: `Selected variant for "${product.name}" not found` },
            { status: 400 }
          );
        }
        if (variant.stock < item.quantity) {
          return NextResponse.json(
            { success: false, message: `Insufficient stock for "${product.name} - ${variant.title}". Only ${variant.stock} left in stock.` },
            { status: 400 }
          );
        }
        price = variant.salePrice || variant.price;
        sku = variant.sku;
        variantTitle = variant.title;
        if (variant.image) image = variant.image;
      } else {
        if (product.stock < item.quantity) {
          return NextResponse.json(
            { success: false, message: `Insufficient stock for "${product.name}". Only ${product.stock} available.` },
            { status: 400 }
          );
        }
      }

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      verifiedOrderItems.push({
        productId: product.id,
        variantId: item.variantId || null,
        productTitle: product.name,
        variantTitle,
        sku,
        price,
        quantity: item.quantity,
        total: itemTotal,
        image,
      });
    }

    // 3. Discount calculation via coupon if present
    let discount = 0;
    let appliedCouponRecord: any = null;
    if (couponCode) {
      appliedCouponRecord = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (appliedCouponRecord && appliedCouponRecord.isActive) {
        if (appliedCouponRecord.type === "PERCENTAGE") {
          discount = Math.round((subtotal * appliedCouponRecord.value) / 100);
          if (appliedCouponRecord.maxDiscount && discount > appliedCouponRecord.maxDiscount) {
            discount = appliedCouponRecord.maxDiscount;
          }
        } else if (appliedCouponRecord.type === "FIXED") {
          discount = Math.min(subtotal, appliedCouponRecord.value);
        }
      }
    }

    // 4. Shipping fee
    const isFreeShipping =
      subtotal >= settings.freeShippingThreshold ||
      appliedCouponRecord?.type === "FREE_SHIPPING";

    const shippingFee = isFreeShipping ? 0 : settings.baseShippingFee;
    const codFee = paymentMethod === "COD" ? settings.codFee : 0;
    const finalTotal = Math.max(0, subtotal - discount + shippingFee + codFee);

    // 5. Generate Order Number
    const orderNumber = generateOrderNumber();

    // 6. Execute atomic database transaction
    const order = await prisma.$transaction(async (tx) => {
      // Find or create customer
      const cleanedPhone = customerPhone.replace(/[^0-9]/g, "");
      let customer = await tx.customer.findUnique({
        where: { phone: cleanedPhone },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            name: customerName.trim(),
            phone: cleanedPhone,
            email: customerEmail?.trim() || null,
            totalOrders: 1,
            totalSpent: finalTotal,
          },
        });
      } else {
        await tx.customer.update({
          where: { id: customer.id },
          data: {
            name: customerName.trim(),
            totalOrders: { increment: 1 },
            totalSpent: { increment: finalTotal },
          },
        });
      }

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          customerName: customerName.trim(),
          customerPhone: cleanedPhone,
          customerEmail: customerEmail?.trim() || null,
          shippingProvince: shippingProvince || "Punjab",
          shippingCity: shippingCity.trim(),
          shippingArea: shippingArea?.trim() || null,
          shippingAddress: shippingAddress.trim(),
          landmark: landmark?.trim() || null,
          deliveryNotes: deliveryNotes?.trim() || null,
          subtotal,
          discount,
          shippingFee,
          codFee,
          total: finalTotal,
          paymentMethod,
          paymentStatus: "PENDING",
          orderStatus: "PENDING",
          couponCode: appliedCouponRecord?.code || null,
          items: {
            create: verifiedOrderItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              productTitle: item.productTitle,
              variantTitle: item.variantTitle,
              sku: item.sku,
              price: item.price,
              quantity: item.quantity,
              total: item.total,
              image: item.image,
            })),
          },
          statusHistory: {
            create: {
              status: "PENDING",
              note: `Order placed via ${paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod}. Total: Rs. ${finalTotal.toLocaleString("en-PK")}`,
              createdBy: "Customer (Checkout)",
            },
          },
        },
      });

      // Update Inventory & log movement
      for (const item of verifiedOrderItems) {
        if (item.variantId) {
          const currentVariant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
          });
          if (currentVariant) {
            const newStock = Math.max(0, currentVariant.stock - item.quantity);
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: newStock },
            });
            await tx.inventoryMovement.create({
              data: {
                productId: item.productId,
                variantId: item.variantId,
                type: "SALE",
                quantity: -item.quantity,
                previousStock: currentVariant.stock,
                newStock,
                reason: `Order #${orderNumber}`,
                reference: orderNumber,
              },
            });
          }
        } else {
          const currentProduct = await tx.product.findUnique({
            where: { id: item.productId },
          });
          if (currentProduct) {
            const newStock = Math.max(0, currentProduct.stock - item.quantity);
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: newStock },
            });
            await tx.inventoryMovement.create({
              data: {
                productId: item.productId,
                type: "SALE",
                quantity: -item.quantity,
                previousStock: currentProduct.stock,
                newStock,
                reason: `Order #${orderNumber}`,
                reference: orderNumber,
              },
            });
          }
        }
      }

      // Update Coupon count
      if (appliedCouponRecord) {
        await tx.coupon.update({
          where: { id: appliedCouponRecord.id },
          data: { usageCount: { increment: 1 } },
        });
      }

      return newOrder;
    });

    // 7. Compose WhatsApp Pre-filled URL for quick customer confirmation
    const waText = encodeURIComponent(
      `Salam! I just placed an order on ${settings.storeName}.\n\n*Order #:* ${orderNumber}\n*Total:* Rs. ${finalTotal.toLocaleString("en-PK")}\n*Items:* ${verifiedOrderItems.length} product(s)\n*City:* ${shippingCity}\n*Payment:* ${paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod}\n\nPlease confirm my parcel shipment. JazakAllah!`
    );
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${waText}`;

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: order.id,
      total: finalTotal,
      customerName,
      customerPhone,
      city: shippingCity,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process order" },
      { status: 500 }
    );
  }
}
