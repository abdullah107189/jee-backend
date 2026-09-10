import { prisma } from "../../../lib/prisma";
import type { Prisma } from "../../../prisma/generated/prisma/client";
import { CUSTOMER_WITH_USER_INCLUDE } from "./customer.type";

export interface FindCustomersParams {
  search?: string;
  skip: number;
  take: number;
}

function buildWhere(params: Omit<FindCustomersParams, "skip" | "take">): Prisma.CustomerWhereInput {
  const where: Prisma.CustomerWhereInput = { deletedAt: null };

  if (params.search) {
    where.OR = [
      { user: { email: { contains: params.search, mode: "insensitive" } } },
      { user: { firstName: { contains: params.search, mode: "insensitive" } } },
      { user: { lastName: { contains: params.search, mode: "insensitive" } } },
      { user: { phone: { contains: params.search, mode: "insensitive" } } },
    ];
  }

  return where;
}

export interface CreateCustomerRepositoryData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  shippingAddress?: Prisma.InputJsonValue;
  billingAddress?: Prisma.InputJsonValue;
  preferredPayment?: Prisma.InputJsonValue;
}

export const customerRepository = {
  findMany(params: FindCustomersParams) {
    return prisma.customer.findMany({
      where: buildWhere(params),
      include: CUSTOMER_WITH_USER_INCLUDE,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(params: Omit<FindCustomersParams, "skip" | "take">) {
    return prisma.customer.count({ where: buildWhere(params) });
  },

  findById(id: string) {
    return prisma.customer.findUnique({ where: { id }, include: CUSTOMER_WITH_USER_INCLUDE });
  },

  findByUserId(userId: string) {
    return prisma.customer.findUnique({ where: { userId }, include: CUSTOMER_WITH_USER_INCLUDE });
  },

  findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email }, select: { id: true } });
  },

  /** Creates the CUSTOMER user and its Customer profile in one operation. */
  create(data: CreateCustomerRepositoryData) {
    return prisma.customer.create({
      data: {
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        preferredPayment: data.preferredPayment,
        user: {
          create: {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            role: "CUSTOMER",
            isVerified: false,
            isActive: true,
          },
        },
      },
      include: CUSTOMER_WITH_USER_INCLUDE,
    });
  },

  update(id: string, data: Prisma.CustomerUpdateInput) {
    return prisma.customer.update({ where: { id }, data, include: CUSTOMER_WITH_USER_INCLUDE });
  },

  /** Removes the Customer profile and soft-deletes the backing User account. */
  async remove(id: string, userId: string) {
    await prisma.customer.delete({ where: { id } });
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), isActive: false },
      select: { id: true },
    });
  },
};