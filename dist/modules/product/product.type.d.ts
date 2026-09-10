import type { Prisma, ProductItemStatus } from "../../../prisma/generated/prisma/client";
export declare const PRODUCT_INCLUDE: {
    category: true;
    brand: true;
    _count: {
        select: {
            variants: true;
            reviews: true;
        };
    };
};
export type ProductWithRelations = Prisma.ProductGetPayload<{
    include: typeof PRODUCT_INCLUDE;
}>;
export declare const PRODUCT_VARIANT_INCLUDE: {
    product: {
        select: {
            id: true;
            name: true;
            slug: true;
        };
    };
    _count: {
        select: {
            productItems: true;
        };
    };
};
export type ProductVariantWithRelations = Prisma.ProductVariantGetPayload<{
    include: typeof PRODUCT_VARIANT_INCLUDE;
}>;
export declare const PRODUCT_ITEM_INCLUDE: {
    variant: {
        include: {
            product: {
                select: {
                    id: true;
                    name: true;
                    slug: true;
                };
            };
        };
    };
};
export type ProductItemWithRelations = Prisma.ProductItemGetPayload<{
    include: typeof PRODUCT_ITEM_INCLUDE;
}>;
export interface CreateProductInput {
    name: string;
    slug?: string;
    description?: string | null;
    specifications?: unknown;
    warrantyMonths?: number;
    warrantyTerms?: string | null;
    isPublished?: boolean;
    isActive?: boolean;
    categoryId?: string | null;
    brandId?: string | null;
}
export type UpdateProductInput = Prisma.ProductUpdateInput;
export interface CreateVariantInput {
    sku: string;
    attributes: unknown;
    price: number;
    comparePrice?: number | null;
    images?: string[];
    isDefault?: boolean;
    lowStockThreshold?: number;
    isActive?: boolean;
}
export type UpdateVariantInput = Prisma.ProductVariantUpdateInput;
export interface CreateItemInput {
    uniqueId: string;
    serialNumber?: string | null;
    status?: ProductItemStatus;
    metadata?: unknown;
    manufacturedAt?: Date | string | null;
}
export type UpdateItemInput = Prisma.ProductItemUpdateInput;
export interface ProductQuery {
    search?: string;
    categoryId?: string;
    brandId?: string;
    isPublished?: boolean;
    isActive?: boolean;
    page: number;
    limit: number;
    skip: number;
    take: number;
}
export interface VariantQuery {
    search?: string;
    page: number;
    limit: number;
    skip: number;
    take: number;
}
export interface ItemQuery {
    status?: ProductItemStatus;
    variantId?: string;
    productId?: string;
    isAvailable?: boolean;
    page: number;
    limit: number;
    skip: number;
    take: number;
}
export interface ListProductsResult {
    items: ProductWithRelations[];
    total: number;
}
export interface ListVariantsResult {
    items: ProductVariantWithRelations[];
    total: number;
}
export interface ListItemsResult {
    items: ProductItemWithRelations[];
    total: number;
}
