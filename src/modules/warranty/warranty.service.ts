import type { Prisma, UserRole } from "../../../prisma/generated/prisma/client";
import AppError from "../../errors/AppError";
import { WARRANTY_MESSAGES } from "./warranty.constant";
import { warrantyRepository } from "./warranty.repository";
import type {
  ListWarrantiesResult,
  WarrantyQuery,
  WarrantyWithRelations,
} from "./warranty.type";

export const warrantyService = {
  async list(query: WarrantyQuery, viewer?: { role: UserRole; userId: string }): Promise<ListWarrantiesResult> {
    let customerId = query.customerId;
    let sellerId = query.sellerId;

    if (viewer?.role === "CUSTOMER") {
      const customer = await warrantyRepository.findCustomerIdByUserId(viewer.userId);
      if (!customer) throw new AppError("Customer profile not found", 404);
      customerId = customer.id;
    } else if (viewer?.role === "SELLER") {
      const seller = await warrantyRepository.findSellerIdByUserId(viewer.userId);
      if (!seller) throw new AppError("Seller profile not found", 404);
      sellerId = seller.id;
    }

    const params = { customerId, sellerId, status: query.status, search: query.search, skip: query.skip, take: query.take };
    const [items, total] = await Promise.all([warrantyRepository.findMany(params), warrantyRepository.count(params)]);
    return { items, total };
  },

  async getById(id: string, viewer?: { role: UserRole; userId: string }): Promise<WarrantyWithRelations> {
    const warranty = await warrantyRepository.findById(id);
    if (!warranty) throw new AppError(WARRANTY_MESSAGES.NOT_FOUND, 404);

    if (viewer?.role === "CUSTOMER") {
      const customer = await warrantyRepository.findCustomerIdByUserId(viewer.userId);
      if (!customer || warranty.customerId !== customer.id) {
        throw new AppError("Forbidden: You do not have access to this warranty", 403);
      }
    } else if (viewer?.role === "SELLER") {
      const seller = await warrantyRepository.findSellerIdByUserId(viewer.userId);
      if (!seller || warranty.sellerId !== seller.id) {
        throw new AppError("Forbidden: You do not have access to this warranty", 403);
      }
    }

    return warranty;
  },

  async update(id: string, input: Prisma.WarrantyUpdateInput): Promise<WarrantyWithRelations> {
    await this.getById(id);
    return warrantyRepository.update(id, input);
  },
};