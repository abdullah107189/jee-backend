import { prisma } from "../../../lib/prisma";
import type { Prisma, OrderStatus, ProductItemStatus } from "../../../prisma/generated/prisma/client";
import { ORDER_INCLUDE } from "./order.type";

export interface FindOrdersParams {
  customerId?: string;
  status?: OrderStatus;
  search?: string;
  skip: number;
  take: number;
}

function buildWhere(params: Omit<FindOrdersParams, "skip" | "take">): Prisma.OnlineOrderWhereInput {
  const where: Prisma.OnlineOrderWhereInput = {};
  if (params.customerId) where.customerId = params.customerId;
  if (params.status) where.status = params.status;
  if (params.search) {
    where.OR = [{ orderNumber: { contains: params.search, mode: "insensitive" } }];
  }
  return where;
}

export const orderRepository = {
  findMany(params: FindOrdersParams) {
    return prisma.onlineOrder.findMany({
      where: buildWhere(params),
      include: ORDER_INCLUDE,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(params: Omit<FindOrdersParams, "skip" | "take">) {
    return prisma.onlineOrder.count({ where: buildWhere(params) });
  },

  findById(id: string) {
    return prisma.onlineOrder.findUnique({ where: { id }, include: ORDER_INCLUDE });
  },

  /** The customer profile linked to a user (used to scope customer orders). */
  findCustomerIdByUserId(userId: string) {
    return prisma.customer.findUnique({ where: { userId }, select: { id: true } });
  },

  findAvailableItemsByIds(ids: string[]) {
    return prisma.productItem.findMany({
      where: { id: { in: ids }, status: "AVAILABLE", deletedAt: null },
      include: { variant: { include: { product: { select: { id: true, name: true, slug: true } } } } },
    });
  },

  update(id: string, data: Prisma.OnlineOrderUpdateInput) {
    return prisma.onlineOrder.update({ where: { id }, data, include: ORDER_INCLUDE });
  },

  findItemIdsByOrder(orderId: string) {
    return prisma.onlineOrderItem.findMany({ where: { orderId }, select: { productItemId: true } });
  },

  setProductItemStatus(productItemIds: string[], status: ProductItemStatus) {
    return prisma.productItem.updateMany({ where: { id: { in: productItemIds }, deletedAt: null }, data: { status } });
  },
};