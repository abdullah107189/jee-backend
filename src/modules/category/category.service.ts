import { Prisma } from "../../../prisma/generated/prisma/client";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { getCategoryWithDescendants } from "../../utils/category.util";
import { PRODUCT_INCLUDE } from "../product/product.type";
import { CATEGORY, CATEGORY_MESSAGES } from "./category.constant";
import { categoryRepository } from "./category.repository";
import type {
  CategoryNavItem,
  CategoryDetail,
  CreateCategoryInput,
  UpdateCategoryInput,
  ReorderCategoriesInput,
  CategoryQuery,
  ProductQuery,
} from "./category.type";
import { ProductListQuery } from "./category.validation";

/* ─────────── Helpers ─────────── */

const generateSlug = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

/** Build tree from flat list */
const buildTree = (
  flat: Array<{
    id: string;
    parentId: string | null;
    name: string;
    slug: string;
    fullSlug: string;
    icon: string | null;
    image: string | null;
    level: number;
    sortOrder: number;
    productCount: number;
  }>,
): CategoryNavItem[] => {
  const map = new Map<string, CategoryNavItem>();
  const roots: CategoryNavItem[] = [];

  // First pass: create nodes
  for (const item of flat) {
    map.set(item.id, {
      id: item.id,
      name: item.name,
      slug: item.slug,
      fullSlug: item.fullSlug,
      icon: item.icon,
      image: item.image,
      level: item.level,
      sortOrder: item.sortOrder,
      productCount: item.productCount,
      children: [],
    });
  }

  // Second pass: link
  for (const item of flat) {
    const node = map.get(item.id)!;
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
};

/** Compute fullSlug from parent */
const computeFullSlug = async (
  slug: string,
  parentId?: string | null,
): Promise<{ fullSlug: string; level: number }> => {
  if (!parentId) {
    return { fullSlug: slug, level: 0 };
  }

  const parent = await categoryRepository.findById(parentId);
  if (!parent) {
    throw new AppError(CATEGORY_MESSAGES.PARENT_NOT_FOUND, 404);
  }

  const level = parent.level + 1;
  if (level > CATEGORY.MAX_LEVEL) {
    throw new AppError(CATEGORY_MESSAGES.MAX_DEPTH, 400);
  }

  return {
    fullSlug: `${parent.fullSlug}/${slug}`,
    level,
  };
};

/** Check circular parent — new parent cannot be a descendant */
const checkCircularParent = async (
  categoryId: string,
  newParentId: string,
): Promise<void> => {
  if (categoryId === newParentId) {
    throw new AppError(CATEGORY_MESSAGES.CIRCULAR_PARENT, 400);
  }

  const category = await categoryRepository.findById(categoryId);
  if (!category) return;

  const descendants = await categoryRepository.findDescendantsByFullSlug(
    category.fullSlug,
  );

  if (descendants.some((d) => d.id === newParentId)) {
    throw new AppError(CATEGORY_MESSAGES.CIRCULAR_PARENT, 400);
  }
};

/* ─────────── Read ─────────── */

const getNav = async (): Promise<CategoryNavItem[]> => {
  const flat = await categoryRepository.findManyForNav();
  return buildTree(flat);
};

const getAll = async (query: CategoryQuery) => {
  const params = {
    isActive: query.isActive,
    parentId: query.parentId,
    level: query.level,
    search: query.search,
  };

  const categories = await categoryRepository.findMany(params);
  return categories;
};

const getAllFlat = async () => {
  const categories = await categoryRepository.findMany({});

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    fullSlug: cat.fullSlug,
    description: cat.description,
    parentId: cat.parentId,
    level: cat.level,
    icon: cat.icon,
    image: cat.image,
    sortOrder: cat.sortOrder,
    productCount: cat.productCount,
    isActive: cat.isActive,
    createdAt: cat.createdAt.toISOString(),
    updatedAt: cat.updatedAt.toISOString(),
  }));
};

const getBySlug = async (slug: string): Promise<CategoryDetail> => {
  const category = await categoryRepository.findBySlug(slug);

  if (!category) {
    throw new AppError(CATEGORY_MESSAGES.NOT_FOUND, 404);
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    fullSlug: category.fullSlug,
    description: category.description,
    icon: category.icon,
    image: category.image,
    level: category.level,
    sortOrder: category.sortOrder,
    productCount: category.productCount,
    isActive: category.isActive,
    parent: category.parent,
    children: category.children,
    productCountRaw: category._count.products,
  };
};

const getById = async (id: string) => {
  const category = await categoryRepository.findById(id);
  if (!category) throw new AppError(CATEGORY_MESSAGES.NOT_FOUND, 404);

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    fullSlug: category.fullSlug,
    description: category.description,
    icon: category.icon,
    image: category.image,
    level: category.level,
    sortOrder: category.sortOrder,
    productCount: category.productCount,
    isActive: category.isActive,
    parentId: category.parentId,
    parent: category.parent,
    children: category.children,
  };
};

/** All descendant category IDs (for product listing) */
const getDescendantIds = async (categoryId: string): Promise<string[]> => {
  const category = await categoryRepository.findById(categoryId);
  if (!category) return [];

  const descendants = await categoryRepository.findDescendantsByFullSlug(
    category.fullSlug,
  );

  return [category.id, ...descendants.map((d) => d.id)];
};

/* ─────────── Write ─────────── */

const create = async (input: CreateCategoryInput) => {
  const slug = input.slug ?? generateSlug(input.name);

  // Check unique
  const [existingName, existingSlug] = await Promise.all([
    categoryRepository.findByName(input.name),
    categoryRepository.findBySlugRaw(slug),
  ]);

  if (existingName) throw new AppError(CATEGORY_MESSAGES.NAME_EXISTS, 409);
  if (existingSlug) throw new AppError(CATEGORY_MESSAGES.SLUG_EXISTS, 409);

  // Compute fullSlug + level
  const { fullSlug, level } = await computeFullSlug(slug, input.parentId);

  return categoryRepository.create({
    name: input.name,
    slug,
    description: input.description,
    parent: input.parentId ? { connect: { id: input.parentId } } : undefined,
    icon: input.icon,
    image: input.image,
    sortOrder: input.sortOrder ?? CATEGORY.DEFAULT_SORT_ORDER,
    isActive: input.isActive ?? true,
    fullSlug,
    level,
  });
};

const update = async (id: string, input: UpdateCategoryInput) => {
  const existing = await categoryRepository.findById(id);
  if (!existing) throw new AppError(CATEGORY_MESSAGES.NOT_FOUND, 404);

  const data: any = {};

  // Name change
  if (input.name && input.name !== existing.name) {
    const dup = await categoryRepository.findByName(input.name);
    if (dup && dup.id !== id) {
      throw new AppError(CATEGORY_MESSAGES.NAME_EXISTS, 409);
    }
    data.name = input.name;
  }

  // Slug change
  if (input.slug && input.slug !== existing.slug) {
    const dup = await categoryRepository.findBySlugRaw(input.slug);
    if (dup && dup.id !== id) {
      throw new AppError(CATEGORY_MESSAGES.SLUG_EXISTS, 409);
    }
    data.slug = input.slug;
  }

  // Parent change → recompute fullSlug + level
  const parentChanged =
    input.parentId !== undefined && input.parentId !== existing.parentId;

  if (parentChanged) {
    if (input.parentId) {
      await checkCircularParent(id, input.parentId);
    }

    const newSlug = data.slug ?? existing.slug;
    const { fullSlug, level } = await computeFullSlug(newSlug, input.parentId);

    data.fullSlug = fullSlug;
    data.level = level;
    data.parent = input.parentId
      ? { connect: { id: input.parentId } }
      : { disconnect: true };
  }

  if (input.description !== undefined) data.description = input.description;
  if (input.icon !== undefined) data.icon = input.icon;
  if (input.image !== undefined) data.image = input.image;
  if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;
  if (input.isActive !== undefined) data.isActive = input.isActive;

  return categoryRepository.update(id, data);
};

const remove = async (id: string) => {
  const category = await categoryRepository.findById(id);
  if (!category) throw new AppError(CATEGORY_MESSAGES.NOT_FOUND, 404);

  // Check children
  const children = await categoryRepository.findChildren(id);
  if (children.length > 0) {
    throw new AppError(CATEGORY_MESSAGES.HAS_CHILDREN, 400);
  }

  // Check products
  const productCount = await categoryRepository.countProducts(id);
  if (productCount > 0) {
    throw new AppError(CATEGORY_MESSAGES.HAS_PRODUCTS, 400);
  }

  return categoryRepository.softDelete(id);
};

const reorder = async (input: ReorderCategoriesInput) => {
  await categoryRepository.reorder(input.items);
  return { message: "Reordered successfully" };
};

/** Recalculate productCount for a category */
const refreshProductCount = async (categoryId: string) => {
  const count = await categoryRepository.countProducts(categoryId);
  return categoryRepository.updateProductCount(categoryId, count);
};

/* ─────────── Map Prisma → ProductCardData ─────────── */

const mapProductToCard = (product: any) => {
  const variant =
    product.variants.find((v: any) => v.isDefault) ??
    product.variants[0] ??
    null;

  if (!variant) return null;

  // ✅ Sob variant er stockQuantity sum
  const stockQuantity = (product.variants ?? []).reduce(
    (sum: number, v: any) => sum + (v.stockQuantity ?? 0),
    0,
  );

  return {
    id: product.id,
    variantId: variant.id,
    variantSku: variant.sku ?? null,
    name: product.name,
    slug: product.slug,
    price: Number(variant.price),
    comparePrice:
      variant.comparePrice != null ? Number(variant.comparePrice) : null,
    image: variant.images?.[0] ?? null,
    warrantyMonths: product.warrantyMonths,
    stockQuantity, // ← sum of all variants
    brandName: product.brand?.name ?? null,
    categoryName: product.category?.name ?? null,
  };
};

/* ─────────── Products by Category (Optimized) ─────────── */

const getProductsByCategory = async (fullSlug: string, query: ProductQuery) => {
  /* ─── 1. Find category by fullSlug ─── */
  const category = await prisma.category.findFirst({
    where: { fullSlug, deletedAt: null },
    select: {
      id: true,
      name: true,
      slug: true,
      fullSlug: true,
      description: true,
      icon: true,
      image: true,
      productCount: true,
      parentId: true,
    },
  });

  if (!category) {
    throw new AppError(CATEGORY_MESSAGES.NOT_FOUND, 404);
  }

  /* ─── 2. Get descendants (self + children + grandchildren) ─── */
  const descendants = await prisma.category.findMany({
    where: {
      OR: [{ id: category.id }, { fullSlug: { startsWith: `${fullSlug}/` } }],
      deletedAt: null,
    },
    select: { id: true },
  });

  const categoryIds = descendants.map((d) => d.id);

  /* ─── 3. Build where clause ─── */
  const where: any = {
    categoryId: { in: categoryIds },
    isPublished: true,
    isActive: true,
    deletedAt: null,
  };

  if (query.brandIds?.length) {
    where.brandId = { in: query.brandIds };
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.variants = {
      some: {
        isActive: true,
        deletedAt: null,
        price: {
          ...(query.minPrice !== undefined && { gte: query.minPrice }),
          ...(query.maxPrice !== undefined && { lte: query.maxPrice }),
        },
      },
    };
  }

  if (query.warrantyMonths) {
    where.warrantyMonths = query.warrantyMonths;
  }

  /* ─── 4. Sort (optimized) ─── */
  let orderBy: any = { createdAt: "desc" };
  if (query.sort === "price-asc") orderBy = { variants: { _count: "asc" } };
  if (query.sort === "price-desc") orderBy = { variants: { _count: "desc" } };
  if (query.sort === "popular") orderBy = { reviews: { _count: "desc" } };

  /* ─── 5. Pagination ─── */
  const skip = (query.page - 1) * query.limit;

  /* ─── 6. Parallel fetch: products + total + breadcrumb + siblings ─── */
  const [products, total, breadcrumb, siblings] = await Promise.all([
    // Products (optimized select — no reviews heavy data)
    prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        warrantyMonths: true,
        brand: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        variants: {
          where: { isActive: true, deletedAt: null },
          orderBy: { isDefault: "desc" },
          take: 1, // ← only default/first variant needed for card
          select: {
            id: true,
            sku: true,
            price: true,
            comparePrice: true,
            images: true,
            isDefault: true,
            stockQuantity: true,
          },
        },
      },
      orderBy,
      skip,
      take: query.limit,
    }),

    // Total count
    prisma.product.count({ where }),

    // Breadcrumb (1 query — parallel)
    buildBreadcrumb(fullSlug),

    // Siblings (parallel)
    prisma.category.findMany({
      where: {
        parentId: category.parentId,
        id: { not: category.id },
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        fullSlug: true,
        icon: true,
      },
      take: 6,
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  /* ─── 7. Map products → ProductCardData ─── */
  const mappedProducts = products
    .map(mapProductToCard)
    .filter((p): p is NonNullable<typeof p> => p !== null);

  /* ─── 8. Return ─── */
  return {
    category,
    breadcrumb,
    siblings,
    products: mappedProducts,
    total,
    page: query.page,
    limit: query.limit,
    totalPages: Math.ceil(total / query.limit),
  };
};

/* ─────────── Breadcrumb Builder (optimized) ─────────── */

const buildBreadcrumb = async (fullSlug: string) => {
  const slugParts = fullSlug.split("/");
  const paths: string[] = [];

  let path = "";
  for (const part of slugParts) {
    path = path ? `${path}/${part}` : part;
    paths.push(path);
  }

  // ✅ 1 query instead of N
  const cats = await prisma.category.findMany({
    where: { fullSlug: { in: paths } },
    select: { id: true, name: true, slug: true, fullSlug: true },
  });

  // Order matching paths
  const map = new Map(cats.map((c) => [c.fullSlug, c]));
  return paths.map((p) => map.get(p)).filter(Boolean);
};

//  -------------- filter service ----------------

const getFilters = async (fullSlug: string) => {
  const { categoryIds } = await getCategoryWithDescendants(fullSlug);

  const [brands, categoryFilters, priceAgg] = await Promise.all([
    prisma.brand.findMany({
      where: { products: { some: { categoryId: { in: categoryIds } } } },
      select: { id: true, name: true },
    }),
    prisma.categoryFilter.findMany({
      where: { categoryId: { in: categoryIds } },
      include: { filter: { include: { options: true } } },
      orderBy: { order: "asc" },
    }),
    prisma.productVariant.aggregate({
      where: { product: { categoryId: { in: categoryIds } } },
      _min: { price: true },
      _max: { price: true },
    }),
  ]);

  // একই filter একাধিক child category থেকে আসলে merge করে দাও (duplicate দেখাবে না)
  const merged = new Map<
    string,
    { id: string; name: string; type: string; options: Map<string, string> }
  >();
  for (const cf of categoryFilters) {
    const f = cf.filter;
    const entry = merged.get(f.id) ?? {
      id: f.id,
      name: f.name,
      type: f.type,
      options: new Map(),
    };
    f.options.forEach((o) => entry.options.set(o.id, o.value));
    merged.set(f.id, entry);
  }

  return {
    highestPrice: priceAgg._max.price,
    lowestPrice: priceAgg._min.price,
    filters: [
      {
        name: "Brand",
        slug: "brand",
        type: "MULTI_SELECT",
        options: brands.map((b) => ({ id: b.id, value: b.name })),
      },
      ...Array.from(merged.values()).map((f) => ({
        name: f.name,
        slug: f.name.toLowerCase().replace(/\s+/g, "-"), // "screen-size"
        type: f.type,
        options: Array.from(f.options.entries()).map(([id, value]) => ({
          id,
          value,
        })),
      })),
    ],
  };
};

const KNOWN_KEYS = new Set([
  "page",
  "limit",
  "minPrice",
  "maxPrice",
  "brandId",
  "sortBy",
]);

const getProducts = async (fullSlug: string, query: ProductListQuery) => {
  const { categoryIds } = await getCategoryWithDescendants(fullSlug);
  const { page, limit, minPrice, maxPrice, brandId, sortBy, filter, ...rest } =
    query;

  // Dynamic attribute filters (color, size...) আলাদা করো known keys থেকে
  const attrFilters = Object.entries(rest).filter(
    ([key]) => !KNOWN_KEYS.has(key),
  );

  const where: Prisma.ProductWhereInput = {
    categoryId: { in: categoryIds },
    isActive: true,
    isPublished: true,
    deletedAt: null,
    ...(brandId ? { brandId: { in: brandId.split(",") } } : {}),
    variants: {
      some: {
        ...(minPrice || maxPrice
          ? { price: { gte: minPrice ?? 0, lte: maxPrice ?? undefined } }
          : {}),
        AND: Object.entries(filter).map(([key, value]) => ({
          OR: value.split(",").map((v) => ({
            attributes: { path: [key], equals: v },
          })),
        })),
      },
    },
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sortBy === "newest" ? { createdAt: "desc" as const } : {};

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: PRODUCT_INCLUDE,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};
/* ─────────── Export ─────────── */

export const categoryService = {
  getNav,
  getAll,
  getAllFlat,
  getBySlug,
  getById,
  getDescendantIds,
  create,
  update,
  remove,
  reorder,
  refreshProductCount,
  getProductsByCategory,

  // filter
  getFilters,
  getProducts,
};
