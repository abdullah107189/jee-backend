import { prisma } from "../../../lib/prisma";
import type { Prisma, ProductItemStatus } from "../../../prisma/generated/prisma/client";
import { PRODUCT_ITEM_INCLUDE, PRODUCT_INCLUDE, PRODUCT_VARIANT_INCLUDE } from "./product.type";

export interface FindProductsParams {
  search?: string;
  categoryId?: string;
  brandId?: string;
  isPublished?: boolean;
  isActive?: boolean;
  skip: number;
  take: number;
}

export interface FindItemsParams {
  status?: ProductItemStatus;
  variantId?: string;
  productId?: string;
  /** When true, excludes SOLD / RESERVED items. */
  isAvailable?: boolean;
  skip: number;
  take: number;
}

function buildProductWhere(params: Omit<FindProductsParams, "skip" | "take">): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { deletedAt: null };
  if (params.categoryId) where.categoryId = params.categoryId;
  if (params.brandId) where.brandId = params.brandId;
  if (params.isPublished !== undefined) where.isPublished = params.isPublished;
  if (params.isActive !== undefined) where.isActive = params.isActive;
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { slug: { contains: params.search, mode: "insensitive" } },
    ];
  }
  return where;
}

function buildItemWhere(params: Omit<FindItemsParams, "skip" | "take">): Prisma.ProductItemWhereInput {
  const where: Prisma.ProductItemWhereInput = { deletedAt: null };
  if (params.status) where.status = params.status;
  if (params.variantId) where.variantId = params.variantId;
  if (params.productId) where.variant = { productId: params.productId };
  if (params.isAvailable) where.status = "AVAILABLE";
  return where;
}

export const productRepository = {
  // ---- Products ----
  findMany(params: FindProductsParams) {
    return prisma.product.findMany({
      where: buildProductWhere(params),
      include: PRODUCT_INCLUDE,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(params: Omit<FindProductsParams, "skip" | "take">) {
    return prisma.product.count({ where: buildProductWhere(params) });
  },

  findById(id: string) {
    return prisma.product.findUnique({ where: { id }, include: PRODUCT_INCLUDE });
  },

  findBySlug(slug: string) {
    return prisma.product.findUnique({ where: { slug }, select: { id: true } });
  },

  findCategory(categoryId: string) {
    return prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } });
  },

  findBrand(brandId: string) {
    return prisma.brand.findUnique({ where: { id: brandId }, select: { id: true } });
  },

  create(data: Prisma.ProductUncheckedCreateInput) {
    return prisma.product.create({ data, include: PRODUCT_INCLUDE });
  },

  update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({ where: { id }, data, include: PRODUCT_INCLUDE });
  },

  softDelete(id: string) {
    return prisma.product.update({ where: { id }, data: { deletedAt: new Date(), isActive: false }, select: { id: true } });
  },

  // ---- Variants ----
  findVariants(params: FindProductsParams & { productId?: string }) {
    return prisma.productVariant.findMany({
      where: {
        deletedAt: null,
        ...(params.productId ? { productId: params.productId } : {}),
        ...(params.search
          ? { OR: [{ sku: { contains: params.search, mode: "insensitive" } }, { product: { name: { contains: params.search, mode: "insensitive" } } }] }
          : {}),
      },
      include: PRODUCT_VARIANT_INCLUDE,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  },

  countVariants(params: { productId?: string; search?: string }) {
    return prisma.productVariant.count({
      where: {
        deletedAt: null,
        ...(params.productId ? { productId: params.productId } : {}),
        ...(params.search
          ? { OR: [{ sku: { contains: params.search, mode: "insensitive" } }, { product: { name: { contains: params.search, mode: "insensitive" } } }] }
          : {}),
      },
    });
  },

  findVariantById(id: string) {
    return prisma.productVariant.findUnique({ where: { id }, include: PRODUCT_VARIANT_INCLUDE });
  },

  findVariantBySku(sku: string) {
    return prisma.productVariant.findUnique({ where: { sku }, select: { id: true } });
  },

  createVariant(data: Prisma.ProductVariantUncheckedCreateInput) {
    return prisma.productVariant.create({ data, include: PRODUCT_VARIANT_INCLUDE });
  },

  updateVariant(id: string, data: Prisma.ProductVariantUpdateInput) {
    return prisma.productVariant.update({ where: { id }, data, include: PRODUCT_VARIANT_INCLUDE });
  },

  softDeleteVariant(id: string) {
    return prisma.productVariant.update({ where: { id }, data: { deletedAt: new Date(), isActive: false }, select: { id: true } });
  },

  // ---- Product items ----
  findManyItems(params: FindItemsParams) {
    return prisma.productItem.findMany({
      where: buildItemWhere(params),
      include: PRODUCT_ITEM_INCLUDE,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  },

  countItems(params: Omit<FindItemsParams, "skip" | "take">) {
    return prisma.productItem.count({ where: buildItemWhere(params) });
  },

  findItemById(id: string) {
    return prisma.productItem.findUnique({ where: { id }, include: PRODUCT_ITEM_INCLUDE });
  },

  createItem(data: Prisma.ProductItemUncheckedCreateInput) {
    return prisma.productItem.create({ data, include: PRODUCT_ITEM_INCLUDE });
  },

  updateItem(id: string, data: Prisma.ProductItemUpdateInput) {
    return prisma.productItem.update({ where: { id }, data, include: PRODUCT_ITEM_INCLUDE });
  },

  softDeleteItem(id: string) {
    return prisma.productItem.update({ where: { id }, data: { deletedAt: new Date() }, select: { id: true } });
  },
};