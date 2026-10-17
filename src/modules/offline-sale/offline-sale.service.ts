import crypto from "crypto";
import type { Prisma, UserRole } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import { OFFLINE_SALE_MESSAGES } from "./offline-sale.constant";
import { offlineSaleRepository } from "./offline-sale.repository";
import {
  OFFLINE_SALE_INCLUDE,
  type CreateOfflineSaleInput,
  type ListOfflineSalesResult,
  type OfflineSaleQuery,
  type OfflineSaleWithRelations,
} from "./offline-sale.type";

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString("hex").toUpperCase().slice(0, 5);
  return `INV-${timestamp}${random}`;
}

export const offlineSaleService = {
  async list(query: OfflineSaleQuery, viewer?: { role: UserRole; userId: string }): Promise<ListOfflineSalesResult> {
    let sellerId = query.sellerId;

    if (viewer?.role === "SELLER") {
      const seller = await offlineSaleRepository.findSellerIdByUserId(viewer.userId);
      if (!seller) throw new AppError("Seller profile not found", 404);
      sellerId = seller.id;
    }

    const params = {
      sellerId,
      search: query.search,
      from: query.from,
      to: query.to,
      skip: query.skip,
      take: query.take,
    };
    const [items, total] = await Promise.all([
      offlineSaleRepository.findMany(params),
      offlineSaleRepository.count(params),
    ]);
    return { items, total };
  },

  async getById(id: string, viewer?: { role: UserRole; userId: string }): Promise<OfflineSaleWithRelations> {
    const sale = await offlineSaleRepository.findById(id);
    if (!sale) throw new AppError(OFFLINE_SALE_MESSAGES.NOT_FOUND, 404);

    if (viewer?.role === "SELLER") {
      const seller = await offlineSaleRepository.findSellerIdByUserId(viewer.userId);
      if (!seller || sale.sellerId !== seller.id) {
        throw new AppError("Forbidden: You do not have access to this sale", 403);
      }
    }

    return sale;
  },

  async create(
    viewer: { role: UserRole; userId: string },
    input: CreateOfflineSaleInput,
  ): Promise<OfflineSaleWithRelations> {
    // 1. Resolve sellerId from token (ignore body sellerId for SELLER)
    let sellerId: string;
    if (viewer.role === "SELLER") {
      const seller = await offlineSaleRepository.findSellerIdByUserId(viewer.userId);
      if (!seller) throw new AppError("Seller profile not found", 404);
      sellerId = seller.id;
    } else if (viewer.role === "ADMIN") {
      if (input.sellerId) {
        sellerId = input.sellerId;
      } else {
        const seller = await offlineSaleRepository.findSellerIdByUserId(viewer.userId);
        if (!seller) {
          throw new AppError("sellerId is required when creating an offline sale as admin", 400);
        }
        sellerId = seller.id;
      }
    } else {
      throw new AppError("Forbidden", 403);
    }

    // 2. Entire process in a single $transaction
    return prisma.$transaction(async (tx) => {
      // Find product item (by productItemId or serialNumber)
      let item;
      if (input.productItemId) {
        item = await tx.productItem.findUnique({
          where: { id: input.productItemId },
          include: { variant: { include: { product: true } } },
        });
      } else if (input.serialNumber) {
        const whereClause: Prisma.ProductItemWhereInput = {
          serialNumber: input.serialNumber,
          deletedAt: null,
        };
        if (input.variantId) {
          whereClause.variantId = input.variantId;
        }
        const items = await tx.productItem.findMany({
          where: whereClause,
          include: { variant: { include: { product: true } } },
          take: 2,
        });
        if (items.length > 1) {
          throw new AppError(
            "Multiple items found with this serial number. Please specify variantId or productItemId.",
            400,
          );
        }
        item = items[0] ?? null;
      }

      if (!item) {
        throw new AppError("Product item not found", 404);
      }
      if (item.status !== "AVAILABLE") {
        throw new AppError("Product item is not available for sale", 409);
      }

      // Update status AVAILABLE -> SOLD with count check
      const updated = await tx.productItem.updateMany({
        where: { id: item.id, status: "AVAILABLE", deletedAt: null },
        data: { status: "SOLD" },
      });
      if (updated.count !== 1) {
        throw new AppError("Item is no longer available for sale", 409);
      }

      // Calculate prices (default salePrice to variant.price, calculate total on server)
      const salePrice =
        input.salePrice !== undefined && input.salePrice !== null
          ? Number(input.salePrice)
          : Number(item.variant.price);
      const discount = Number(input.discount ?? 0);
      const tax = Number(input.tax ?? 0);
      const total = roundMoney(salePrice - discount + tax);

      let invoiceNumber = generateInvoiceNumber();
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const existing = await tx.offlineSale.findUnique({ where: { invoiceNumber } });
        if (existing) {
          invoiceNumber = generateInvoiceNumber();
          continue;
        }
        break;
      }

      const saleDate = input.saleDate ? new Date(input.saleDate) : new Date();

      // Create OfflineSale
      const offlineSale = await tx.offlineSale.create({
        data: {
          productItemId: item.id,
          sellerId,
          customerId: input.customerId ?? null,
          customerName: input.customerName ?? null,
          customerPhone: input.customerPhone ?? null,
          customerEmail: input.customerEmail ?? null,
          salePrice,
          discount,
          tax,
          total,
          invoiceNumber,
          paymentMethod: input.paymentMethod ?? "CASH",
          notes: input.notes ?? null,
          saleDate,
        },
      });

      // Create Warranty (saleType OFFLINE, seller, offlineSale)
      const warrantyMonths = item.variant.product.warrantyMonths ?? 12;
      const endDate = new Date(saleDate);
      endDate.setMonth(endDate.getMonth() + warrantyMonths);

      await tx.warranty.create({
        data: {
          productItemId: item.id,
          saleType: "OFFLINE",
          sellerId,
          offlineSaleId: offlineSale.id,
          customerId: input.customerId ?? null,
          startDate: saleDate,
          endDate,
          status: "ACTIVE",
          claimLimitType: "LIMITED",
          terms: item.variant.product.warrantyTerms ?? null,
        },
      });

      return tx.offlineSale.findUniqueOrThrow({
        where: { id: offlineSale.id },
        include: OFFLINE_SALE_INCLUDE,
      });
    });
  },

  async update(id: string, input: Prisma.OfflineSaleUpdateInput): Promise<OfflineSaleWithRelations> {
    await this.getById(id);
    const sale = await offlineSaleRepository.update(id, input);

    if (input.salePrice !== undefined || input.discount !== undefined || input.tax !== undefined) {
      const price = input.salePrice !== undefined ? Number(input.salePrice) : Number(sale.salePrice);
      const discount = input.discount !== undefined ? Number(input.discount) : Number(sale.discount ?? 0);
      const tax = input.tax !== undefined ? Number(input.tax) : Number(sale.tax ?? 0);
      await offlineSaleRepository.update(id, { total: roundMoney(price - discount + tax) });
    }

    return this.getById(id);
  },
};