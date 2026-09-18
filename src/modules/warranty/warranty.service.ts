import type { Prisma, UserRole } from "../../../prisma/generated/prisma/client";
import AppError  from "../../errors/AppError";
import { WARRANTY_MESSAGES } from "./warranty.constant";
import { warrantyRepository } from "./warranty.repository";
import type {
  CreateWarrantyInput,
  ListWarrantiesResult,
  WarrantyQuery,
  WarrantyWithRelations,
} from "./warranty.type";

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export const warrantyService = {
  async list(query: WarrantyQuery, viewer?: { role: UserRole; userId: string }): Promise<ListWarrantiesResult> {
    let customerId = query.customerId;
    let sellerId = query.sellerId;

    if (viewer?.role === "CUSTOMER") {
      const customer = await warrantyRepository.findCustomerIdByUserId(viewer.userId);
      if (customer) customerId = customer.id;
    } else if (viewer?.role === "SELLER") {
      const seller = await warrantyRepository.findSellerIdByUserId(viewer.userId);
      if (seller) sellerId = seller.id;
    }

    const params = { customerId, sellerId, status: query.status, search: query.search, skip: query.skip, take: query.take };
    const [items, total] = await Promise.all([warrantyRepository.findMany(params), warrantyRepository.count(params)]);
    return { items, total };
  },

  async getById(id: string): Promise<WarrantyWithRelations> {
    const warranty = await warrantyRepository.findById(id);
    if (!warranty) throw new AppError(WARRANTY_MESSAGES.NOT_FOUND, 404);
    return warranty;
  },

  async create(input: CreateWarrantyInput): Promise<WarrantyWithRelations> {
    const item = await warrantyRepository.findProductItem(input.productItemId);
    if (!item) throw new AppError(WARRANTY_MESSAGES.ITEM_NOT_FOUND, 404);

    if (await warrantyRepository.findByProductItemId(input.productItemId)) {
      throw new AppError(WARRANTY_MESSAGES.ALREADY_EXISTS, 409);
    }
    if (input.offlineSaleId && (await warrantyRepository.findByOfflineSaleId(input.offlineSaleId))) {
      throw new AppError(WARRANTY_MESSAGES.OFFLINE_SALE_IN_USE, 409);
    }

    const startDate = input.startDate ? new Date(input.startDate) : new Date();
    const warrantyMonths = item.variant.product.warrantyMonths ?? 12;
    const endDate = input.endDate ?? addMonths(startDate, warrantyMonths);

    const data: Prisma.WarrantyUncheckedCreateInput = {
      productItemId: input.productItemId,
      saleType: input.saleType,
      startDate,
      endDate,
      status: input.status ?? "ACTIVE",
      claimLimitType: input.claimLimitType ?? "LIMITED",
    };
    if (input.customerId !== undefined) data.customerId = input.customerId;
    if (input.sellerId !== undefined) data.sellerId = input.sellerId;
    if (input.onlineOrderId !== undefined) data.onlineOrderId = input.onlineOrderId;
    if (input.offlineSaleId !== undefined) data.offlineSaleId = input.offlineSaleId;
    if (input.terms !== undefined) data.terms = input.terms;

    return warrantyRepository.create(data);
  },

  async update(id: string, input: Prisma.WarrantyUpdateInput): Promise<WarrantyWithRelations> {
    await this.getById(id);
    return warrantyRepository.update(id, input);
  },

  async remove(id: string): Promise<void> {
    await this.getById(id);
    try {
      await warrantyRepository.remove(id);
    } catch {
      throw new AppError(WARRANTY_MESSAGES.CANNOT_DELETE_WITH_CLAIMS, 409);
    }
  },
};