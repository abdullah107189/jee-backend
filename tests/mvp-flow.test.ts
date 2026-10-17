import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";
import { generateAccessToken } from "../src/utils/generateToken";

const BASE_URL = "http://localhost:5000/api/v1";

describe("MVP Flow Verification Tests", () => {
  let testPassword: string;
  let hashedPassword: string;

  let customerAUser: any;
  let customerAProfile: any;
  let customerAToken: string;

  let customerBUser: any;
  let customerBProfile: any;
  let customerBToken: string;

  let adminUser: any;
  let adminToken: string;

  let sellerUser: any;
  let sellerProfile: any;
  let sellerToken: string;

  let testProduct: any;
  let testVariant: any;

  beforeAll(async () => {
    // 1. Safety check: ensure DATABASE_URL is localhost / dev DB only
    const dbUrl = process.env.DATABASE_URL || "";
    const isLocalhost =
      dbUrl.includes("localhost") ||
      dbUrl.includes("127.0.0.1") ||
      dbUrl.includes("::1");

    if (!isLocalhost) {
      throw new Error(
        `Safety check failed: DATABASE_URL (${dbUrl}) is not localhost. Stopping tests to prevent accidental production/staging DB changes!`,
      );
    }

    testPassword = process.env.TEST_USER_PASSWORD || "";
    if (!testPassword) {
      throw new Error("TEST_USER_PASSWORD environment variable is required in .env");
    }

    hashedPassword = await bcrypt.hash(testPassword, 10);
    const ts = Date.now();

    // 2. Customer A
    customerAUser = await prisma.user.create({
      data: {
        name: `test-customer-a-${ts}`,
        email: `test-customer-a-${ts}@test.com`,
        password: hashedPassword,
        role: "CUSTOMER",
        phone: `0171${ts.toString().slice(-7)}`,
        isVerified: true,
        isActive: true,
      },
    });
    customerAProfile = await prisma.customer.create({
      data: { userId: customerAUser.id },
    });
    customerAToken = generateAccessToken(customerAUser.id, "CUSTOMER");

    // 3. Customer B
    customerBUser = await prisma.user.create({
      data: {
        name: `test-customer-b-${ts}`,
        email: `test-customer-b-${ts}@test.com`,
        password: hashedPassword,
        role: "CUSTOMER",
        phone: `0172${ts.toString().slice(-7)}`,
        isVerified: true,
        isActive: true,
      },
    });
    customerBProfile = await prisma.customer.create({
      data: { userId: customerBUser.id },
    });
    customerBToken = generateAccessToken(customerBUser.id, "CUSTOMER");

    // 4. Admin
    adminUser = await prisma.user.create({
      data: {
        name: `test-admin-${ts}`,
        email: `test-admin-${ts}@test.com`,
        password: hashedPassword,
        role: "ADMIN",
        isVerified: true,
        isActive: true,
      },
    });
    adminToken = generateAccessToken(adminUser.id, "ADMIN");

    // 5. Seller
    sellerUser = await prisma.user.create({
      data: {
        name: `test-seller-${ts}`,
        email: `test-seller-${ts}@test.com`,
        password: hashedPassword,
        role: "SELLER",
        isVerified: true,
        isActive: true,
      },
    });
    sellerProfile = await prisma.seller.create({
      data: {
        userId: sellerUser.id,
        companyName: `test-seller-company-${ts}`,
        country: "Bangladesh",
        status: "APPROVED",
      },
    });
    sellerToken = generateAccessToken(sellerUser.id, "SELLER");

    // 6. Base Product and Variant
    testProduct = await prisma.product.create({
      data: {
        name: `test-product-${ts}`,
        slug: `test-product-${ts}`,
        warrantyMonths: 12,
        warrantyTerms: "1 year standard warranty",
        isPublished: true,
        isActive: true,
      },
    });

    testVariant = await prisma.productVariant.create({
      data: {
        productId: testProduct.id,
        sku: `test-sku-${ts}`,
        price: 500,
        attributes: { color: "black", wattage: "15W" },
        stockQuantity: 10,
        isActive: true,
      },
    });

    // Create a pool of available items
    for (let i = 1; i <= 8; i++) {
      await prisma.productItem.create({
        data: {
          variantId: testVariant.id,
          serialNumber: `test-pool-sn-${i}-${ts}`,
          status: "AVAILABLE",
        },
      });
    }
  });

  afterAll(async () => {
    // Only delete test data matching "test-" prefix (dev DB only)
    try {
      await prisma.warrantyClaim.deleteMany({
        where: {
          OR: [
            { claimNumber: { startsWith: "test-" } },
            { warranty: { productItem: { serialNumber: { startsWith: "test-" } } } },
          ],
        },
      });

      await prisma.warranty.deleteMany({
        where: {
          OR: [
            { productItem: { serialNumber: { startsWith: "test-" } } },
            { customer: { user: { email: { startsWith: "test-" } } } },
            { seller: { companyName: { startsWith: "test-" } } },
          ],
        },
      });

      await prisma.onlineOrderItem.deleteMany({
        where: {
          OR: [
            { productItem: { serialNumber: { startsWith: "test-" } } },
            { order: { customer: { user: { email: { startsWith: "test-" } } } } },
          ],
        },
      });

      await prisma.offlineSale.deleteMany({
        where: {
          OR: [
            { productItem: { serialNumber: { startsWith: "test-" } } },
            { seller: { companyName: { startsWith: "test-" } } },
          ],
        },
      });

      await prisma.onlineOrder.deleteMany({
        where: {
          customer: { user: { email: { startsWith: "test-" } } },
        },
      });

      await prisma.productItem.deleteMany({
        where: { serialNumber: { startsWith: "test-" } },
      });

      await prisma.productVariant.deleteMany({
        where: { sku: { startsWith: "test-" } },
      });

      await prisma.product.deleteMany({
        where: { slug: { startsWith: "test-" } },
      });

      await prisma.customer.deleteMany({
        where: { user: { email: { startsWith: "test-" } } },
      });

      await prisma.seller.deleteMany({
        where: { user: { email: { startsWith: "test-" } } },
      });

      await prisma.user.deleteMany({
        where: { email: { startsWith: "test-" } },
      });
    } catch (e) {
      console.warn("Cleanup error (harmless):", e);
    }
  });

  // -------------------------------------------------------------
  // a. Customer A এর order কে Customer B দিয়ে GET /orders/:id করলে 403
  // -------------------------------------------------------------
  it("Case a: Customer A order accessed by Customer B returns 403", async () => {
    const createRes = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerAToken}`,
      },
      body: JSON.stringify({
        items: [{ variantId: testVariant.id, quantity: 1 }],
        shippingAddress: {
          fullName: "Customer A",
          phone: "01711111111",
          streetAddress: "Dhaka, Bangladesh",
        },
      }),
    });

    expect(createRes.status).toBe(201);
    const order = ((await createRes.json()) as any).data;

    const getRes = await fetch(`${BASE_URL}/orders/${order.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${customerBToken}`,
      },
    });

    console.log(`[Case a] GET other customer order status: ${getRes.status}`);
    expect(getRes.status).toBe(403);
  });

  // -------------------------------------------------------------
  // b1. Customer নিজের PENDING order cancel -> ঠিক (200)
  // -------------------------------------------------------------
  it("Case b1: Customer cancels own PENDING order -> 200", async () => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerAToken}`,
      },
      body: JSON.stringify({
        items: [{ variantId: testVariant.id, quantity: 1 }],
        shippingAddress: {
          fullName: "Customer A",
          phone: "01711111111",
          streetAddress: "Dhaka",
        },
      }),
    });
    expect(res.status).toBe(201);
    const order = ((await res.json()) as any).data;
    expect(order.status).toBe("PENDING");

    const cancelRes = await fetch(`${BASE_URL}/orders/${order.id}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${customerAToken}`,
      },
    });

    console.log(`[Case b1] Customer cancel PENDING order status: ${cancelRes.status}`);
    expect(cancelRes.status).toBe(200);

    const cancelledOrder = ((await cancelRes.json()) as any).data;
    expect(cancelledOrder.status).toBe("CANCELLED");
  });

  // -------------------------------------------------------------
  // b2. Customer CONFIRMED order cancel -> 400
  // -------------------------------------------------------------
  it("Case b2: Customer cancelling CONFIRMED order -> 400", async () => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerAToken}`,
      },
      body: JSON.stringify({
        items: [{ variantId: testVariant.id, quantity: 1 }],
        shippingAddress: {
          fullName: "Customer A",
          phone: "01711111111",
          streetAddress: "Dhaka",
        },
      }),
    });
    expect(res.status).toBe(201);
    const order = ((await res.json()) as any).data;

    // Admin marks order CONFIRMED
    const patchRes = await fetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: "CONFIRMED" }),
    });
    expect(patchRes.status).toBe(200);

    // Customer tries to cancel CONFIRMED order -> 400
    const cancelRes = await fetch(`${BASE_URL}/orders/${order.id}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${customerAToken}`,
      },
    });

    console.log(`[Case b2] Customer cancel CONFIRMED order status: ${cancelRes.status}`);
    expect(cancelRes.status).toBe(400);
  });

  // -------------------------------------------------------------
  // c1. Admin: PENDING -> DELIVERED সরাসরি -> 400
  // -------------------------------------------------------------
  it("Case c1: Admin transitioning PENDING directly to DELIVERED returns 400", async () => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerAToken}`,
      },
      body: JSON.stringify({
        items: [{ variantId: testVariant.id, quantity: 1 }],
        shippingAddress: {
          fullName: "Customer A",
          phone: "01711111111",
          streetAddress: "Dhaka",
        },
      }),
    });
    expect(res.status).toBe(201);
    const order = ((await res.json()) as any).data;
    expect(order.status).toBe("PENDING");

    const directDelivered = await fetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: "DELIVERED" }),
    });

    console.log(`[Case c1] Direct PENDING -> DELIVERED status: ${directDelivered.status}`);
    expect(directDelivered.status).toBe(400);
  });

  // -------------------------------------------------------------
  // c2 & c3. Admin ধাপে ধাপে DELIVERED -> ঠিক (200), item SOLD, Warranty তৈরি, paymentStatus PAID
  // -------------------------------------------------------------
  it("Case c2 & c3: Stepwise DELIVERED succeeds, item SOLD, Warranty created, paymentStatus PAID", async () => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerAToken}`,
      },
      body: JSON.stringify({
        items: [{ variantId: testVariant.id, quantity: 1 }],
        shippingAddress: {
          fullName: "Customer A",
          phone: "01711111111",
          streetAddress: "Dhaka",
        },
      }),
    });
    expect(res.status).toBe(201);
    const order = ((await res.json()) as any).data;

    // Step 1: PENDING -> CONFIRMED
    const toConfirmed = await fetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: "CONFIRMED" }),
    });
    expect(toConfirmed.status).toBe(200);

    // Step 2: CONFIRMED -> PROCESSING
    const toProcessing = await fetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: "PROCESSING" }),
    });
    expect(toProcessing.status).toBe(200);

    // Step 3: PROCESSING -> SHIPPED
    const toShipped = await fetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: "SHIPPED" }),
    });
    expect(toShipped.status).toBe(200);

    // Step 4: SHIPPED -> DELIVERED
    const toDelivered = await fetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: "DELIVERED" }),
    });
    console.log(`[Case c2] SHIPPED -> DELIVERED status: ${toDelivered.status}`);
    expect(toDelivered.status).toBe(200);

    // c3 DB verification
    const dbOrder = await prisma.onlineOrder.findUnique({
      where: { id: order.id },
      include: { orderItems: true },
    });

    expect(dbOrder?.status).toBe("DELIVERED");
    expect(dbOrder?.paymentStatus).toBe("PAID");

    const productItemId = dbOrder!.orderItems[0].productItemId;
    const dbItem = await prisma.productItem.findUnique({ where: { id: productItemId } });
    expect(dbItem?.status).toBe("SOLD");

    const dbWarranty = await prisma.warranty.findUnique({ where: { productItemId } });
    expect(dbWarranty).not.toBeNull();
    expect(dbWarranty?.saleType).toBe("ONLINE");
    expect(dbWarranty?.customerId).toBe(customerAProfile.id);
    expect(dbWarranty?.onlineOrderId).toBe(order.id);
    expect(dbWarranty?.status).toBe("ACTIVE");

    const now = new Date();
    const expectedEndDate = new Date(now);
    expectedEndDate.setMonth(expectedEndDate.getMonth() + testProduct.warrantyMonths);
    const diffDays = Math.abs(
      (new Date(dbWarranty!.endDate).getTime() - expectedEndDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    expect(diffDays).toBeLessThan(3);
    console.log(`[Case c3] DB Check: item SOLD, Warranty ACTIVE (${dbWarranty?.endDate.toISOString().slice(0, 10)}), paymentStatus PAID`);
  });

  // -------------------------------------------------------------
  // d. DELIVERED অর্ডার cancel -> 400
  // -------------------------------------------------------------
  it("Case d: Cancelling a DELIVERED order returns 400", async () => {
    // 1. Create and progress order to DELIVERED
    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${customerAToken}` },
      body: JSON.stringify({
        items: [{ variantId: testVariant.id, quantity: 1 }],
        shippingAddress: { fullName: "Customer A", phone: "01711111111", streetAddress: "Dhaka" },
      }),
    });
    const order = ((await res.json()) as any).data;

    await fetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: "CONFIRMED" }),
    });
    await fetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: "PROCESSING" }),
    });
    await fetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: "SHIPPED" }),
    });
    await fetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: "DELIVERED" }),
    });

    // 2. Attempt to cancel DELIVERED order via PATCH
    const patchCancel = await fetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    console.log(`[Case d] PATCH DELIVERED -> CANCELLED status: ${patchCancel.status}`);
    expect(patchCancel.status).toBe(400);

    // 3. Attempt to cancel DELIVERED order via POST /orders/:id/cancel
    const postCancel = await fetch(`${BASE_URL}/orders/${order.id}/cancel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log(`[Case d] POST /orders/:id/cancel on DELIVERED status: ${postCancel.status}`);
    expect(postCancel.status).toBe(400);
  });

  // -------------------------------------------------------------
  // e. Cancel হওয়া অর্ডারের item আবার AVAILABLE হয়, আর একই variant আবার order করা যায়
  // -------------------------------------------------------------
  it("Case e: Cancelled order item returns to AVAILABLE, and the same variant can be reordered", async () => {
    const ts = Date.now();
    // Create dedicated variant with exactly 1 item in stock
    const singleVariant = await prisma.productVariant.create({
      data: {
        productId: testProduct.id,
        sku: `test-single-sku-${ts}`,
        price: 999,
        attributes: { size: "L" },
        stockQuantity: 1,
        isActive: true,
      },
    });

    const singleItem = await prisma.productItem.create({
      data: {
        variantId: singleVariant.id,
        serialNumber: `test-single-sn-${ts}`,
        status: "AVAILABLE",
      },
    });

    // 1. Customer A orders this single item
    const order1Res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${customerAToken}` },
      body: JSON.stringify({
        items: [{ variantId: singleVariant.id, quantity: 1 }],
        shippingAddress: { fullName: "Customer A", phone: "01711111111", streetAddress: "Dhaka" },
      }),
    });
    expect(order1Res.status).toBe(201);
    const order1 = ((await order1Res.json()) as any).data;

    // Verify item is now RESERVED
    const reservedItem = await prisma.productItem.findUnique({ where: { id: singleItem.id } });
    expect(reservedItem?.status).toBe("RESERVED");

    // 2. Another order for the same variant now must fail with 400 (stock 0)
    const outOfStockRes = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${customerBToken}` },
      body: JSON.stringify({
        items: [{ variantId: singleVariant.id, quantity: 1 }],
        shippingAddress: { fullName: "Customer B", phone: "01722222222", streetAddress: "Chittagong" },
      }),
    });
    console.log(`[Case e] Out of stock order status: ${outOfStockRes.status}`);
    expect(outOfStockRes.status).toBe(400);

    // 3. Customer A cancels order 1
    const cancelRes = await fetch(`${BASE_URL}/orders/${order1.id}/cancel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${customerAToken}` },
    });
    expect(cancelRes.status).toBe(200);

    // Item must be released back to AVAILABLE
    const releasedItem = await prisma.productItem.findUnique({ where: { id: singleItem.id } });
    expect(releasedItem?.status).toBe("AVAILABLE");
    console.log(`[Case e] Released item status: ${releasedItem?.status}`);

    // 4. Reordering the same variant now must succeed (201)
    const reorderRes = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${customerBToken}` },
      body: JSON.stringify({
        items: [{ variantId: singleVariant.id, quantity: 1 }],
        shippingAddress: { fullName: "Customer B", phone: "01722222222", streetAddress: "Chittagong" },
      }),
    });
    console.log(`[Case e] Reorder status after cancellation: ${reorderRes.status}`);
    expect(reorderRes.status).toBe(201);
  });

  // -------------------------------------------------------------
  // f. Seller: salePrice ছাড়া serialNumber দিয়ে offline sale -> দাম variant এর দাম,
  //    total ঠিক, item SOLD, warranty (OFFLINE, sellerId আছে)। একই serial আবার -> 409
  // -------------------------------------------------------------
  it("Case f: Offline sale without salePrice uses variant price, creates OFFLINE warranty, duplicate returns 409", async () => {
    const ts = Date.now();
    const offlineItem = await prisma.productItem.create({
      data: {
        variantId: testVariant.id,
        serialNumber: `test-offline-sn-${ts}`,
        status: "AVAILABLE",
      },
    });

    // 1. Seller creates offline sale using serialNumber only (no salePrice)
    const saleRes = await fetch(`${BASE_URL}/offline-sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sellerToken}`,
      },
      body: JSON.stringify({
        serialNumber: offlineItem.serialNumber,
        customerName: "Walk-in Customer",
        customerPhone: "01811111111",
      }),
    });

    console.log(`[Case f] Offline sale status: ${saleRes.status}`);
    expect(saleRes.status).toBe(201);
    const sale = ((await saleRes.json()) as any).data;

    // Price should default to variant price (500), total should equal 500, sellerId attached
    expect(Number(sale.salePrice)).toBe(Number(testVariant.price));
    expect(Number(sale.total)).toBe(Number(testVariant.price));
    expect(sale.sellerId).toBe(sellerProfile.id);

    // Item must be SOLD
    const dbItem = await prisma.productItem.findUnique({ where: { id: offlineItem.id } });
    expect(dbItem?.status).toBe("SOLD");

    // Warranty check
    const dbWarranty = await prisma.warranty.findUnique({ where: { productItemId: offlineItem.id } });
    expect(dbWarranty).not.toBeNull();
    expect(dbWarranty?.saleType).toBe("OFFLINE");
    expect(dbWarranty?.sellerId).toBe(sellerProfile.id);
    expect(dbWarranty?.offlineSaleId).toBe(sale.id);
    expect(dbWarranty?.status).toBe("ACTIVE");
    console.log(`[Case f] Offline Warranty created: saleType=${dbWarranty?.saleType}, sellerId=${dbWarranty?.sellerId}`);

    // 2. Selling the same serialNumber again must return 409
    const dupSaleRes = await fetch(`${BASE_URL}/offline-sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sellerToken}`,
      },
      body: JSON.stringify({
        serialNumber: offlineItem.serialNumber,
      }),
    });

    console.log(`[Case f] Duplicate offline sale status: ${dupSaleRes.status}`);
    expect(dupSaleRes.status).toBe(409);
  });

  // -------------------------------------------------------------
  // g. Seller দিয়ে POST /products/variants/:variantId/items -> 403
  // -------------------------------------------------------------
  it("Case g: Seller attempting POST /products/variants/:variantId/items returns 403", async () => {
    const res = await fetch(`${BASE_URL}/products/variants/${testVariant.id}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sellerToken}`,
      },
      body: JSON.stringify({
        items: [{ serialNumber: `test-forbidden-sn-${Date.now()}` }],
      }),
    });

    console.log(`[Case g] Seller POST items status: ${res.status}`);
    expect(res.status).toBe(403);
  });
});
