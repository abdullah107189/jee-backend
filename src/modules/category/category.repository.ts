import { prisma } from "../../../lib/prisma";
import type { Prisma } from "../../../prisma/generated/prisma/client";
import { CATEGORY_INCLUDE } from "./category.type";

export interface FindCategoriesParams {
  search?: string;
  /** undefined = all, null = root only, string = direct children. */
  parentId?: string | null;
  isActive?: boolean;
  skip: number;
  take: number;
}

function buildWhere(params: Omit<FindCategoriesParams, "skip" | "take">): Prisma.CategoryWhereInput {
  const where: Prisma.CategoryWhereInput = { deletedAt: null };

  if (params.parentId === null) {
    where.parentId = null;
  } else if (params.parentId !== undefined) {
    where.parentId = params.parentId;
  }

  if (params.isActive !== undefined) where.isActive = params.isActive;

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { slug: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export const categoryRepository = {
  findMany(params: FindCategoriesParams) {
    return prisma.category.findMany({
      where: buildWhere(params),
      include: CATEGORY_INCLUDE,
      skip: params.skip,
      take: params.take,
      orderBy: [{ level: "asc" }, { name: "asc" }],
    });
  },

  count(params: Omit<FindCategoriesParams, "skip" | "take">) {
    return prisma.category.count({ where: buildWhere(params) });
  },

  findById(id: string) {
    return prisma.category.findUnique({ where: { id }, include: CATEGORY_INCLUDE });
  },

  findBySlug(slug: string) {
    return prisma.category.findUnique({ where: { slug }, select: { id: true, level: true } });
  },

  findParent(parentId: string) {
    return prisma.category.findUnique({ where: { id: parentId }, select: { id: true, level: true } });
  },

  create(data: Prisma.CategoryUncheckedCreateInput) {
    return prisma.category.create({ data, include: CATEGORY_INCLUDE });
  },

  update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({ where: { id }, data, include: CATEGORY_INCLUDE });
  },

  softDelete(id: string) {
    return prisma.category.update({ where: { id }, data: { deletedAt: new Date(), isActive: false }, select: { id: true } });
  },
};