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
  let testItem1: any;
  let testItem2: any;
  let testItem3: any;

  // Track created entity IDs for cleanup
  const createdUserIds: string[] = [];
  const createdProductIds: string[] = [];

  beforeAll(async () => {
    testPassword = process.env.TEST_USER_PASSWORD || "";
    if (!testPassword) {
      throw new Error("TEST_USER_PASSWORD environment variable is required in .env");
    }

    hashedPassword = await bcrypt.hash(testPassword, 10);
    const ts = Date.now();

    // 1. Customer A
    customerAUser = await prisma.user.create({
      data: {
        name: `test-customer-a-${ts}`,
        email: `test-customer-a-${ts}@test.com`,
        password: hashedPassword,
        role: "CUSTOMER",
        isVerified: true,
        isActive: true,
      },
    });
    createdUserIds.push(customerAUser.id);
    customerAProfile = await prisma.customer.create({
      data: { userId: customerAUser.id },
    });
    customerAToken = generateAccessToken(customerAUser.id, "CUSTOMER");

    // 2. Customer B
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
    createdUserIds.push(customerBUser.id);
    customerBProfile = await prisma.customer.create({
      data: { userId: customerBUser.id },
    });
    customerBToken = generateAccessToken(customerBUser.id, "CUSTOMER");

    // 3. Admin
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
    createdUserIds.push(adminUser.id);
    adminToken = generateAccessToken(adminUser.id, "ADMIN");

    // 4. Seller
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
    createdUserIds.push(sellerUser.id);
    sellerProfile = await prisma.seller.create({
      data: {
        userId: sellerUser.id,
        companyName: `test-seller-company-${ts}`,
        country: "Bangladesh",
        status: "APPROVED",
      },
    });
    sellerToken = generateAccessToken(sellerUser.id, "SELLER");

    // 5. Product, Variant, and Items
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
    createdProductIds.push(testProduct.id);

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

    testItem1 = await prisma.productItem.create({
      data: {
        variantId: testVariant.id,
        serialNumber: `test-sn-1-${ts}`,
        status: "AVAILABLE",
      },
    });

    testItem2 = await prisma.productItem.create({
      data: {
        variantId: testVariant.id,
        serialNumber: `test-sn-2-${ts}`,
        status: "AVAILABLE",
      },
    });

    testItem3 = await prisma.productItem.create({
      data: {
        variantId: testVariant.id,
        serialNumber: `test-sn-3-${ts}`,
        status: "AVAILABLE",
      },
    });
  });

  afterAll(async () => {
    // Clean up test data safely in reverse dependency order
    try {
      if (createdProductIds.length > 0) {
        const variants = await prisma.productVariant.findMany({
          where: { productId: { in: createdProductIds } },
          select: { id: true },
        });
        const variantIds = variants.map((v) => v.id);

        const items = await prisma.productItem.findMany({
          where: { variantId: { in: variantIds } },
          select: { id: true },
        });
        const itemIds = items.map((i) => i.id);

        if (itemIds.length > 0) {
          await prisma.warrantyClaim.deleteMany({
            where: { warranty: { productItemId: { in: itemIds } } },
          });
          await prisma.warranty.deleteMany({
            where: { productItemId: { in: itemIds } },
          });
          await prisma.onlineOrderItem.deleteMany({
            where: { productItemId: { in: itemIds } },
          });
          await prisma.offlineSale.deleteMany({
            where: { productItemId: { in: itemIds } },
          });
          await prisma.productItem.deleteMany({
            where: { id: { in: itemIds } },
          });
        }

        await prisma.productVariant.deleteMany({
          where: { productId: { in: createdProductIds } },
        });
        await prisma.product.deleteMany({
          where: { id: { in: createdProductIds } },
        });
      }

      if (createdUserIds.length > 0) {
        const customers = await prisma.customer.findMany({
          where: { userId: { in: createdUserIds } },
          select: { id: true },
        });
        const customerIds = customers.map((c) => c.id);

        if (customerIds.length > 0) {
          await prisma.onlineOrderItem.deleteMany({
            where: { order: { customerId: { in: customerIds } } },
          });
          await prisma.warranty.deleteMany({
            where: { customerId: { in: customerIds } },
          });
          await prisma.onlineOrder.deleteMany({
            where: { customerId: { in: customerIds } },
          });
          await prisma.customer.deleteMany({
            where: { id: { in: customerIds } },
          });
        }

        const sellers = await prisma.seller.findMany({
          where: { userId: { in: createdUserIds } },
          select: { id: true },
        });
        const sellerIds = sellers.map((s) => s.id);

        if (sellerIds.length > 0) {
          await prisma.warranty.deleteMany({
            where: { sellerId: { in: sellerIds } },
          });
          await prisma.offlineSale.deleteMany({
            where: { sellerId: { in: sellerIds } },
          });
          await prisma.seller.deleteMany({
            where: { id: { in: sellerIds } },
          });
        }

        await prisma.user.deleteMany({
          where: { id: { in: createdUserIds } },
        });
      }
    } catch (e) {
      console.warn("Cleanup warning:", e);
    }
  });

  // -------------------------------------------------------------
  // a. Customer A এর order কে Customer B দিয়ে GET /orders/:id করলে 403
  // -------------------------------------------------------------
  it("Case a: Customer A order accessed by Customer B returns 403", async () => {
    // Customer A creates an order
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
    const createData = (await createRes.json()) as any;
    const orderId = createData.data.id;

    // Customer B attempts to get Customer A's order
    const getRes = await fetch(`${BASE_URL}/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${customerBToken}`,
      },
    });

    expect(getRes.status).toBe(403);
  });

  // -------------------------------------------------------------
  // b. Customer নিজের PENDING order cancel -> ঠিক; CONFIRMED order cancel -> 400
  // -------------------------------------------------------------
  it("Case b: Customer cancels own PENDING order -> success; CONFIRMED order -> 400", async () => {
    // 1. Create order 1 for Customer A
    const res1 = await fetch(`${BASE_URL}/orders`, {
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
    expect(res1.status).toBe(201);
    const order1 = ((await res1.json()) as any).data;
    expect(order1.status).toBe("PENDING");

    // Customer cancels own PENDING order -> should succeed (200)
    const cancelRes1 = await fetch(`${BASE_URL}/orders/${order1.id}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${customerAToken}`,
      },
    });
    expect(cancelRes1.status).toBe(200);
    const cancelledData = ((await cancelRes1.json()) as any).data;
    expect(cancelledData.status).toBe("CANCELLED");

    // 2. Create order 2 for Customer A
    const res2 = await fetch(`${BASE_URL}/orders`, {
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
    expect(res2.status).toBe(201);
    const order2 = ((await res2.json()) as any).data;

    // Admin transitions order 2 to CONFIRMED
    const patchRes = await fetch(`${BASE_URL}/orders/${order2.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: "CONFIRMED" }),
    });
    expect(patchRes.status).toBe(200);

    // Customer attempts to cancel CONFIRMED order -> should be 400
    const cancelRes2 = await fetch(`${BASE_URL}/orders/${order2.id}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${customerAToken}`,
      },
    });
    expect(cancelRes2.status).toBe(400);
  });

  // -------------------------------------------------------------
  // c. Admin: PENDING -> DELIVERED সরাসরি -> 400; ধাপে ধাপে DELIVERED -> ঠিক।
  //    তারপর DB তে: item SOLD, Warranty আছে (endDate = আজ + product.warrantyMonths),
  //    order এর paymentStatus PAID
  // -------------------------------------------------------------
  it("Case c: PENDING -> DELIVERED directly -> 400; Stepwise DELIVERED -> 200, item SOLD, Warranty created, paymentStatus PAID", async () => {
    // Create new order for Customer A
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
          streetAddress: "Dhaka",
        },
      }),
    });
    expect(createRes.status).toBe(201);
    const order = ((await createRes.json()) as any).data;
    expect(order.status).toBe("PENDING");

    // 1. Direct PENDING -> DELIVERED must fail with 400
    const directDelivered = await fetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: "DELIVERED" }),
    });
    expect(directDelivered.status).toBe(400);

    // 2. Stepwise transitions: PENDING -> CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED
    const toConfirmed = await fetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: "CONFIRMED" }),
    });
    expect(toConfirmed.status).toBe(200);

    const toProcessing = await fetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: "PROCESSING" }),
    });
    expect(toProcessing.status).toBe(200);

    const toShipped = await fetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: "SHIPPED" }),
    });
    expect(toShipped.status).toBe(200);

    const toDelivered = await fetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: "DELIVERED" }),
    });
    expect(toDelivered.status).toBe(200);

    // 3. Verify in Database
    const dbOrder = await prisma.onlineOrder.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            productItem: true,
          },
        },
      },
    });

    expect(dbOrder?.status).toBe("DELIVERED");
    expect(dbOrder?.paymentStatus).toBe("PAID");

    const productItemId = dbOrder!.orderItems[0].productItemId;
    const dbItem = await prisma.productItem.findUnique({
      where: { id: productItemId },
    });
    expect(dbItem?.status).toBe("SOLD");

    const dbWarranty = await prisma.warranty.findUnique({
      where: { productItemId },
    });
    expect(dbWarranty).not.toBeNull();
    expect(dbWarranty?.saleType).toBe("ONLINE");
    expect(dbWarranty?.customerId).toBe(customerAProfile.id);
    expect(dbWarranty?.onlineOrderId).toBe(order.id);
    expect(dbWarranty?.status).toBe("ACTIVE");

    // Check endDate approx today + 12 months
    const now = new Date();
    const expectedEndDate = new Date(now);
    expectedEndDate.setMonth(expectedEndDate.getMonth() + testProduct.warrantyMonths);
    const diffDays = Math.abs(
      (new Date(dbWarranty!.endDate).getTime() - expectedEndDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    expect(diffDays).toBeLessThan(3);
  });

  // -------------------------------------------------------------
  // d. DELIVERED অর্ডার cancel -> 400
  // -------------------------------------------------------------
  it("Case d: Cancelling a DELIVERED order returns 400", async () => {
    // Create an order and take it to DELIVERED
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
          streetAddress: "Dhaka",
        },
      }),
    });
    const order = ((await createRes.json()) as any).data;

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

    // Attempt to cancel DELIVERED order via PATCH /orders/:id/status
    const adminCancelRes = await fetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    expect(adminCancelRes.status).toBe(400);

    // Attempt to cancel DELIVERED order via POST /orders/:id/cancel
    const postCancelRes = await fetch(`${BASE_URL}/orders/${order.id}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    expect(postCancelRes.status).toBe(400);
  });

  // -------------------------------------------------------------
  // e. Cancel হওয়া অর্ডারের item আবার AVAILABLE হয়, আর একই variant আবার order করা যায়
  // -------------------------------------------------------------
  it("Case e: Cancelled order item returns to AVAILABLE, and the same variant can be reordered", async () => {
    const ts = Date.now();
    // Create dedicated variant with exactly 1 item
    const singleVariant = await prisma.productVariant.create({
      data: {
        productId: testProduct.id,
        sku: `test-single-sku-${ts}`,
        price: 999,
        attributes: { size: "XL" },
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

    // 1. Customer places order for this variant
    const orderRes1 = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerAToken}`,
      },
      body: JSON.stringify({
        items: [{ variantId: singleVariant.id, quantity: 1 }],
        shippingAddress: {
          fullName: "Customer A",
          phone: "01711111111",
          streetAddress: "Dhaka",
        },
      }),
    });
    expect(orderRes1.status).toBe(201);
    const order1 = ((await orderRes1.json()) as any).data;

    // Verify item is RESERVED
    const reservedItem = await prisma.productItem.findUnique({ where: { id: singleItem.id } });
    expect(reservedItem?.status).toBe("RESERVED");

    // Second order for same variant now should fail with 400 (not enough stock)
    const failOrderRes = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerBToken}`,
      },
      body: JSON.stringify({
        items: [{ variantId: singleVariant.id, quantity: 1 }],
        shippingAddress: {
          fullName: "Customer B",
          phone: "01722222222",
          streetAddress: "Chittagong",
        },
      }),
    });
    expect(failOrderRes.status).toBe(400);

    // 2. Cancel order 1
    const cancelRes = await fetch(`${BASE_URL}/orders/${order1.id}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${customerAToken}`,
      },
    });
    expect(cancelRes.status).toBe(200);

    // Verify item is back to AVAILABLE
    const releasedItem = await prisma.productItem.findUnique({ where: { id: singleItem.id } });
    expect(releasedItem?.status).toBe("AVAILABLE");

    // 3. Reorder the same variant now -> must succeed
    const reorderRes = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerBToken}`,
      },
      body: JSON.stringify({
        items: [{ variantId: singleVariant.id, quantity: 1 }],
        shippingAddress: {
          fullName: "Customer B",
          phone: "01722222222",
          streetAddress: "Chittagong",
        },
      }),
    });
    expect(reorderRes.status).toBe(201);
  });

  // -------------------------------------------------------------
  // f. Seller: salePrice ছাড়া serialNumber দিয়ে offline sale -> দাম variant এর দাম,
  //    total ঠিক, item SOLD, warranty (OFFLINE, sellerId আছে)। একই serial আবার -> 409
  // -------------------------------------------------------------
  it("Case f: Seller offline sale by serialNumber without salePrice -> uses variant price, total calculated, item SOLD, OFFLINE warranty created, duplicate sale -> 409", async () => {
    const ts = Date.now();
    const offlineItem = await prisma.productItem.create({
      data: {
        variantId: testVariant.id,
        serialNumber: `test-offline-sn-${ts}`,
        status: "AVAILABLE",
      },
    });

    // 1. Seller creates offline sale with only serialNumber (no salePrice)
    const saleRes = await fetch(`${BASE_URL}/offline-sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sellerToken}`,
      },
      body: JSON.stringify({
        serialNumber: offlineItem.serialNumber,
        customerName: "Offline Buyer",
        customerPhone: "01811111111",
      }),
    });

    expect(saleRes.status).toBe(201);
    const saleData = ((await saleRes.json()) as any).data;

    // Price should default to testVariant.price (500) and total should be 500
    expect(Number(saleData.salePrice)).toBe(Number(testVariant.price));
    expect(Number(saleData.total)).toBe(Number(testVariant.price));
    expect(saleData.sellerId).toBe(sellerProfile.id);

    // DB check: item SOLD
    const dbItem = await prisma.productItem.findUnique({
      where: { id: offlineItem.id },
    });
    expect(dbItem?.status).toBe("SOLD");

    // DB check: Warranty exists
    const dbWarranty = await prisma.warranty.findUnique({
      where: { productItemId: offlineItem.id },
    });
    expect(dbWarranty).not.toBeNull();
    expect(dbWarranty?.saleType).toBe("OFFLINE");
    expect(dbWarranty?.sellerId).toBe(sellerProfile.id);
    expect(dbWarranty?.offlineSaleId).toBe(saleData.id);
    expect(dbWarranty?.status).toBe("ACTIVE");

    // 2. Selling the same serialNumber again must return 409
    const dupRes = await fetch(`${BASE_URL}/offline-sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sellerToken}`,
      },
      body: JSON.stringify({
        serialNumber: offlineItem.serialNumber,
      }),
    });
    expect(dupRes.status).toBe(409);
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
        items: [
          { serialNumber: `test-sn-forbidden-${Date.now()}` },
        ],
      }),
    });

    expect(res.status).toBe(403);
  });
});
