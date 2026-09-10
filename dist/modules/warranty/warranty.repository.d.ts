import type { Prisma, WarrantyStatus } from "../../../prisma/generated/prisma/client";
export interface FindWarrantiesParams {
    customerId?: string;
    sellerId?: string;
    status?: WarrantyStatus;
    search?: string;
    skip: number;
    take: number;
}
export declare const warrantyRepository: {
    findMany(params: FindWarrantiesParams): Prisma.PrismaPromise<({
        _count: {
            claims: number;
        };
        customer: {
            id: string;
            userId: string;
        } | null;
        productItem: {
            variant: {
                product: {
                    id: string;
                    name: string;
                    slug: string;
                    warrantyMonths: number;
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
            status: import("../../../prisma/generated/prisma/enums").ProductItemStatus;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            manufacturedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        seller: {
            companyName: string;
            id: string;
        } | null;
    } & {
        id: string;
        productItemId: string;
        customerId: string | null;
        sellerId: string | null;
        onlineOrderId: string | null;
        offlineSaleId: string | null;
        saleType: import("../../../prisma/generated/prisma/enums").SaleType;
        startDate: Date;
        endDate: Date;
        status: WarrantyStatus;
        claimLimitType: import("../../../prisma/generated/prisma/enums").ClaimLimitType;
        terms: string | null;
        claimedAt: Date | null;
        claimReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    count(params: Omit<FindWarrantiesParams, "skip" | "take">): Prisma.PrismaPromise<number>;
    findById(id: string): Prisma.Prisma__WarrantyClient<({
        _count: {
            claims: number;
        };
        customer: {
            id: string;
            userId: string;
        } | null;
        productItem: {
            variant: {
                product: {
                    id: string;
                    name: string;
                    slug: string;
                    warrantyMonths: number;
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
            status: import("../../../prisma/generated/prisma/enums").ProductItemStatus;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            manufacturedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        seller: {
            companyName: string;
            id: string;
        } | null;
    } & {
        id: string;
        productItemId: string;
        customerId: string | null;
        sellerId: string | null;
        onlineOrderId: string | null;
        offlineSaleId: string | null;
        saleType: import("../../../prisma/generated/prisma/enums").SaleType;
        startDate: Date;
        endDate: Date;
        status: WarrantyStatus;
        claimLimitType: import("../../../prisma/generated/prisma/enums").ClaimLimitType;
        terms: string | null;
        claimedAt: Date | null;
        claimReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findByProductItemId(productItemId: string): Prisma.Prisma__WarrantyClient<{
        id: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findByOfflineSaleId(offlineSaleId: string): Prisma.Prisma__WarrantyClient<{
        id: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findProductItem(productItemId: string): Prisma.Prisma__ProductItemClient<({
        variant: {
            product: {
                id: string;
                warrantyMonths: number;
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
        status: import("../../../prisma/generated/prisma/enums").ProductItemStatus;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        manufacturedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findCustomerIdByUserId(userId: string): Prisma.Prisma__CustomerClient<{
        id: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findSellerIdByUserId(userId: string): Prisma.Prisma__SellerClient<{
        id: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    create(data: Prisma.WarrantyUncheckedCreateInput): Prisma.Prisma__WarrantyClient<{
        _count: {
            claims: number;
        };
        customer: {
            id: string;
            userId: string;
        } | null;
        productItem: {
            variant: {
                product: {
                    id: string;
                    name: string;
                    slug: string;
                    warrantyMonths: number;
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
            status: import("../../../prisma/generated/prisma/enums").ProductItemStatus;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            manufacturedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        seller: {
            companyName: string;
            id: string;
        } | null;
    } & {
        id: string;
        productItemId: string;
        customerId: string | null;
        sellerId: string | null;
        onlineOrderId: string | null;
        offlineSaleId: string | null;
        saleType: import("../../../prisma/generated/prisma/enums").SaleType;
        startDate: Date;
        endDate: Date;
        status: WarrantyStatus;
        claimLimitType: import("../../../prisma/generated/prisma/enums").ClaimLimitType;
        terms: string | null;
        claimedAt: Date | null;
        claimReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    update(id: string, data: Prisma.WarrantyUpdateInput): Prisma.Prisma__WarrantyClient<{
        _count: {
            claims: number;
        };
        customer: {
            id: string;
            userId: string;
        } | null;
        productItem: {
            variant: {
                product: {
                    id: string;
                    name: string;
                    slug: string;
                    warrantyMonths: number;
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
            status: import("../../../prisma/generated/prisma/enums").ProductItemStatus;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            manufacturedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        seller: {
            companyName: string;
            id: string;
        } | null;
    } & {
        id: string;
        productItemId: string;
        customerId: string | null;
        sellerId: string | null;
        onlineOrderId: string | null;
        offlineSaleId: string | null;
        saleType: import("../../../prisma/generated/prisma/enums").SaleType;
        startDate: Date;
        endDate: Date;
        status: WarrantyStatus;
        claimLimitType: import("../../../prisma/generated/prisma/enums").ClaimLimitType;
        terms: string | null;
        claimedAt: Date | null;
        claimReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    remove(id: string): Prisma.Prisma__WarrantyClient<{
        id: string;
        productItemId: string;
        customerId: string | null;
        sellerId: string | null;
        onlineOrderId: string | null;
        offlineSaleId: string | null;
        saleType: import("../../../prisma/generated/prisma/enums").SaleType;
        startDate: Date;
        endDate: Date;
        status: WarrantyStatus;
        claimLimitType: import("../../../prisma/generated/prisma/enums").ClaimLimitType;
        terms: string | null;
        claimedAt: Date | null;
        claimReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
};
