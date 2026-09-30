import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import { FILTER_MESSAGES } from "./filter.constant";
import { filterRepository } from "./filter.repository";
import type {
  CreateFilterGroupInput,
  UpdateFilterGroupInput,
} from "./filter.type";

const generateSlug = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

/* ─────────── Filter Group CRUD ─────────── */

const createFilterGroup = async (input: CreateFilterGroupInput) => {
  // Category check
  const category = await prisma.category.findUnique({
    where: { id: input.categoryId },
    select: { id: true },
  });

  if (!category) {
    throw new AppError(FILTER_MESSAGES.CATEGORY_NOT_FOUND, 404);
  }

  // Duplicate check
  const existing = await filterRepository.findGroupByCategoryId(input.categoryId);
  if (existing) {
    throw new AppError(FILTER_MESSAGES.DUPLICATE_CATEGORY, 409);
  }

  const slug = input.slug ?? generateSlug(input.name);

  const slugExists = await filterRepository.findGroupBySlug(slug);
  if (slugExists) {
    throw new AppError(FILTER_MESSAGES.SLUG_EXISTS, 409);
  }

  // Create with nested filters + options
  return prisma.filterGroup.create({
    data: {
      name: input.name,
      slug,
      categoryId: input.categoryId,
      sortOrder: input.sortOrder ?? 0,
      filters: {
        create: input.filters.map((f, i) => ({
          name: f.name,
          label: f.label ?? f.name,
          type: f.type,
          sortOrder: f.sortOrder ?? i,
          options: {
            create: f.options.map((o, j) => ({
              value: o.value,
              label: o.label,
              sortOrder: o.sortOrder ?? j,
            })),
          },
        })),
      },
    },
    include: {
      category: { select: { id: true, name: true, slug: true, fullSlug: true } },
      filters: {
        orderBy: { sortOrder: "asc" },
        include: { options: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });
};

const updateFilterGroup = async (
  id: string,
  input: UpdateFilterGroupInput,
) => {
  const existing = await filterRepository.findGroupById(id);
  if (!existing) {
    throw new AppError(FILTER_MESSAGES.NOT_FOUND, 404);
  }

  // Transaction — delete old + recreate filters
  return prisma.$transaction(async (tx) => {
    // Update group
    await tx.filterGroup.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.slug && { slug: input.slug }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });

    // If filters provided — replace
    if (input.filters) {
      // Delete all filters (cascade deletes options + values)
      await tx.filter.deleteMany({ where: { filterGroupId: id } });

      // Recreate
      for (let i = 0; i < input.filters.length; i++) {
        const f = input.filters[i];
        await tx.filter.create({
          data: {
            name: f.name,
            label: f.label ?? f.name,
            type: f.type,
            filterGroupId: id,
            sortOrder: f.sortOrder ?? i,
            options: {
              create: f.options.map((o, j) => ({
                value: o.value,
                label: o.label,
                sortOrder: o.sortOrder ?? j,
              })),
            },
          },
        });
      }
    }

    return tx.filterGroup.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true, fullSlug: true } },
        filters: {
          orderBy: { sortOrder: "asc" },
          include: { options: { orderBy: { sortOrder: "asc" } } },
        },
      },
    });
  });
};

const deleteFilterGroup = async (id: string) => {
  const existing = await filterRepository.findGroupById(id);
  if (!existing) {
    throw new AppError(FILTER_MESSAGES.NOT_FOUND, 404);
  }

  await prisma.filterGroup.delete({ where: { id } });
  return { message: FILTER_MESSAGES.DELETED };
};

const getAllFilterGroups = async () => {
  return filterRepository.findAllGroups();
};

const getFilterGroupByCategory = async (categoryId: string) => {
  return filterRepository.findGroupByCategoryId(categoryId);
};

/* ─────────── Category Filters (Public — with available options) ─────────── */

const getCategoryFilters = async (fullSlug: string) => {
  // 1. Category + descendants
  const category = await prisma.category.findFirst({
    where: { fullSlug, deletedAt: null },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const descendants = await prisma.category.findMany({
    where: {
      OR: [
        { id: category.id },
        { fullSlug: { startsWith: `${fullSlug}/` } },
      ],
      deletedAt: null,
    },
    select: { id: true },
  });

  const categoryIds = descendants.map((d) => d.id);

  // 2. Filter group for category
  const filterGroup = await filterRepository.findGroupByCategoryId(category.id);
  if (!filterGroup) return null;

  // 3. Available options (only those in category products)
  const filtersWithAvailable = await Promise.all(
    filterGroup.filters
      .filter((f) => f.type !== "RANGE") // range handled separately
      .map(async (filter) => {
        const available = await filterRepository.findAvailableOptions(
          filter.id,
          categoryIds,
        );

        return {
          id: filter.id,
          name: filter.name,
          label: filter.label,
          type: filter.type,
          sortOrder: filter.sortOrder,
          options: available,
        };
      }),
  );

  // 4. Filter out filters with 0 options
  const activeFilters = filtersWithAvailable.filter((f) => f.options.length > 0);

  // 5. Price range
  const priceRange = await prisma.productVariant.aggregate({
    where: {
      product: {
        categoryId: { in: categoryIds },
        isPublished: true,
        isActive: true,
        deletedAt: null,
      },
      isActive: true,
      deletedAt: null,
    },
    _min: { price: true },
    _max: { price: true },
  });

  // 6. Product count
  const productCount = await prisma.product.count({
    where: {
      categoryId: { in: categoryIds },
      isPublished: true,
      isActive: true,
      deletedAt: null,
    },
  });

  return {
    filterGroup: {
      id: filterGroup.id,
      name: filterGroup.name,
      slug: filterGroup.slug,
      filters: activeFilters,
    },
    priceRange: {
      min: priceRange._min.price ? Number(priceRange._min.price) : 0,
      max: priceRange._max.price ? Number(priceRange._max.price) : 0,
    },
    productCount,
  };
};

/* ─────────── Export ─────────── */

export const filterService = {
  createFilterGroup,
  updateFilterGroup,
  deleteFilterGroup,
  getAllFilterGroups,
  getFilterGroupByCategory,
  getCategoryFilters,
};