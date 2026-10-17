import type {
  Prisma,
  UserRole,
  WarrantyStatus,
} from "../../../prisma/generated/prisma/client";
import AppError from "../../errors/AppError";
import { WARRANTY_MESSAGES } from "./warranty.constant";
import { warrantyRepository } from "./warranty.repository";
import type {
  ListWarrantiesResult,
  PublicWarrantyCheckResult,
  WarrantyQuery,
  WarrantyWithRelations,
} from "./warranty.type";

export function getEffectiveWarrantyStatus(
  status: WarrantyStatus,
  endDate: Date | string,
): WarrantyStatus {
  if (status === "ACTIVE" && new Date(endDate).getTime() < Date.now()) {
    return "EXPIRED";
  }
  return status;
}

function withEffectiveStatus<
  T extends { status: WarrantyStatus; endDate: Date | string },
>(warranty: T): T & { effectiveStatus: WarrantyStatus } {
  return {
    ...warranty,
    effectiveStatus: getEffectiveWarrantyStatus(
      warranty.status,
      warranty.endDate,
    ),
  };
}

export const warrantyService = {
  async list(
    query: WarrantyQuery,
    viewer?: { role: UserRole; userId: string },
  ): Promise<ListWarrantiesResult> {
    let customerId = query.customerId;
    let sellerId = query.sellerId;

    if (viewer?.role === "CUSTOMER") {
      const customer = await warrantyRepository.findCustomerIdByUserId(
        viewer.userId,
      );
      if (!customer) throw new AppError("Customer profile not found", 404);
      customerId = customer.id;
    } else if (viewer?.role === "SELLER") {
      const seller = await warrantyRepository.findSellerIdByUserId(
        viewer.userId,
      );
      if (!seller) throw new AppError("Seller profile not found", 404);
      sellerId = seller.id;
    }

    const params = {
      customerId,
      sellerId,
      status: query.status,
      search: query.search,
      skip: query.skip,
      take: query.take,
    };
    const [items, total] = await Promise.all([
      warrantyRepository.findMany(params),
      warrantyRepository.count(params),
    ]);
    return { items: items.map(withEffectiveStatus), total };
  },

  async getById(
    id: string,
    viewer?: { role: UserRole; userId: string },
  ): Promise<WarrantyWithRelations> {
    const warranty = await warrantyRepository.findById(id);
    if (!warranty) throw new AppError(WARRANTY_MESSAGES.NOT_FOUND, 404);

    if (viewer?.role === "CUSTOMER") {
      const customer = await warrantyRepository.findCustomerIdByUserId(
        viewer.userId,
      );
      if (!customer || warranty.customerId !== customer.id) {
        throw new AppError(
          "Forbidden: You do not have access to this warranty",
          403,
        );
      }
    } else if (viewer?.role === "SELLER") {
      const seller = await warrantyRepository.findSellerIdByUserId(
        viewer.userId,
      );
      if (!seller || warranty.sellerId !== seller.id) {
        throw new AppError(
          "Forbidden: You do not have access to this warranty",
          403,
        );
      }
    }

    return withEffectiveStatus(warranty);
  },

  async update(
    id: string,
    input: Prisma.WarrantyUpdateInput,
  ): Promise<WarrantyWithRelations> {
    await this.getById(id);
    const updated = await warrantyRepository.update(id, input);
    return withEffectiveStatus(updated);
  },

  async checkBySerialNumber(
    serialNumber: string,
  ): Promise<PublicWarrantyCheckResult> {
    const warranty = await warrantyRepository.findBySerialNumber(serialNumber);
    if (!warranty) {
      throw new AppError("Warranty not found for this serial number", 404);
    }

    return {
      productName: warranty.productItem.variant.product.name,
      variantAttributes: warranty.productItem.variant.attributes,
      status: warranty.status,
      effectiveStatus: getEffectiveWarrantyStatus(
        warranty.status,
        warranty.endDate,
      ),
      startDate: warranty.startDate,
      endDate: warranty.endDate,
    };
  },
};