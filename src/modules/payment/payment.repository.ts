import { prisma } from "../../../lib/prisma";
import type { PaymentStatus, PaymentVerificationStatus, Prisma } from "../../../prisma/generated/prisma/client";
import { PAYMENT_INCLUDE } from "./payment.type";

export interface FindPaymentsParams {
  onlineOrderId?: string;
  offlineSaleId?: string;
  status?: PaymentStatus;
  /** Scopes to payments on orders of a given customer profile. */
  customerId?: string;
  /** Scopes to payments on offline sales of a given seller profile. */
  sellerId?: string;
  skip: number;
  take: number;
}

function buildWhere(params: Omit<FindPaymentsParams, "skip" | "take">): Prisma.PaymentWhereInput {
  const where: Prisma.PaymentWhereInput = {};
  if (params.onlineOrderId) where.onlineOrderId = params.onlineOrderId;
  if (params.offlineSaleId) where.offlineSaleId = params.offlineSaleId;
  if (params.status) where.status = params.status;
  if (params.customerId) where.order = { customerId: params.customerId };
  if (params.sellerId) where.offlineSale = { sellerId: params.sellerId };
  return where;
}

export const paymentRepository = {
  findMany(params: FindPaymentsParams) {
    return prisma.payment.findMany({
      where: buildWhere(params),
      include: PAYMENT_INCLUDE,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(params: Omit<FindPaymentsParams, "skip" | "take">) {
    return prisma.payment.count({ where: buildWhere(params) });
  },

  findById(id: string) {
    return prisma.payment.findUnique({ where: { id }, include: PAYMENT_INCLUDE });
  },

  findCustomerIdByUserId(userId: string) {
    return prisma.customer.findUnique({ where: { userId }, select: { id: true } });
  },

  findSellerIdByUserId(userId: string) {
    return prisma.seller.findUnique({ where: { userId }, select: { id: true } });
  },

  findOnlineOrder(id: string) {
    return prisma.onlineOrder.findUnique({ where: { id }, select: { id: true, customerId: true, total: true } });
  },

  findOfflineSale(id: string) {
    return prisma.offlineSale.findUnique({ where: { id }, select: { id: true, sellerId: true, total: true } });
  },

  create(data: Prisma.PaymentUncheckedCreateInput) {
    return prisma.payment.create({ data, include: PAYMENT_INCLUDE });
  },

  update(id: string, data: Prisma.PaymentUpdateInput) {
    return prisma.payment.update({ where: { id }, data, include: PAYMENT_INCLUDE });
  },
};