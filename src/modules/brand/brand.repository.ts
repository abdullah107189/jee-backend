import { prisma } from "../../../lib/prisma";
import type { Prisma } from "../../../prisma/generated/prisma/client";
import { BRAND_INCLUDE } from "./brand.type";

export interface FindBrandsParams {
  search?: string;
  isActive?: boolean;
  skip: number;
  take: number;
}

function buildWhere(params: Omit<FindBrandsParams, "skip" | "take">): Prisma.BrandWhereInput {
  const where: Prisma.BrandWhereInput = { deletedAt: null };
  if (params.isActive !== undefined) where.isActive = params.isActive;
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { slug: { contains: params.search, mode: "insensitive" } },
    ];
  }
  return where;
}

export const brandRepository = {
  findMany(params: FindBrandsParams) {
    return prisma.brand.findMany({
      where: buildWhere(params),
      include: BRAND_INCLUDE,
      skip: params.skip,
      take: params.take,
      orderBy: { name: "asc" },
    });
  },

  count(params: Omit<FindBrandsParams, "skip" | "take">) {
    return prisma.brand.count({ where: buildWhere(params) });
  },

  findById(id: string) {
    return prisma.brand.findUnique({ where: { id }, include: BRAND_INCLUDE });
  },

  findBySlug(slug: string) {
    return prisma.brand.findUnique({ where: { slug }, select: { id: true } });
  },

  create(data: Prisma.BrandUncheckedCreateInput) {
    return prisma.brand.create({ data, include: BRAND_INCLUDE });
  },

  update(id: string, data: Prisma.BrandUpdateInput) {
    return prisma.brand.update({ where: { id }, data, include: BRAND_INCLUDE });
  },

  softDelete(id: string) {
    return prisma.brand.update({ where: { id }, data: { deletedAt: new Date(), isActive: false }, select: { id: true } });
  },
};