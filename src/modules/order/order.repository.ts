import type {
  OrderStatus,
  Prisma,
  ProductItemStatus,
} from "../../../prisma/generated/prisma/client";

import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import { ORDER_LIST_SELECT, ORDER_DETAIL_INCLUDE } from "./order.type";

export interface FindOrdersParams {
  customerId?: string;
  status?: OrderStatus;
  search?: string;
  skip: number;
  take: number;
}

type OrderFilters = Omit<FindOrdersParams, "skip" | "take">;

/* ─────────── Where Builder ─────────── */

function buildWhere(params: OrderFilters): Prisma.OnlineOrderWhereInput {
  const where: Prisma.OnlineOrderWhereInput = {};

  if (params.customerId) where.customerId = params.customerId;
  if (params.status) where.status = params.status;

  if (params.search) {
    where.OR = [
      { orderNumber: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return where;
}

/* ─────────── Repository ─────────── */

export const orderRepository = {
  /* ─────────── LIST (lightweight) ─────────── */

  findManyForList(params: FindOrdersParams) {
    return prisma.onlineOrder.findMany({
      where: buildWhere(params),
      select: ORDER_LIST_SELECT,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(params: OrderFilters) {
    return prisma.onlineOrder.count({
      where: buildWhere(params),
    });
  },

  /* ─────────── DETAIL (full) ─────────── */

  findByIdForDetail(id: string) {
    return prisma.onlineOrder.findUnique({
      where: { id },
      include: ORDER_DETAIL_INCLUDE,
    });
  },

  /* ─────────── Update ─────────── */

  update(id: string, data: Prisma.OnlineOrderUpdateInput) {
    return prisma.onlineOrder.update({
      where: { id },
      data,
      include: ORDER_DETAIL_INCLUDE,
    });
  },

  /* ─────────── Customer ─────────── */

  findCustomerIdByUserId(userId: string) {
    return prisma.customer.findUnique({
      where: { userId },
      select: { id: true },
    });
  },

  /* ─────────── Variant ─────────── */

  findVariantsByIds(ids: string[]) {
    return prisma.productVariant.findMany({
      where: { id: { in: ids } },
      include: {
        product: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  },

  /* ─────────── Stock ─────────── */

  findAvailableItemIdsByVariant(variantId: string, limit: number) {
    return prisma.productItem.findMany({
      where: { variantId, status: "AVAILABLE", deletedAt: null },
      select: { id: true },
      take: limit,
      orderBy: { createdAt: "asc" },
    });
  },

  countAvailableByVariant(variantId: string) {
    return prisma.productItem.count({
      where: { variantId, status: "AVAILABLE", deletedAt: null },
    });
  },

  findItemIdsByOrder(orderId: string) {
    return prisma.onlineOrderItem.findMany({
      where: { orderId },
      select: { productItemId: true },
    });
  },

  setProductItemStatus(productItemIds: string[], status: ProductItemStatus) {
    return prisma.productItem.updateMany({
      where: { id: { in: productItemIds }, deletedAt: null },
      data: { status },
    });
  },

  cancelOrderWithStockRelease(orderId: string, itemIds: string[]) {
    return prisma.$transaction(async (tx) => {
      if (itemIds.length > 0) {
        await tx.productItem.updateMany({
          where: { id: { in: itemIds }, status: "RESERVED", deletedAt: null },
          data: { status: "AVAILABLE" },
        });
      }

      return tx.onlineOrder.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
        include: ORDER_DETAIL_INCLUDE,
      });
    });
  },

  deliverOrderWithStockSold(orderId: string, itemIds: string[]) {
    return prisma.$transaction(async (tx) => {
      if (itemIds.length === 0) {
        throw new AppError("Cannot deliver an order with no items", 400);
      }

      const updated = await tx.productItem.updateMany({
        where: { id: { in: itemIds }, status: "RESERVED", deletedAt: null },
        data: { status: "SOLD" },
      });

      if (updated.count !== itemIds.length) {
        throw new AppError(
          `Failed to deliver order: expected ${itemIds.length} reserved items to be marked as sold, but ${updated.count} were updated.`,
          409,
        );
      }

      // Fetch order details with product warranty months for warranty creation
      const order = await tx.onlineOrder.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: {
              productItem: {
                include: {
                  variant: {
                    include: {
                      product: {
                        select: { warrantyMonths: true, warrantyTerms: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!order) {
        throw new AppError("Order not found", 404);
      }

      const now = new Date();

      for (const orderItem of order.orderItems) {
        const warrantyMonths = orderItem.productItem.variant.product.warrantyMonths ?? 12;
        const endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + warrantyMonths);

        await tx.warranty.upsert({
          where: { productItemId: orderItem.productItemId },
          create: {
            productItemId: orderItem.productItemId,
            customerId: order.customerId,
            onlineOrderId: order.id,
            saleType: "ONLINE",
            startDate: now,
            endDate,
            status: "ACTIVE",
            claimLimitType: "LIMITED",
            terms: orderItem.productItem.variant.product.warrantyTerms ?? null,
          },
          update: {
            customerId: order.customerId,
            onlineOrderId: order.id,
            saleType: "ONLINE",
            startDate: now,
            endDate,
            status: "ACTIVE",
            terms: orderItem.productItem.variant.product.warrantyTerms ?? null,
          },
        });
      }

      return tx.onlineOrder.update({
        where: { id: orderId },
        data: { status: "DELIVERED", paymentStatus: "PAID", deliveredAt: now },
        include: ORDER_DETAIL_INCLUDE,
      });
    });
  },
};