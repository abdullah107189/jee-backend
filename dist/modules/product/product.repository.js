import { prisma } from "../../../lib/prisma";
import { PRODUCT_ITEM_INCLUDE, PRODUCT_INCLUDE, PRODUCT_VARIANT_INCLUDE } from "./product.type";
function buildProductWhere(params) {
    const where = { deletedAt: null };
    if (params.categoryId)
        where.categoryId = params.categoryId;
    if (params.brandId)
        where.brandId = params.brandId;
    if (params.isPublished !== undefined)
        where.isPublished = params.isPublished;
    if (params.isActive !== undefined)
        where.isActive = params.isActive;
    if (params.search) {
        where.OR = [
            { name: { contains: params.search, mode: "insensitive" } },
            { slug: { contains: params.search, mode: "insensitive" } },
        ];
    }
    return where;
}
function buildItemWhere(params) {
    const where = { deletedAt: null };
    if (params.status)
        where.status = params.status;
    if (params.variantId)
        where.variantId = params.variantId;
    if (params.productId)
        where.variant = { productId: params.productId };
    if (params.isAvailable)
        where.status = "AVAILABLE";
    return where;
}
export const productRepository = {
    // ---- Products ----
    findMany(params) {
        return prisma.product.findMany({
            where: buildProductWhere(params),
            include: PRODUCT_INCLUDE,
            skip: params.skip,
            take: params.take,
            orderBy: { createdAt: "desc" },
        });
    },
    count(params) {
        return prisma.product.count({ where: buildProductWhere(params) });
    },
    findById(id) {
        return prisma.product.findUnique({ where: { id }, include: PRODUCT_INCLUDE });
    },
    findBySlug(slug) {
        return prisma.product.findUnique({ where: { slug }, select: { id: true } });
    },
    findCategory(categoryId) {
        return prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } });
    },
    findBrand(brandId) {
        return prisma.brand.findUnique({ where: { id: brandId }, select: { id: true } });
    },
    create(data) {
        return prisma.product.create({ data, include: PRODUCT_INCLUDE });
    },
    update(id, data) {
        return prisma.product.update({ where: { id }, data, include: PRODUCT_INCLUDE });
    },
    softDelete(id) {
        return prisma.product.update({ where: { id }, data: { deletedAt: new Date(), isActive: false }, select: { id: true } });
    },
    // ---- Variants ----
    findVariants(params) {
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
    countVariants(params) {
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
    findVariantById(id) {
        return prisma.productVariant.findUnique({ where: { id }, include: PRODUCT_VARIANT_INCLUDE });
    },
    findVariantBySku(sku) {
        return prisma.productVariant.findUnique({ where: { sku }, select: { id: true } });
    },
    createVariant(data) {
        return prisma.productVariant.create({ data, include: PRODUCT_VARIANT_INCLUDE });
    },
    updateVariant(id, data) {
        return prisma.productVariant.update({ where: { id }, data, include: PRODUCT_VARIANT_INCLUDE });
    },
    softDeleteVariant(id) {
        return prisma.productVariant.update({ where: { id }, data: { deletedAt: new Date(), isActive: false }, select: { id: true } });
    },
    // ---- Product items ----
    findManyItems(params) {
        return prisma.productItem.findMany({
            where: buildItemWhere(params),
            include: PRODUCT_ITEM_INCLUDE,
            skip: params.skip,
            take: params.take,
            orderBy: { createdAt: "desc" },
        });
    },
    countItems(params) {
        return prisma.productItem.count({ where: buildItemWhere(params) });
    },
    findItemById(id) {
        return prisma.productItem.findUnique({ where: { id }, include: PRODUCT_ITEM_INCLUDE });
    },
    createItem(data) {
        return prisma.productItem.create({ data, include: PRODUCT_ITEM_INCLUDE });
    },
    updateItem(id, data) {
        return prisma.productItem.update({ where: { id }, data, include: PRODUCT_ITEM_INCLUDE });
    },
    softDeleteItem(id) {
        return prisma.productItem.update({ where: { id }, data: { deletedAt: new Date() }, select: { id: true } });
    },
};
//# sourceMappingURL=product.repository.js.map