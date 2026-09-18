import { prisma } from "../../lib/prisma";
import type { OrderStatus, Prisma, UserRole } from "../../../prisma/generated/prisma/client";
import AppError  from "../../errors/AppError";
import { ORDER_MESSAGES } from "./order.constant";
import { orderRepository } from "./order.repository";
import type { CreateOrderInput, ListOrdersResult, OrderQuery, OrderWithRelations } from "./order.type";

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString("hex").toUpperCase().slice(0, 5);
  return `ORD-${timestamp}${random}`;
}

export const orderService = {
  async list(query: OrderQuery, viewer?: { role: UserRole; userId: string }): Promise<ListOrdersResult> {
    let customerId = query.customerId;

    if (viewer?.role === "CUSTOMER") {
      const customer = await orderRepository.findCustomerIdByUserId(viewer.userId);
      if (!customer) throw new AppError("Customer profile not found", 404);
      customerId = customer.id;
    }

    const params = { customerId, status: query.status, search: query.search, skip: query.skip, take: query.take };
    const [items, total] = await Promise.all([orderRepository.findMany(params), orderRepository.count(params)]);
    return { items, total };
  },

  async getById(id: string): Promise<OrderWithRelations> {
    const order = await orderRepository.findById(id);
    if (!order) throw new AppError(ORDER_MESSAGES.NOT_FOUND, 404);
    return order;
  },

  async create(customerUserId: string, input: CreateOrderInput): Promise<OrderWithRelations> {
    const customerProfile = await orderRepository.findCustomerIdByUserId(customerUserId);
    if (!customerProfile) throw new AppError("Customer profile not found", 404);

    const items = await orderRepository.findAvailableItemsByIds(input.productItemIds);
    if (items.length !== input.productItemIds.length) {
      throw new AppError(ORDER_MESSAGES.ITEMS_UNAVAILABLE, 400);
    }

    const orderItems = items.map((item) => ({
      productItemId: item.id,
      price: Number(item.variant.price),
      total: Number(item.variant.price),
    }));

    const subtotal = roundMoney(orderItems.reduce((sum, item) => sum + item.price, 0));
    const discount = input.discount ?? 0;
    const tax = input.tax ?? 0;
    const shipping = input.shipping ?? 0;
    const total = roundMoney(subtotal - discount + tax + shipping);

    const orderNumber = generateOrderNumber();

    const createdId = await prisma.$transaction(async (tx) => {
      const order = await tx.onlineOrder.create({
        data: {
          customerId: customerProfile.id,
          orderNumber,
          subtotal,
          discount,
          tax,
          shipping,
          total,
          shippingAddress: input.shippingAddress as Prisma.InputJsonValue,
          billingAddress: input.billingAddress as Prisma.InputJsonValue,
          metadata: input.metadata as Prisma.InputJsonValue | undefined,
          status: "PENDING",
          paymentStatus: "PENDING",
        },
        select: { id: true },
      });

      await tx.onlineOrderItem.createMany({
        data: orderItems.map((item) => ({ orderId: order.id, ...item })),
      });

      const updated = await tx.productItem.updateMany({
        where: { id: { in: items.map((item) => item.id) }, status: "AVAILABLE" },
        data: { status: "RESERVED" },
      });
      if (updated.count !== items.length) {
        throw new AppError("Some items were reserved by another customer before checkout completed", 409);
      }

      return order.id;
    });

    return this.getById(createdId);
  },

  async updateStatus(id: string, status: OrderStatus): Promise<OrderWithRelations> {
    await this.getById(id);

    const itemIds = (await orderRepository.findItemIdsByOrder(id)).map((row) => row.productItemId);

    if (status === "CANCELLED" || status === "RETURNED") {
      if (itemIds.length > 0) await orderRepository.setProductItemStatus(itemIds, "AVAILABLE");
    } else if (status === "DELIVERED") {
      if (itemIds.length > 0) await orderRepository.setProductItemStatus(itemIds, "SOLD");
    }

    const data: Prisma.OnlineOrderUpdateInput = { status };
    if (status === "DELIVERED") data.deliveredAt = new Date();

    return orderRepository.update(id, data);
  },

  async cancel(id: string): Promise<OrderWithRelations> {
    return this.updateStatus(id, "CANCELLED");
  },
};