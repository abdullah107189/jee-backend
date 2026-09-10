import { Prisma } from "../../../prisma/generated/prisma/client";
import { AppError } from "../../middleware/error.middleware";
import { slugify } from "../../utils/validation";
import { PRODUCT_MESSAGES } from "./product.constant";
import { productRepository } from "./product.repository";
import type {
  CreateItemInput,
  CreateProductInput,
  CreateVariantInput,
  ItemQuery,
  ListItemsResult,
  ListProductsResult,
  ListVariantsResult,
  ProductItemWithRelations,
  ProductQuery,
  ProductVariantWithRelations,
  ProductWithRelations,
  VariantQuery,
} from "./product.type";

function isUniqueViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
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
    const [items, total] = await Promise.all([productRepository.findMany(params), productRepository.count(params)]);
    return { items, total };
  },

  async getById(id: string): Promise<ProductWithRelations> {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError(PRODUCT_MESSAGES.NOT_FOUND, 404);
    return product;
  },

  async create(input: CreateProductInput): Promise<ProductWithRelations> {
    const slug = input.slug?.trim() ?? slugify(input.name);

    const existing = await productRepository.findBySlug(slug);
    if (existing) throw new AppError(PRODUCT_MESSAGES.SLUG_IN_USE, 409);

    if (input.categoryId) {
      const category = await productRepository.findCategory(input.categoryId);
      if (!category) throw new AppError("Category does not exist", 400);
    }
    if (input.brandId) {
      const brand = await productRepository.findBrand(input.brandId);
      if (!brand) throw new AppError("Brand does not exist", 400);
    }

    try {
      const data: Prisma.ProductUncheckedCreateInput = {
        name: input.name,
        slug,
        isPublished: input.isPublished ?? false,
        isActive: input.isActive ?? true,
        warrantyMonths: input.warrantyMonths ?? 12,
      };
      if (input.description !== undefined) data.description = input.description;
      if (input.specifications !== undefined) data.specifications = input.specifications as Prisma.InputJsonValue;
      if (input.warrantyTerms !== undefined) data.warrantyTerms = input.warrantyTerms;
      if (input.categoryId !== undefined) data.categoryId = input.categoryId;
      if (input.brandId !== undefined) data.brandId = input.brandId;

      return await productRepository.create(data);
    } catch (error) {
      if (isUniqueViolation(error)) throw new AppError(PRODUCT_MESSAGES.SLUG_IN_USE, 409);
      throw error;
    }
  },

  async update(id: string, input: Prisma.ProductUpdateInput): Promise<ProductWithRelations> {
    await this.getById(id);
    try {
      return await productRepository.update(id, input);
    } catch (error) {
      if (isUniqueViolation(error)) throw new AppError(PRODUCT_MESSAGES.SLUG_IN_USE, 409);
      throw error;
    }
  },

  async remove(id: string): Promise<void> {
    await this.getById(id);
    await productRepository.softDelete(id);
  },

  // ================= Variants =================
  async listVariants(query: VariantQuery & { productId?: string }): Promise<ListVariantsResult> {
    const params = { productId: query.productId, search: query.search, skip: query.skip, take: query.take };
    const [items, total] = await Promise.all([productRepository.findVariants(params), productRepository.countVariants(params)]);
    return { items, total };
  },

  async getVariantById(id: string): Promise<ProductVariantWithRelations> {
    const variant = await productRepository.findVariantById(id);
    if (!variant) throw new AppError(PRODUCT_MESSAGES.VARIANT_NOT_FOUND, 404);
    return variant;
  },

  async createVariant(productId: string, input: CreateVariantInput): Promise<ProductVariantWithRelations> {
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
      if (input.comparePrice !== undefined) data.comparePrice = input.comparePrice;
      if (input.images !== undefined) data.images = input.images;
      if (input.isDefault !== undefined) data.isDefault = input.isDefault;

      return await productRepository.createVariant(data);
    } catch (error) {
      if (isUniqueViolation(error)) throw new AppError(PRODUCT_MESSAGES.SKU_IN_USE, 409);
      throw error;
    }
  },

  async updateVariant(id: string, input: Prisma.ProductVariantUpdateInput): Promise<ProductVariantWithRelations> {
    await this.getVariantById(id);
    try {
      return await productRepository.updateVariant(id, input);
    } catch (error) {
      if (isUniqueViolation(error)) throw new AppError(PRODUCT_MESSAGES.SKU_IN_USE, 409);
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
    const [items, total] = await Promise.all([productRepository.findManyItems(params), productRepository.countItems(params)]);
    return { items, total };
  },

  async getItemById(id: string): Promise<ProductItemWithRelations> {
    const item = await productRepository.findItemById(id);
    if (!item) throw new AppError(PRODUCT_MESSAGES.ITEM_NOT_FOUND, 404);
    return item;
  },

  async createItem(variantId: string, input: CreateItemInput): Promise<ProductItemWithRelations> {
    await this.getVariantById(variantId);

    try {
      const data: Prisma.ProductItemUncheckedCreateInput = {
        variantId,
        uniqueId: input.uniqueId,
        status: input.status ?? "AVAILABLE",
      };
      if (input.serialNumber !== undefined) data.serialNumber = input.serialNumber;
      if (input.metadata !== undefined) data.metadata = input.metadata as Prisma.InputJsonValue;
      if (input.manufacturedAt !== undefined) data.manufacturedAt = input.manufacturedAt;

      return await productRepository.createItem(data);
    } catch (error) {
      if (isUniqueViolation(error)) throw new AppError(PRODUCT_MESSAGES.ITEM_UNIQUE_ID_IN_USE, 409);
      throw error;
    }
  },

  async updateItem(id: string, input: Prisma.ProductItemUpdateInput): Promise<ProductItemWithRelations> {
    await this.getItemById(id);
    return productRepository.updateItem(id, input);
  },

  async removeItem(id: string): Promise<void> {
    await this.getItemById(id);
    await productRepository.softDeleteItem(id);
  },
};