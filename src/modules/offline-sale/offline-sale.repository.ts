import { prisma } from "../../../lib/prisma";
import type { Prisma } from "../../../prisma/generated/prisma/client";
import { OFFLINE_SALE_INCLUDE } from "./offline-sale.type";

export interface FindOfflineSalesParams {
  sellerId?: string;
  search?: string;
  from?: Date;
  to?: Date;
  skip: number;
  take: number;
}

function buildWhere(params: Omit<FindOfflineSalesParams, "skip" | "take">): Prisma.OfflineSaleWhereInput {
  const where: Prisma.OfflineSaleWhereInput = {};
  if (params.sellerId) where.sellerId = params.sellerId;

  if (params.from || params.to) {
    where.saleDate = {
      ...(params.from ? { gte: params.from } : {}),
      ...(params.to ? { lte: params.to } : {}),
    };
  }

  if (params.search) {
    where.OR = [
      { customerName: { contains: params.search, mode: "insensitive" } },
      { customerPhone: { contains: params.search, mode: "insensitive" } },
      { invoiceNumber: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export const offlineSaleRepository = {
  findMany(params: FindOfflineSalesParams) {
    return prisma.offlineSale.findMany({
      where: buildWhere(params),
      include: OFFLINE_SALE_INCLUDE,
      skip: params.skip,
      take: params.take,
      orderBy: { saleDate: "desc" },
    });
  },

  count(params: Omit<FindOfflineSalesParams, "skip" | "take">) {
    return prisma.offlineSale.count({ where: buildWhere(params) });
  },

  findById(id: string) {
    return prisma.offlineSale.findUnique({ where: { id }, include: OFFLINE_SALE_INCLUDE });
  },

  findSellerIdByUserId(userId: string) {
    return prisma.seller.findUnique({ where: { userId }, select: { id: true } });
  },

  findProductItem(productItemId: string) {
    return prisma.productItem.findUnique({
      where: { id: productItemId },
      include: { variant: { include: { product: { select: { id: true, name: true, slug: true } } } } },
    });
  },

  setProductItemStatus(productItemId: string, status: "AVAILABLE" | "SOLD") {
    return prisma.productItem.update({ where: { id: productItemId }, data: { status }, select: { id: true } });
  },

  findByInvoiceNumber(invoiceNumber: string) {
    return prisma.offlineSale.findUnique({ where: { invoiceNumber }, select: { id: true } });
  },

  create(data: Prisma.OfflineSaleUncheckedCreateInput) {
    return prisma.offlineSale.create({ data, include: OFFLINE_SALE_INCLUDE });
  },

  update(id: string, data: Prisma.OfflineSaleUpdateInput) {
    return prisma.offlineSale.update({ where: { id }, data, include: OFFLINE_SALE_INCLUDE });
  },

  remove(id: string) {
    return prisma.offlineSale.delete({ where: { id } });
  },
};