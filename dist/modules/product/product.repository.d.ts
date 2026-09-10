import type { Prisma, ProductItemStatus } from "../../../prisma/generated/prisma/client";
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
export declare const productRepository: {
    findMany(params: FindProductsParams): Prisma.PrismaPromise<({
        _count: {
            reviews: number;
            variants: number;
        };
        brand: {
            id: string;
            name: string;
            slug: string;
            logo: string | null;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        } | null;
        category: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            parentId: string | null;
            level: number;
            icon: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        } | null;
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        specifications: import("@prisma/client/runtime/client").JsonValue | null;
        warrantyMonths: number;
        warrantyTerms: string | null;
        isPublished: boolean;
        isActive: boolean;
        categoryId: string | null;
        brandId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    count(params: Omit<FindProductsParams, "skip" | "take">): Prisma.PrismaPromise<number>;
    findById(id: string): Prisma.Prisma__ProductClient<({
        _count: {
            reviews: number;
            variants: number;
        };
        brand: {
            id: string;
            name: string;
            slug: string;
            logo: string | null;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        } | null;
        category: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            parentId: string | null;
            level: number;
            icon: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        } | null;
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        specifications: import("@prisma/client/runtime/client").JsonValue | null;
        warrantyMonths: number;
        warrantyTerms: string | null;
        isPublished: boolean;
        isActive: boolean;
        categoryId: string | null;
        brandId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findBySlug(slug: string): Prisma.Prisma__ProductClient<{
        id: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findCategory(categoryId: string): Prisma.Prisma__CategoryClient<{
        id: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findBrand(brandId: string): Prisma.Prisma__BrandClient<{
        id: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    create(data: Prisma.ProductUncheckedCreateInput): Prisma.Prisma__ProductClient<{
        _count: {
            reviews: number;
            variants: number;
        };
        brand: {
            id: string;
            name: string;
            slug: string;
            logo: string | null;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        } | null;
        category: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            parentId: string | null;
            level: number;
            icon: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        } | null;
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        specifications: import("@prisma/client/runtime/client").JsonValue | null;
        warrantyMonths: number;
        warrantyTerms: string | null;
        isPublished: boolean;
        isActive: boolean;
        categoryId: string | null;
        brandId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    update(id: string, data: Prisma.ProductUpdateInput): Prisma.Prisma__ProductClient<{
        _count: {
            reviews: number;
            variants: number;
        };
        brand: {
            id: string;
            name: string;
            slug: string;
            logo: string | null;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        } | null;
        category: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            parentId: string | null;
            level: number;
            icon: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        } | null;
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        specifications: import("@prisma/client/runtime/client").JsonValue | null;
        warrantyMonths: number;
        warrantyTerms: string | null;
        isPublished: boolean;
        isActive: boolean;
        categoryId: string | null;
        brandId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    softDelete(id: string): Prisma.Prisma__ProductClient<{
        id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findVariants(params: FindProductsParams & {
        productId?: string;
    }): Prisma.PrismaPromise<({
        _count: {
            productItems: number;
        };
        product: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        productId: string;
        sku: string;
        attributes: import("@prisma/client/runtime/client").JsonValue;
        price: import("@prisma/client-runtime-utils").Decimal;
        comparePrice: import("@prisma/client-runtime-utils").Decimal | null;
        images: string[];
        isDefault: boolean;
        lowStockThreshold: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    countVariants(params: {
        productId?: string;
        search?: string;
    }): Prisma.PrismaPromise<number>;
    findVariantById(id: string): Prisma.Prisma__ProductVariantClient<({
        _count: {
            productItems: number;
        };
        product: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        productId: string;
        sku: string;
        attributes: import("@prisma/client/runtime/client").JsonValue;
        price: import("@prisma/client-runtime-utils").Decimal;
        comparePrice: import("@prisma/client-runtime-utils").Decimal | null;
        images: string[];
        isDefault: boolean;
        lowStockThreshold: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findVariantBySku(sku: string): Prisma.Prisma__ProductVariantClient<{
        id: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    createVariant(data: Prisma.ProductVariantUncheckedCreateInput): Prisma.Prisma__ProductVariantClient<{
        _count: {
            productItems: number;
        };
        product: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        productId: string;
        sku: string;
        attributes: import("@prisma/client/runtime/client").JsonValue;
        price: import("@prisma/client-runtime-utils").Decimal;
        comparePrice: import("@prisma/client-runtime-utils").Decimal | null;
        images: string[];
        isDefault: boolean;
        lowStockThreshold: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    updateVariant(id: string, data: Prisma.ProductVariantUpdateInput): Prisma.Prisma__ProductVariantClient<{
        _count: {
            productItems: number;
        };
        product: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        productId: string;
        sku: string;
        attributes: import("@prisma/client/runtime/client").JsonValue;
        price: import("@prisma/client-runtime-utils").Decimal;
        comparePrice: import("@prisma/client-runtime-utils").Decimal | null;
        images: string[];
        isDefault: boolean;
        lowStockThreshold: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    softDeleteVariant(id: string): Prisma.Prisma__ProductVariantClient<{
        id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findManyItems(params: FindItemsParams): Prisma.PrismaPromise<({
        variant: {
            product: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            productId: string;
            sku: string;
            attributes: import("@prisma/client/runtime/client").JsonValue;
            price: import("@prisma/client-runtime-utils").Decimal;
            comparePrice: import("@prisma/client-runtime-utils").Decimal | null;
            images: string[];
            isDefault: boolean;
            lowStockThreshold: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        variantId: string;
        uniqueId: string;
        serialNumber: string | null;
        status: ProductItemStatus;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        manufacturedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    countItems(params: Omit<FindItemsParams, "skip" | "take">): Prisma.PrismaPromise<number>;
    findItemById(id: string): Prisma.Prisma__ProductItemClient<({
        variant: {
            product: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            productId: string;
            sku: string;
            attributes: import("@prisma/client/runtime/client").JsonValue;
            price: import("@prisma/client-runtime-utils").Decimal;
            comparePrice: import("@prisma/client-runtime-utils").Decimal | null;
            images: string[];
            isDefault: boolean;
            lowStockThreshold: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        variantId: string;
        uniqueId: string;
        serialNumber: string | null;
        status: ProductItemStatus;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        manufacturedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    createItem(data: Prisma.ProductItemUncheckedCreateInput): Prisma.Prisma__ProductItemClient<{
        variant: {
            product: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            productId: string;
            sku: string;
            attributes: import("@prisma/client/runtime/client").JsonValue;
            price: import("@prisma/client-runtime-utils").Decimal;
            comparePrice: import("@prisma/client-runtime-utils").Decimal | null;
            images: string[];
            isDefault: boolean;
            lowStockThreshold: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        variantId: string;
        uniqueId: string;
        serialNumber: string | null;
        status: ProductItemStatus;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        manufacturedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    updateItem(id: string, data: Prisma.ProductItemUpdateInput): Prisma.Prisma__ProductItemClient<{
        variant: {
            product: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            productId: string;
            sku: string;
            attributes: import("@prisma/client/runtime/client").JsonValue;
            price: import("@prisma/client-runtime-utils").Decimal;
            comparePrice: import("@prisma/client-runtime-utils").Decimal | null;
            images: string[];
            isDefault: boolean;
            lowStockThreshold: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        variantId: string;
        uniqueId: string;
        serialNumber: string | null;
        status: ProductItemStatus;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        manufacturedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    softDeleteItem(id: string): Prisma.Prisma__ProductItemClient<{
        id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
};
