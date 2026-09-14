import { Prisma, Product } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";
import { generateSku } from "../../utils/generateSku";
import { generateSlug } from "../../utils/generateSlug";
import { slugify } from "../../utils/validation";
import { PRODUCT_MESSAGES } from "./product.constant";
import { productRepository } from "./product.repository";
import {
  PRODUCT_INCLUDE,
  type CreateItemInput,
  type CreateVariantInput,
  type ItemQuery,
  type ListItemsResult,
  type ListProductsResult,
  type ListVariantsResult,
  type ProductItemWithRelations,
  type ProductQuery,
  type ProductVariantWithRelations,
  type ProductWithRelations,
  type VariantQuery,
} from "./product.type";
import { CreateProductInput } from "./product.validation";

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export const productService = {
  // ================= Products =================
  async list(query: ProductQuery): Promise<ListProductsResult> {
    const params = {
      search: query.search,
      categoryId: query.categoryId,
      brandId: query.brandId,
      isPublished: query.isPublished,
      isActive: query.isActive,
      skip: query.skip,
      take: query.take,
    };
    const [items, total] = await Promise.all([
      productRepository.findMany(params),
      productRepository.count(params),
    ]);
    return { items, total };
  },

  async getById(id: string): Promise<ProductWithRelations> {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError(PRODUCT_MESSAGES.NOT_FOUND, 404);
    return product;
  },

  async create(product: CreateProductInput): Promise<ProductWithRelations> {
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
        include: PRODUCT_INCLUDE,
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
  },

  async update(
    id: string,
    input: Prisma.ProductUpdateInput,
  ): Promise<ProductWithRelations> {
    await this.getById(id);
    try {
      return await productRepository.update(id, input);
    } catch (error) {
      if (isUniqueViolation(error))
        throw new AppError(PRODUCT_MESSAGES.SLUG_IN_USE, 409);
      throw error;
    }
  },

  async remove(id: string): Promise<void> {
    await this.getById(id);
    await productRepository.softDelete(id);
  },

  // ================= Variants =================
  async listVariants(
    query: VariantQuery & { productId?: string },
  ): Promise<ListVariantsResult> {
    const params = {
      productId: query.productId,
      search: query.search,
      skip: query.skip,
      take: query.take,
    };
    const [items, total] = await Promise.all([
      productRepository.findVariants(params),
      productRepository.countVariants(params),
    ]);
    return { items, total };
  },

  async getVariantById(id: string): Promise<ProductVariantWithRelations> {
    const variant = await productRepository.findVariantById(id);
    if (!variant) throw new AppError(PRODUCT_MESSAGES.VARIANT_NOT_FOUND, 404);
    return variant;
  },

  async createVariant(
    productId: string,
    input: CreateVariantInput,
  ): Promise<ProductVariantWithRelations> {
    await this.getById(productId);

    const existing = await productRepository.findVariantBySku(input.sku);
    if (existing) throw new AppError(PRODUCT_MESSAGES.SKU_IN_USE, 409);

    try {
      const data: Prisma.ProductVariantUncheckedCreateInput = {
        productId,
        sku: input.sku,
        attributes: input.attributes as Prisma.InputJsonValue,
        price: input.price,
        lowStockThreshold: input.lowStockThreshold ?? 5,
        isActive: input.isActive ?? true,
      };
      if (input.comparePrice !== undefined)
        data.comparePrice = input.comparePrice;
      if (input.images !== undefined) data.images = input.images;
      if (input.isDefault !== undefined) data.isDefault = input.isDefault;

      return await productRepository.createVariant(data);
    } catch (error) {
      if (isUniqueViolation(error))
        throw new AppError(PRODUCT_MESSAGES.SKU_IN_USE, 409);
      throw error;
    }
  },

  async updateVariant(
    id: string,
    input: Prisma.ProductVariantUpdateInput,
  ): Promise<ProductVariantWithRelations> {
    await this.getVariantById(id);
    try {
      return await productRepository.updateVariant(id, input);
    } catch (error) {
      if (isUniqueViolation(error))
        throw new AppError(PRODUCT_MESSAGES.SKU_IN_USE, 409);
      throw error;
    }
  },

  async removeVariant(id: string): Promise<void> {
    await this.getVariantById(id);
    await productRepository.softDeleteVariant(id);
  },
  // ================= Product items =================
  async listItems(query: ItemQuery): Promise<ListItemsResult> {
    const params = {
      status: query.status,
      variantId: query.variantId,
      productId: query.productId,
      isAvailable: query.isAvailable,
      skip: query.skip,
      take: query.take,
    };
    const [items, total] = await Promise.all([
      productRepository.findManyItems(params),
      productRepository.countItems(params),
    ]);
    return { items, total };
  },

  async getItemById(id: string): Promise<ProductItemWithRelations> {
    const item = await productRepository.findItemById(id);
    if (!item) throw new AppError(PRODUCT_MESSAGES.ITEM_NOT_FOUND, 404);
    return item;
  },

  async createItem(
    variantId: string,
    input: CreateItemInput,
  ): Promise<ProductItemWithRelations> {
    await this.getVariantById(variantId);

    try {
      const data: Prisma.ProductItemUncheckedCreateInput = {
        variantId,
        uniqueId: input.uniqueId,
        status: input.status ?? "AVAILABLE",
      };
      if (input.serialNumber !== undefined)
        data.serialNumber = input.serialNumber;
      if (input.metadata !== undefined)
        data.metadata = input.metadata as Prisma.InputJsonValue;
      if (input.manufacturedAt !== undefined)
        data.manufacturedAt = input.manufacturedAt;

      return await productRepository.createItem(data);
    } catch (error) {
      if (isUniqueViolation(error))
        throw new AppError(PRODUCT_MESSAGES.ITEM_UNIQUE_ID_IN_USE, 409);
      throw error;
    }
  },

  async updateItem(
    id: string,
    input: Prisma.ProductItemUpdateInput,
  ): Promise<ProductItemWithRelations> {
    await this.getItemById(id);
    return productRepository.updateItem(id, input);
  },

  async removeItem(id: string): Promise<void> {
    await this.getItemById(id);
    await productRepository.softDeleteItem(id);
  },
};
