import { Prisma } from "../../../prisma/generated/prisma/client";
import { AppError } from "../../middleware/error.middleware";
import { slugify } from "../../utils/validation";
import { PRODUCT_MESSAGES } from "./product.constant";
import { productRepository } from "./product.repository";
function isUniqueViolation(error) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
export const productService = {
    // ================= Products =================
    async list(query) {
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
    async getById(id) {
        const product = await productRepository.findById(id);
        if (!product)
            throw new AppError(PRODUCT_MESSAGES.NOT_FOUND, 404);
        return product;
    },
    async create(input) {
        const slug = input.slug?.trim() ?? slugify(input.name);
        const existing = await productRepository.findBySlug(slug);
        if (existing)
            throw new AppError(PRODUCT_MESSAGES.SLUG_IN_USE, 409);
        if (input.categoryId) {
            const category = await productRepository.findCategory(input.categoryId);
            if (!category)
                throw new AppError("Category does not exist", 400);
        }
        if (input.brandId) {
            const brand = await productRepository.findBrand(input.brandId);
            if (!brand)
                throw new AppError("Brand does not exist", 400);
        }
        try {
            const data = {
                name: input.name,
                slug,
                isPublished: input.isPublished ?? false,
                isActive: input.isActive ?? true,
                warrantyMonths: input.warrantyMonths ?? 12,
            };
            if (input.description !== undefined)
                data.description = input.description;
            if (input.specifications !== undefined)
                data.specifications = input.specifications;
            if (input.warrantyTerms !== undefined)
                data.warrantyTerms = input.warrantyTerms;
            if (input.categoryId !== undefined)
                data.categoryId = input.categoryId;
            if (input.brandId !== undefined)
                data.brandId = input.brandId;
            return await productRepository.create(data);
        }
        catch (error) {
            if (isUniqueViolation(error))
                throw new AppError(PRODUCT_MESSAGES.SLUG_IN_USE, 409);
            throw error;
        }
    },
    async update(id, input) {
        await this.getById(id);
        try {
            return await productRepository.update(id, input);
        }
        catch (error) {
            if (isUniqueViolation(error))
                throw new AppError(PRODUCT_MESSAGES.SLUG_IN_USE, 409);
            throw error;
        }
    },
    async remove(id) {
        await this.getById(id);
        await productRepository.softDelete(id);
    },
    // ================= Variants =================
    async listVariants(query) {
        const params = { productId: query.productId, search: query.search, skip: query.skip, take: query.take };
        const [items, total] = await Promise.all([productRepository.findVariants(params), productRepository.countVariants(params)]);
        return { items, total };
    },
    async getVariantById(id) {
        const variant = await productRepository.findVariantById(id);
        if (!variant)
            throw new AppError(PRODUCT_MESSAGES.VARIANT_NOT_FOUND, 404);
        return variant;
    },
    async createVariant(productId, input) {
        await this.getById(productId);
        const existing = await productRepository.findVariantBySku(input.sku);
        if (existing)
            throw new AppError(PRODUCT_MESSAGES.SKU_IN_USE, 409);
        try {
            const data = {
                productId,
                sku: input.sku,
                attributes: input.attributes,
                price: input.price,
                lowStockThreshold: input.lowStockThreshold ?? 5,
                isActive: input.isActive ?? true,
            };
            if (input.comparePrice !== undefined)
                data.comparePrice = input.comparePrice;
            if (input.images !== undefined)
                data.images = input.images;
            if (input.isDefault !== undefined)
                data.isDefault = input.isDefault;
            return await productRepository.createVariant(data);
        }
        catch (error) {
            if (isUniqueViolation(error))
                throw new AppError(PRODUCT_MESSAGES.SKU_IN_USE, 409);
            throw error;
        }
    },
    async updateVariant(id, input) {
        await this.getVariantById(id);
        try {
            return await productRepository.updateVariant(id, input);
        }
        catch (error) {
            if (isUniqueViolation(error))
                throw new AppError(PRODUCT_MESSAGES.SKU_IN_USE, 409);
            throw error;
        }
    },
    async removeVariant(id) {
        await this.getVariantById(id);
        await productRepository.softDeleteVariant(id);
    },
    // ================= Product items =================
    async listItems(query) {
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
    async getItemById(id) {
        const item = await productRepository.findItemById(id);
        if (!item)
            throw new AppError(PRODUCT_MESSAGES.ITEM_NOT_FOUND, 404);
        return item;
    },
    async createItem(variantId, input) {
        await this.getVariantById(variantId);
        try {
            const data = {
                variantId,
                uniqueId: input.uniqueId,
                status: input.status ?? "AVAILABLE",
            };
            if (input.serialNumber !== undefined)
                data.serialNumber = input.serialNumber;
            if (input.metadata !== undefined)
                data.metadata = input.metadata;
            if (input.manufacturedAt !== undefined)
                data.manufacturedAt = input.manufacturedAt;
            return await productRepository.createItem(data);
        }
        catch (error) {
            if (isUniqueViolation(error))
                throw new AppError(PRODUCT_MESSAGES.ITEM_UNIQUE_ID_IN_USE, 409);
            throw error;
        }
    },
    async updateItem(id, input) {
        await this.getItemById(id);
        return productRepository.updateItem(id, input);
    },
    async removeItem(id) {
        await this.getItemById(id);
        await productRepository.softDeleteItem(id);
    },
};
//# sourceMappingURL=product.service.js.map