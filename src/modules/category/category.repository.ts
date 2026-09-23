import { prisma } from "../../lib/prisma";
import type { Prisma } from "../../../prisma/generated/prisma/client";
import { CATEGORY_NAV_SELECT, CATEGORY_DETAIL_INCLUDE } from "./category.type";

export interface FindCategoriesParams {
  isActive?: boolean;
  parentId?: string | null;
  level?: number;
  search?: string;
  skip?: number;
  take?: number;
}

function buildWhere(params: FindCategoriesParams): Prisma.CategoryWhereInput {
  const where: Prisma.CategoryWhereInput = {
    deletedAt: null, // always exclude soft-deleted
  };

  if (params.isActive !== undefined) where.isActive = params.isActive;
  if (params.parentId !== undefined) where.parentId = params.parentId;
  if (params.level !== undefined) where.level = params.level;

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { slug: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export const categoryRepository = {
  /* ─────────── Read ─────────── */

  findManyForNav() {
    return prisma.category.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        level: { lte: 2 }, // max 3 levels
      },
      select: CATEGORY_NAV_SELECT,
      orderBy: [{ level: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    });
  },

  findMany(params: FindCategoriesParams) {
    return prisma.category.findMany({
      where: buildWhere(params),
      include: CATEGORY_DETAIL_INCLUDE,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      skip: params.skip,
      take: params.take,
    });
  },

  count(params: FindCategoriesParams) {
    return prisma.category.count({ where: buildWhere(params) });
  },

  findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: CATEGORY_DETAIL_INCLUDE,
    });
  },

  findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: CATEGORY_DETAIL_INCLUDE,
    });
  },

  findByFullSlug(fullSlug: string) {
    return prisma.category.findFirst({
      where: { fullSlug },
      include: CATEGORY_DETAIL_INCLUDE,
    });
  },
  findByName(name: string) {
    return prisma.category.findUnique({ where: { name } });
  },

  findBySlugRaw(slug: string) {
    return prisma.category.findUnique({ where: { slug } });
  },

  /** All descendants using fullSlug prefix (fast LIKE query) */
  findDescendantsByFullSlug(fullSlug: string) {
    return prisma.category.findMany({
      where: {
        fullSlug: { startsWith: `${fullSlug}/` },
        deletedAt: null,
      },
      select: { id: true },
    });
  },

  /** Direct children */
  findChildren(parentId: string) {
    return prisma.category.findMany({
      where: { parentId, deletedAt: null },
      select: { id: true },
    });
  },

  /* ─────────── Write ─────────── */

  create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({
      data,
      include: CATEGORY_DETAIL_INCLUDE,
    });
  },

  update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({
      where: { id },
      data,
      include: CATEGORY_DETAIL_INCLUDE,
    });
  },

  softDelete(id: string) {
    return prisma.category.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  },

  reorder(items: Array<{ id: string; sortOrder: number }>) {
    return prisma.$transaction(
      items.map((item) =>
        prisma.category.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );
  },

  /* ─────────── Product Count ─────────── */

  countProducts(categoryId: string) {
    return prisma.product.count({
      where: {
        categoryId,
        isPublished: true,
        isActive: true,
        deletedAt: null,
      },
    });
  },

  updateProductCount(categoryId: string, count: number) {
    return prisma.category.update({
      where: { id: categoryId },
      data: { productCount: count },
    });
  },
};
