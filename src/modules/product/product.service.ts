import { Prisma } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";
import { generateSlug } from "../../utils/generateSlug";
import { generateSku } from "../../utils/generateSku";
import type { SortOption } from "../../utils/query";
import type { CreateProductInput } from "./product.validation";
import { type ProductCardData } from "./product.type";
import { productRepository } from "./product.repository";

/* -------------------------------------------------------------------------- */
/* Include — minimal (sudhu card e ja lage)                                   */
/* -------------------------------------------------------------------------- */
const PRODUCT_CARD_INCLUDE = {
  category: { select: { name: true } },
  brand: { select: { name: true } },
  variants: {
    where: { isActive: true, deletedAt: null },
    orderBy: [{ isDefault: "desc" }, { price: "asc" }] as const,
    select: {
      price: true,
      comparePrice: true,
      images: true,
      isDefault: true,
      stockQuantity: true,
    },
  },
} satisfies Prisma.ProductInclude;

/** Prisma return type for card include */
type ProductWithCardRelations = Prisma.ProductGetPayload<{
  include: typeof PRODUCT_CARD_INCLUDE;
}>;

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
export interface ProductListQuery {
  search?: string;
  categoryId?: string;
  brandId?: string;
  brandIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  isPublished?: boolean;
  isActive?: boolean;
  skip: number;
  take: number;
}

/** List returns minimal card data (not full Product) */
export interface ProductListResult {
  items: ProductCardData[];
  total: number;
}

/* -------------------------------------------------------------------------- */
/* Transformer — Prisma row → ProductCardData                                 */
/* -------------------------------------------------------------------------- */
function toCardData(raw: ProductWithCardRelations): ProductCardData {
  // Pick default variant, else first one
  const variant =
    raw.variants.find((v) => v.isDefault) ?? raw.variants[0] ?? null;

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,

    price: Number(variant?.price ?? 0),
    comparePrice:
      variant?.comparePrice != null ? Number(variant.comparePrice) : null,

    image: variant?.images?.[0] ?? null,

    warrantyMonths: raw.warrantyMonths,
    stockQuantity: variant?.stockQuantity ?? 0,

    brandName: raw.brand?.name ?? null,
    categoryName: raw.category?.name ?? null,
  };
}

/* -------------------------------------------------------------------------- */
/* Filter Builders                                                            */
/* -------------------------------------------------------------------------- */
function buildSearchFilter(search?: string): Prisma.ProductWhereInput {
  if (!search) return {};

  return {
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      {
        variants: {
          some: { sku: { contains: search, mode: "insensitive" } },
        },
      },
    ],
  };
}

function buildBrandFilter(
  brandIds?: string[],
  brandId?: string,
): Prisma.ProductWhereInput {
  if (brandIds?.length) return { brandId: { in: brandIds } };
  if (brandId) return { brandId };
  return {};
}

function buildPriceFilter(
  minPrice?: number,
  maxPrice?: number,
): Prisma.ProductWhereInput {
  if (minPrice === undefined && maxPrice === undefined) return {};

  return {
    variants: {
      some: {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
        isActive: true,
        deletedAt: null,
      },
    },
  };
}

function buildOrderBy(
  sort?: SortOption,
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "newest":
    case "popular":
    case "price-asc":
    case "price-desc":
    default:
      return { createdAt: "desc" };
  }
}

function buildWhere(query: ProductListQuery): Prisma.ProductWhereInput {
  return {
    deletedAt: null,
    ...(query.isPublished !== undefined && { isPublished: query.isPublished }),
    ...(query.isActive !== undefined && { isActive: query.isActive }),
    ...(query.categoryId && { categoryId: query.categoryId }),
    ...buildSearchFilter(query.search),
    ...buildBrandFilter(query.brandIds, query.brandId),
    ...buildPriceFilter(query.minPrice, query.maxPrice),
  };
}

/* -------------------------------------------------------------------------- */
/* Service — create                                                           */
/* -------------------------------------------------------------------------- */
const create = async (product: CreateProductInput) => {
  const slug = product.slug ?? generateSlug(product.name);

  try {
    return await prisma.product.create({
      data: {
        name: product.name,
        slug,
        description: product.description,
        specifications: product.specifications ?? undefined,
        warrantyMonths: product.warrantyMonths,
        warrantyTerms: product.warrantyTerms,
        categoryId: product.categoryId,
        brandId: product.brandId,
        isPublished: product.isPublished,
        isActive: product.isActive,
        variants: {
          create: product.variants.map((v) => ({
            sku: generateSku(product.name, v.attributes),
            attributes: v.attributes,
            price: v.price,
            comparePrice: v.comparePrice,
            images: v.images,
            stockQuantity: v.stockQuantity,
            lowStockThreshold: v.lowStockThreshold,
            isActive: v.isActive,
          })),
        },
      },
      include: PRODUCT_CARD_INCLUDE,
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      const target = (err.meta?.target as string[])?.join(", ") ?? "field";
      throw new AppError(`Duplicate value for: ${target}`, 409);
    }
    throw err;
  }
};

/* -------------------------------------------------------------------------- */
/* Service — list                                                             */
/* -------------------------------------------------------------------------- */
const list = async (query: ProductListQuery): Promise<ProductListResult> => {
  const where = buildWhere(query);

  /* -------------------- Price sort (in-memory) -------------------- */
  if (query.sort === "price-asc" || query.sort === "price-desc") {
    const [rawItems, total] = await Promise.all([
      productRepository.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 500,
        include: PRODUCT_CARD_INCLUDE,
      }),
      productRepository.count(where),
    ]);

    const sorted = rawItems
      .map((item) => {
        const prices = item.variants.map((v) => Number(v.price));
        const minPrice = prices.length ? Math.min(...prices) : Infinity;
        return { item, minPrice };
      })
      .sort((a, b) =>
        query.sort === "price-asc"
          ? a.minPrice - b.minPrice
          : b.minPrice - a.minPrice,
      )
      .slice(query.skip, query.skip + query.take)
      .map((x) => toCardData(x.item));

    return { items: sorted, total };
  }

  /* -------------------- Other sorts (Prisma native) -------------------- */
  const orderBy = buildOrderBy(query.sort);

  const [rawItems, total] = await Promise.all([
    productRepository.findMany({
      where,
      orderBy,
      skip: query.skip,
      take: query.take,
      include: PRODUCT_CARD_INCLUDE,
    }),
    productRepository.count(where),
  ]);

  const items = rawItems.map(toCardData);

  return { items, total };
};

/* -------------------------------------------------------------------------- */
/* Export                                                                     */
/* -------------------------------------------------------------------------- */
export const productService = {
  create,
  list,
};
