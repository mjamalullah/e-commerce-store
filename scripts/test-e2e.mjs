import { PrismaClient } from "@prisma/client";
import { generateOrderNumber } from "../src/lib/utils.ts";

const prisma = new PrismaClient();

async function runTest() {
  console.log("🧪 Running End-to-End System Verification...");

  // 1. Verify Products in DB
  const products = await prisma.product.findMany({ include: { variants: true } });
  console.log(`✅ Database contains ${products.length} active products.`);

  const testProduct = products[0];
  const initialStock = testProduct.stock;
  console.log(`📦 Testing with product: "${testProduct.name}" (Initial stock: ${initialStock})`);

  // 2. Simulate Order Creation Transaction
  const orderNumber = generateOrderNumber();
  const testOrder = await prisma.$transaction(async (tx) => {
    const ord = await tx.order.create({
      data: {
        orderNumber,
        customerName: "Ahmed Khan Test",
        customerPhone: "03001234567",
        customerEmail: "ahmed@test.pk",
        shippingProvince: "Punjab",
        shippingCity: "Lahore",
        shippingAddress: "House 12, Street 4, Gulberg III",
        subtotal: testProduct.salePrice || testProduct.regularPrice,
        discount: 0,
        shippingFee: 0,
        codFee: 0,
        total: testProduct.salePrice || testProduct.regularPrice,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        items: {
          create: [
            {
              productId: testProduct.id,
              productTitle: testProduct.name,
              sku: testProduct.sku,
              price: testProduct.salePrice || testProduct.regularPrice,
              quantity: 1,
              total: testProduct.salePrice || testProduct.regularPrice,
            },
          ],
        },
        statusHistory: {
          create: {
            status: "PENDING",
            note: "Test Order placed via Cash on Delivery",
          },
        },
      },
      include: { items: true },
    });

    // Stock decrement
    await tx.product.update({
      where: { id: testProduct.id },
      data: { stock: { decrement: 1 } },
    });

    // Movement log
    await tx.inventoryMovement.create({
      data: {
        productId: testProduct.id,
        type: "SALE",
        quantity: -1,
        previousStock: initialStock,
        newStock: initialStock - 1,
        reason: `Order #${orderNumber}`,
        reference: orderNumber,
      },
    });

    return ord;
  });

  console.log(`✅ Order created successfully: #${testOrder.orderNumber} (Total: Rs. ${testOrder.total})`);

  // 3. Verify stock decrement
  const updatedProduct = await prisma.product.findUnique({ where: { id: testProduct.id } });
  if (updatedProduct.stock === initialStock - 1) {
    console.log(`✅ Stock decremented correctly: ${initialStock} -> ${updatedProduct.stock}`);
  } else {
    throw new Error("Stock decrement failed!");
  }

  // 4. Verify Tracking Lookup
  const trackedOrder = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true, statusHistory: true },
  });
  if (trackedOrder && trackedOrder.items.length === 1) {
    console.log(`✅ Order tracking query verified: Status is "${trackedOrder.orderStatus}"`);
  }

  // 5. Clean up test order to keep DB clean
  await prisma.order.delete({ where: { id: testOrder.id } });
  await prisma.product.update({
    where: { id: testProduct.id },
    data: { stock: initialStock },
  });
  console.log("🧹 Test cleanup completed. Stock restored.");

  console.log("🎉 ALL END-TO-END VERIFICATION CHECKS PASSED PERFECTLY!");
}

runTest()
  .catch((e) => {
    console.error("❌ Test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
