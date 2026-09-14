import { prisma } from "../../lib/prisma";
import type { Prisma, UserRole } from "../../../prisma/generated/prisma/client";
import { PUBLIC_USER_SELECT } from "./user.type";

export interface FindUsersParams {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  skip: number;
  take: number;
  excludeDeleted?: boolean;
}

function buildUserWhere(params: Omit<FindUsersParams, "skip" | "take">): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = params.excludeDeleted ? { deletedAt: null } : {};

  if (params.search) {
    where.OR = [
      { email: { contains: params.search, mode: "insensitive" } },
      { firstName: { contains: params.search, mode: "insensitive" } },
      { lastName: { contains: params.search, mode: "insensitive" } },
      { phone: { contains: params.search, mode: "insensitive" } },
    ];
  }
  if (params.role) where.role = params.role;
  if (params.isActive !== undefined) where.isActive = params.isActive;

  return where;
}

export const userRepository = {
  findMany(params: FindUsersParams) {
    return prisma.user.findMany({
      where: buildUserWhere(params),
      select: PUBLIC_USER_SELECT,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(params: Omit<FindUsersParams, "skip" | "take">) {
    return prisma.user.count({ where: buildUserWhere(params) });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: PUBLIC_USER_SELECT });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email }, select: { id: true } });
  },

  findByIdWithAllFields(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: Prisma.UserUncheckedCreateInput) {
    return prisma.user.create({ data, select: PUBLIC_USER_SELECT });
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data, select: PUBLIC_USER_SELECT });
  },

  softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
      select: { id: true, deletedAt: true },
    });
  },
};