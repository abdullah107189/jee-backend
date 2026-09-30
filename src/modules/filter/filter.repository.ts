import { prisma } from "../../lib/prisma";
import { FILTER_GROUP_INCLUDE } from "./filter.type";

export const filterRepository = {
  /* ─────────── Filter Group ─────────── */

  findGroupByCategoryId(categoryId: string) {
    return prisma.filterGroup.findUnique({
      where: { categoryId },
      include: FILTER_GROUP_INCLUDE,
    });
  },

  findGroupById(id: string) {
    return prisma.filterGroup.findUnique({
      where: { id },
      include: FILTER_GROUP_INCLUDE,
    });
  },

  findGroupBySlug(slug: string) {
    return prisma.filterGroup.findUnique({
      where: { slug },
      include: FILTER_GROUP_INCLUDE,
    });
  },

  findAllGroups() {
    return prisma.filterGroup.findMany({
      include: {
        category: { select: { id: true, name: true, slug: true, fullSlug: true } },
        _count: { select: { filters: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /* ─────────── Filter Options ─────────── */

  findAvailableOptions(filterId: string, categoryIds: string[]) {
    return prisma.filterOption.findMany({
      where: {
        filterId,
        productValues: {
          some: {
            product: {
              categoryId: { in: categoryIds },
              isPublished: true,
              isActive: true,
              deletedAt: null,
            },
          },
        },
      },
      select: { id: true, value: true, label: true, sortOrder: true },
      orderBy: { sortOrder: "asc" },
    });
  },

  /* ─────────── Product Filter Values ─────────── */

  deleteProductFilterValues(productId: string) {
    return prisma.productFilterValue.deleteMany({ where: { productId } });
  },

  createProductFilterValues(
    data: Array<{ productId: string; filterId: string; filterOptionId: string }>,
  ) {
    return prisma.productFilterValue.createMany({ data });
  },

  findProductFilterValues(productId: string) {
    return prisma.productFilterValue.findMany({
      where: { productId },
      select: { filterId: true, filterOptionId: true },
    });
  },
};