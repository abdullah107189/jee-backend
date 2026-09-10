import { prisma } from "../../../lib/prisma";
import type { Prisma, SellerStatus } from "../../../prisma/generated/prisma/client";
import { SELLER_WITH_USER_INCLUDE } from "./seller.type";

export interface FindSellersParams {
  search?: string;
  status?: SellerStatus;
  skip: number;
  take: number;
}

function buildWhere(params: Omit<FindSellersParams, "skip" | "take">): Prisma.SellerWhereInput {
  const where: Prisma.SellerWhereInput = { deletedAt: null };

  if (params.status) where.status = params.status;

  if (params.search) {
    where.OR = [
      { user: { email: { contains: params.search, mode: "insensitive" } } },
      { user: { firstName: { contains: params.search, mode: "insensitive" } } },
      { user: { lastName: { contains: params.search, mode: "insensitive" } } },
      { companyName: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export interface CreateSellerRepositoryData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName: string;
  businessLicense?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
  taxId?: string;
}

export const sellerRepository = {
  findMany(params: FindSellersParams) {
    return prisma.seller.findMany({
      where: buildWhere(params),
      include: SELLER_WITH_USER_INCLUDE,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(params: Omit<FindSellersParams, "skip" | "take">) {
    return prisma.seller.count({ where: buildWhere(params) });
  },

  findById(id: string) {
    return prisma.seller.findUnique({ where: { id }, include: SELLER_WITH_USER_INCLUDE });
  },

  findByUserId(userId: string) {
    return prisma.seller.findUnique({ where: { userId }, include: SELLER_WITH_USER_INCLUDE });
  },

  findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email }, select: { id: true } });
  },

  /** Creates the SELLER user and its Seller profile in one operation. */
  create(data: CreateSellerRepositoryData) {
    return prisma.seller.create({
      data: {
        companyName: data.companyName,
        businessLicense: data.businessLicense,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        taxId: data.taxId,
        user: {
          create: {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            role: "SELLER",
            isVerified: false,
            isActive: true,
          },
        },
      },
      include: SELLER_WITH_USER_INCLUDE,
    });
  },

  update(id: string, data: Prisma.SellerUpdateInput) {
    return prisma.seller.update({ where: { id }, data, include: SELLER_WITH_USER_INCLUDE });
  },

  /** Removes the Seller profile and soft-deletes the backing User account. */
  async remove(id: string, userId: string) {
    await prisma.seller.delete({ where: { id } });
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), isActive: false },
      select: { id: true },
    });
  },
};