import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import { ORDER_MESSAGES, VALID_ORDER_TRANSITIONS } from "./order.constant";
import { orderRepository } from "./order.repository";
import { toOrderListItem, toOrderDetail } from "./order.mapper";
import type {
  CreateOrderInput,
  OrderQuery,
} from "./order.type";
import crypto from "crypto";
import type { OrderStatus } from "../../../prisma/generated/prisma/enums";
import type { Prisma } from "../../../prisma/generated/prisma/client";

/* ─────────── Helpers ─────────── */

const roundMoney = (value: number): number => {
  return Math.round(value * 100) / 100;
};

const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase()
    .slice(0, 5);
  return `ORD-${timestamp}${random}`;
};

/* ─────────── List (Admin) ─────────── */

const getAll = async (
  query: OrderQuery,
  viewer?: { role: string; userId: string },
) => {
  let customerId = query.customerId;

  if (viewer?.role === "CUSTOMER") {
    const customer = await orderRepository.findCustomerIdByUserId(viewer.userId);
    if (!customer) throw new AppError("Customer profile not found", 404);
    customerId = customer.id;
  }

  const params = {
    customerId,
    status: query.status,
    search: query.search,
    skip: query.skip,
    take: query.take,
  };

  const [rawItems, total] = await Promise.all([
    orderRepository.findManyForList(params),
    orderRepository.count(params),
  ]);

  return {
    items: rawItems.map(toOrderListItem),
    total,
    page: query.page,
    limit: query.limit,
    totalPages: Math.ceil(total / query.limit),
  };
};

/* ─────────── My Orders (Customer) ─────────── */

const getMyOrders = async (userId: string, query: OrderQuery) => {
  const customer = await orderRepository.findCustomerIdByUserId(userId);
  if (!customer) throw new AppError("Customer profile not found", 404);

  const params = {
    customerId: customer.id,
    status: query.status,
    search: query.search,
    skip: query.skip,
    take: query.take,
  };

  const [rawItems, total] = await Promise.all([
    orderRepository.findManyForList(params),
    orderRepository.count(params),
  ]);

  return {
    items: rawItems.map(toOrderListItem),
    total,
    page: query.page,
    limit: query.limit,
    totalPages: Math.ceil(total / query.limit),
  };
};

/* ─────────── Get by ID ─────────── */

const getById = async (
  id: string,
  viewer?: { role: string; userId: string },
) => {
  const raw = await orderRepository.findByIdForDetail(id);
  if (!raw) throw new AppError(ORDER_MESSAGES.NOT_FOUND, 404);

  // Ownership check
  if (viewer?.role === "CUSTOMER") {
    const customer = await orderRepository.findCustomerIdByUserId(viewer.userId);
    if (!customer || customer.id !== raw.customerId) {
      throw new AppError("Forbidden: You do not have access to this order", 403);
    }
  }

  return toOrderDetail(raw);
};

/* ─────────── Create ─────────── */

const create = async (customerUserId: string, input: CreateOrderInput) => {
  const customer = await orderRepository.findCustomerIdByUserId(customerUserId);
  if (!customer) throw new AppError("Customer profile not found", 404);

  const variantIds = input.items.map((item) => item.variantId);
  const variants = await orderRepository.findVariantsByIds(variantIds);

  if (variants.length !== variantIds.length) {
    throw new AppError("One or more variants not found", 404);
  }

  for (const item of input.items) {
    const available = await orderRepository.countAvailableByVariant(item.variantId);
    if (available < item.quantity) {
      const variant = variants.find((v) => v.id === item.variantId);
      throw new AppError(
        `Not enough stock for "${variant?.product.name ?? item.variantId}". Available: ${available}, Requested: ${item.quantity}`,
        400,
      );
    }
  }

  const orderNumber = generateOrderNumber();

  const orderId = await prisma.$transaction(async (tx) => {
    const orderItems: Array<{
      productItemId: string;
      variantId: string;
      price: number;
      total: number;
    }> = [];

    let subtotal = 0;

    for (const item of input.items) {
      const availableItems = await tx.productItem.findMany({
        where: { variantId: item.variantId, status: "AVAILABLE", deletedAt: null },
        select: { id: true },
        take: item.quantity,
        orderBy: { createdAt: "asc" },
      });

      if (availableItems.length < item.quantity) {
        throw new AppError("Stock changed during checkout. Please retry.", 409);
      }

      const variant = variants.find((v) => v.id === item.variantId);
      const price = Number(variant!.price);

      for (const productItem of availableItems) {
        orderItems.push({
          productItemId: productItem.id,
          variantId: item.variantId,
          price,
          total: price,
        });
        subtotal += price;
      }

      const reserved = await tx.productItem.updateMany({
        where: { id: { in: availableItems.map((i) => i.id) }, status: "AVAILABLE" },
        data: { status: "RESERVED" },
      });

      if (reserved.count !== item.quantity) {
        throw new AppError("Some items were reserved by another customer. Please retry.", 409);
      }
    }

    subtotal = roundMoney(subtotal);
    const discount = roundMoney(input.discount ?? 0);
    const tax = roundMoney(input.tax ?? 0);
    const shipping = roundMoney(input.shipping ?? 0);
    const total = roundMoney(subtotal - discount + tax + shipping);

    const order = await tx.onlineOrder.create({
      data: {
        customerId: customer.id,
        orderNumber,
        subtotal,
        discount,
        tax,
        shipping,
        total,
        paymentWay: "COD",
        shippingAddress: input.shippingAddress as object,
        notes: input.notes,
        metadata: input.metadata as object,
        status: "PENDING",
        paymentStatus: "PENDING",
      },
      select: { id: true },
    });

    await tx.onlineOrderItem.createMany({
      data: orderItems.map((item) => ({
        orderId: order.id,
        productItemId: item.productItemId,
        variantId: item.variantId,
        price: item.price,
        total: item.total,
      })),
    });

    return order.id;
  });

  return getById(orderId);
};


/* ─────────── Update Status ─────────── */

const updateStatus = async (
  id: string,
  status: OrderStatus,
  reason?: string,
) => {
  const current = await orderRepository.findByIdForDetail(id);
  if (!current) throw new AppError(ORDER_MESSAGES.NOT_FOUND, 404);

  const allowedTransitions = VALID_ORDER_TRANSITIONS[current.status] ?? [];
  if (!allowedTransitions.includes(status)) {
    throw new AppError(
      `Invalid order status transition from ${current.status} to ${status}. Allowed next states: ${
        allowedTransitions.length > 0 ? allowedTransitions.join(", ") : "none (terminal state)"
      }`,
      400,
    );
  }

  const items = await orderRepository.findItemIdsByOrder(id);
  const itemIds = items.map((item) => item.productItemId);

  let updated;
  if (status === "CANCELLED") {
    updated = await orderRepository.cancelOrderWithStockRelease(id, itemIds);
  } else if (status === "DELIVERED") {
    updated = await orderRepository.deliverOrderWithStockSold(id, itemIds);
  } else if (status === "RETURNED") {
    updated = await orderRepository.returnOrderWithStockRelease(id, itemIds, reason);
  } else {
    const orderUpdate = await prisma.onlineOrder.updateMany({
      where: { id, status: current.status },
      data: { status },
    });
    if (orderUpdate.count !== 1) {
      throw new AppError(
        "Failed to update status: order status was modified concurrently",
        409,
      );
    }
    const refreshed = await orderRepository.findByIdForDetail(id);
    if (!refreshed) throw new AppError(ORDER_MESSAGES.NOT_FOUND, 404);
    updated = refreshed;
  }

  return toOrderDetail(updated);
};

/* ─────────── Cancel ─────────── */

const cancel = async (
  id: string,
  viewer?: { role: string; userId: string },
) => {
  const current = await orderRepository.findByIdForDetail(id);
  if (!current) throw new AppError(ORDER_MESSAGES.NOT_FOUND, 404);

  if (viewer?.role === "CUSTOMER") {
    const customer = await orderRepository.findCustomerIdByUserId(viewer.userId);
    if (!customer || customer.id !== current.customerId) {
      throw new AppError("Forbidden: You do not have permission to cancel this order", 403);
    }

    if (current.status !== "PENDING") {
      throw new AppError("Customers can only cancel orders in PENDING status", 400);
    }
  } else if (viewer && viewer.role !== "ADMIN") {
    throw new AppError("Forbidden", 403);
  }

  return updateStatus(id, "CANCELLED");
};

/* ─────────── Export ─────────── */

export const orderService = {
  getAll,
  getMyOrders,
  getById,
  create,
  updateStatus,
  cancel,
};