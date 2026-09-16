import { Prisma } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";
import { generateSlug } from "../../utils/generateSlug";
import { generateSku } from "../../utils/generateSku";
import type { SortOption } from "../../utils/query";
import type { CreateProductInput } from "./product.validation";
import {
  PRODUCT_CARD_INCLUDE,
  PRODUCT_DETAIL_INCLUDE,
  PRODUCT_INCLUDE,
  type ProductCardData,
  type ProductDetail,
  type ProductVariantDetail,
  type ProductWithRelations,
  type RelatedProduct,
} from "./product.type";
import { productRepository } from "./product.repository";
import { generateSerialNumber } from "../../utils/generateSerialNumber";

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
  warrantyMonths?: number[];
  sort?: SortOption;
  isPublished?: boolean;
  isActive?: boolean;
  skip: number;
  take: number;
}

export interface ProductListResult {
  items: ProductCardData[];
  total: number;
}

/* -------------------------------------------------------------------------- */
/* Transformers                                                               */
/* -------------------------------------------------------------------------- */
function toCardData(raw: any): ProductCardData {
  const variant =
    raw.variants.find((v: any) => v.isDefault) ?? raw.variants[0] ?? null;

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

function toVariantDetail(raw: any): ProductVariantDetail {
  return {
    id: raw.id,
    sku: raw.sku,
    attributes: raw.attributes ?? {},
    price: Number(raw.price ?? 0),
    comparePrice: raw.comparePrice != null ? Number(raw.comparePrice) : null,
    images: raw.images ?? [],
    isDefault: raw.isDefault ?? false,
    stockQuantity: raw.stockQuantity ?? 0,
  };
}

function toProductDetail(raw: any): ProductDetail {
  const variants: ProductVariantDetail[] = (raw.variants ?? []).map(
    toVariantDetail,
  );

  const defaultVariant =
    variants.find((v) => v.isDefault) ?? variants[0] ?? null;

  // All unique images from all variants
  const images = Array.from(
    new Set(variants.flatMap((v) => v.images).filter(Boolean)),
  );

  const totalStock = variants.reduce((sum, v) => sum + v.stockQuantity, 0);

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    specifications: raw.specifications ?? null,

    warrantyMonths: raw.warrantyMonths ?? 0,
    warrantyTerms: raw.warrantyTerms ?? null,

    isPublished: raw.isPublished,
    isActive: raw.isActive,

    category: raw.category ?? null,
    brand: raw.brand ?? null,

    variants,

    price: defaultVariant?.price ?? 0,
    comparePrice: defaultVariant?.comparePrice ?? null,
    images,
    totalStock,
    inStock: totalStock > 0,

    createdAt: raw.createdAt?.toISOString?.() ?? raw.createdAt,
    updatedAt: raw.updatedAt?.toISOString?.() ?? raw.updatedAt,
  };
}

function toRelatedProduct(raw: any): RelatedProduct {
  const variant =
    raw.variants.find((v: any) => v.isDefault) ?? raw.variants[0] ?? null;

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    price: Number(variant?.price ?? 0),
    comparePrice:
      variant?.comparePrice != null ? Number(variant.comparePrice) : null,
    image: variant?.images?.[0] ?? null,
    brandName: raw.brand?.name ?? null,
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

    ...(query.isPublished !== undefined && {
      isPublished: query.isPublished,
    }),

    ...(query.isActive !== undefined && {
      isActive: query.isActive,
    }),

    ...(query.categoryId && {
      categoryId: query.categoryId,
    }),

    ...(query.warrantyMonths?.length && {
      warrantyMonths: {
        in: query.warrantyMonths,
      },
    }),

    ...buildSearchFilter(query.search),
    ...buildBrandFilter(query.brandIds, query.brandId),
    ...buildPriceFilter(query.minPrice, query.maxPrice),
  };
}

/* -------------------------------------------------------------------------- */
/* Service — create                                                           */
/* -------------------------------------------------------------------------- */

const create = async (
  product: CreateProductInput,
): Promise<ProductWithRelations> => {
  const slug = product.slug ?? generateSlug(product.name);

  try {
    return await prisma.$transaction(async (tx) => {
      // ধাপ ১ — Product তৈরি
      const createdProduct = await tx.product.create({
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
        },
      });

      // ধাপ ২ — প্রতিটা variant + তার ProductItem গুলো তৈরি
      for (const v of product.variants) {
        const sku = generateSku(product.name, v.attributes);

        const variant = await tx.productVariant.create({
          data: {
            productId: createdProduct.id,
            sku,
            attributes: v.attributes,
            price: v.price,
            comparePrice: v.comparePrice,
            images: v.images,
            stockQuantity: v.stockQuantity,
            lowStockThreshold: v.lowStockThreshold,
            isActive: v.isActive,
          },
        });

        if (v.stockQuantity > 0) {
          await tx.productItem.createMany({
            data: Array.from({ length: v.stockQuantity }, (_, i) => ({
              variantId: variant.id,
              serialNumber: generateSerialNumber(sku, i),
              status: "AVAILABLE" as const,
            })),
          });
        }
      }

      // ধাপ ৩ — সম্পূর্ণ product relations সহ ফেরত
      return tx.product.findUniqueOrThrow({
        where: { id: createdProduct.id },
        include: PRODUCT_INCLUDE,
      });
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
/* Service — get Filter                                                       */
/* -------------------------------------------------------------------------- */

const getFilters = async () => {
  const warrantyRows = await productRepository.getWarrantyMonths();

  return {
    warranties: warrantyRows
      .map((item) => item.warrantyMonths)
      .map((months) => {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        let label = "";

        if (years === 0) {
          label = `${months} ${months === 1 ? "Month" : "Months"}`;
        } else if (remainingMonths === 0) {
          label = `${years} ${years === 1 ? "Year" : "Years"}`;
        } else {
          label = `${years} ${
            years === 1 ? "Year" : "Years"
          } ${remainingMonths} ${remainingMonths === 1 ? "Month" : "Months"}`;
        }

        return {
          months,
          label,
        };
      }),
  };
};

/* -------------------------------------------------------------------------- */
/* Service — list                                                             */
/* -------------------------------------------------------------------------- */
const list = async (query: ProductListQuery): Promise<ProductListResult> => {
  const where = buildWhere(query);

  // Price sort → in-memory (Prisma orderBy relation _min nai)
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

  // Other sorts → Prisma native
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

  return {
    items: rawItems.map(toCardData),
    total,
  };
};

/* -------------------------------------------------------------------------- */
/* Service — getBySlug (DETAIL)                                               */
/* -------------------------------------------------------------------------- */
const getBySlug = async (slug: string): Promise<ProductDetail> => {
  const raw = await prisma.product.findFirst({
    where: {
      slug,
      deletedAt: null,
      isPublished: true,
      isActive: true,
    },
    include: PRODUCT_DETAIL_INCLUDE,
  });

  if (!raw) {
    throw new AppError("Product not found", 404);
  }

  return toProductDetail(raw);
};

/* -------------------------------------------------------------------------- */
/* Service — getRelated                                                       */
/* -------------------------------------------------------------------------- */
const getRelated = async (
  productId: string,
  categoryId: string | null,
  limit: number = 8,
): Promise<RelatedProduct[]> => {
  if (!categoryId) return [];

  const raw = await prisma.product.findMany({
    where: {
      deletedAt: null,
      isPublished: true,
      isActive: true,
      categoryId,
      id: { not: productId },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: PRODUCT_CARD_INCLUDE,
  });

  return raw.map(toRelatedProduct);
};

/* -------------------------------------------------------------------------- */
/* Service — getById (admin)                                                  */
/* -------------------------------------------------------------------------- */
const getById = async (id: string): Promise<ProductWithRelations> => {
  const raw = await prisma.product.findFirst({
    where: { id, deletedAt: null },
    include: PRODUCT_DETAIL_INCLUDE,
  });

  if (!raw) {
    throw new AppError("Product not found", 404);
  }

  return raw;
};

/* -------------------------------------------------------------------------- */
/* Export                                                                     */
/* -------------------------------------------------------------------------- */
export const productService = {
  create,
  list,
  getFilters,
  getBySlug,
  getById,
  getRelated,
};
