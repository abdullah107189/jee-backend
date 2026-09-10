import { prisma } from "../../../lib/prisma";
import type { Prisma, WarrantyStatus } from "../../../prisma/generated/prisma/client";
import { WARRANTY_INCLUDE } from "./warranty.type";

export interface FindWarrantiesParams {
  customerId?: string;
  sellerId?: string;
  status?: WarrantyStatus;
  search?: string;
  skip: number;
  take: number;
}

function buildWhere(params: Omit<FindWarrantiesParams, "skip" | "take">): Prisma.WarrantyWhereInput {
  const where: Prisma.WarrantyWhereInput = {};
  if (params.customerId) where.customerId = params.customerId;
  if (params.sellerId) where.sellerId = params.sellerId;
  if (params.status) where.status = params.status;
  if (params.search) {
    where.OR = [{ productItem: { uniqueId: { contains: params.search, mode: "insensitive" } } }];
  }
  return where;
}

export const warrantyRepository = {
  findMany(params: FindWarrantiesParams) {
    return prisma.warranty.findMany({
      where: buildWhere(params),
      include: WARRANTY_INCLUDE,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(params: Omit<FindWarrantiesParams, "skip" | "take">) {
    return prisma.warranty.count({ where: buildWhere(params) });
  },

  findById(id: string) {
    return prisma.warranty.findUnique({ where: { id }, include: WARRANTY_INCLUDE });
  },

  findByProductItemId(productItemId: string) {
    return prisma.warranty.findUnique({ where: { productItemId }, select: { id: true } });
  },

  findByOfflineSaleId(offlineSaleId: string) {
    return prisma.warranty.findUnique({ where: { offlineSaleId }, select: { id: true } });
  },

  findProductItem(productItemId: string) {
    return prisma.productItem.findUnique({
      where: { id: productItemId },
      include: { variant: { include: { product: { select: { id: true, warrantyMonths: true } } } } },
    });
  },

  findCustomerIdByUserId(userId: string) {
    return prisma.customer.findUnique({ where: { userId }, select: { id: true } });
  },

  findSellerIdByUserId(userId: string) {
    return prisma.seller.findUnique({ where: { userId }, select: { id: true } });
  },

  create(data: Prisma.WarrantyUncheckedCreateInput) {
    return prisma.warranty.create({ data, include: WARRANTY_INCLUDE });
  },

  update(id: string, data: Prisma.WarrantyUpdateInput) {
    return prisma.warranty.update({ where: { id }, data, include: WARRANTY_INCLUDE });
  },

  remove(id: string) {
    return prisma.warranty.delete({ where: { id } });
  },
};