import { prisma } from "../../lib/prisma";
import type { Prisma } from "../../../prisma/generated/prisma/client";
import { ADMIN_WITH_USER_INCLUDE } from "./admin.type";

export interface FindAdminsParams {
  search?: string;
  skip: number;
  take: number;
}

function buildWhere(params: Omit<FindAdminsParams, "skip" | "take">): Prisma.AdminWhereInput {
  if (!params.search) return {};
  return {
    OR: [
      { user: { email: { contains: params.search, mode: "insensitive" } } },
      { user: { firstName: { contains: params.search, mode: "insensitive" } } },
      { user: { lastName: { contains: params.search, mode: "insensitive" } } },
      { user: { phone: { contains: params.search, mode: "insensitive" } } },
    ],
  };
}

export interface CreateAdminRepositoryData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  permissions?: string[];
}

export const adminRepository = {
  findMany(params: FindAdminsParams) {
    return prisma.admin.findMany({
      where: buildWhere(params),
      include: ADMIN_WITH_USER_INCLUDE,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(params: Omit<FindAdminsParams, "skip" | "take">) {
    return prisma.admin.count({ where: buildWhere(params) });
  },

  findById(id: string) {
    return prisma.admin.findUnique({ where: { id }, include: ADMIN_WITH_USER_INCLUDE });
  },

  findByUserId(userId: string) {
    return prisma.admin.findUnique({ where: { userId } });
  },

  findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email }, select: { id: true } });
  },

  /** Creates the ADMIN user and its Admin profile in one operation. */
  create(data: CreateAdminRepositoryData) {
    return prisma.admin.create({
      data: {
        permissions: data.permissions ?? [],
        user: {
          create: {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            role: "ADMIN",
            isVerified: true,
            isActive: true,
          },
        },
      },
      include: ADMIN_WITH_USER_INCLUDE,
    });
  },

  update(id: string, data: Prisma.AdminUpdateInput) {
    return prisma.admin.update({ where: { id }, data, include: ADMIN_WITH_USER_INCLUDE });
  },

  /** Removes the Admin profile and soft-deletes the backing User account. */
  async remove(id: string, userId: string) {
    await prisma.admin.delete({ where: { id } });
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), isActive: false },
      select: { id: true },
    });
  },
};