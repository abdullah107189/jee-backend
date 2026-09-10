import type { ClaimStatus, Prisma } from "../../../prisma/generated/prisma/client";
export interface FindClaimsParams {
    warrantyId?: string;
    status?: ClaimStatus;
    customerId?: string;
    sellerId?: string;
    skip: number;
    take: number;
}
export declare const warrantyClaimRepository: {
    findMany(params: FindClaimsParams): Prisma.PrismaPromise<({
        warranty: {
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
            status: import("../../../prisma/generated/prisma/enums").WarrantyStatus;
            claimLimitType: import("../../../prisma/generated/prisma/enums").ClaimLimitType;
            terms: string | null;
            claimedAt: Date | null;
            claimReason: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        warrantyId: string;
        claimNumber: string;
        description: string;
        status: ClaimStatus;
        resolution: string | null;
        claimAmount: import("@prisma/client-runtime-utils").Decimal | null;
        submittedAt: Date;
        approvedAt: Date | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    count(params: Omit<FindClaimsParams, "skip" | "take">): Prisma.PrismaPromise<number>;
    findById(id: string): Prisma.Prisma__WarrantyClaimClient<({
        warranty: {
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
            status: import("../../../prisma/generated/prisma/enums").WarrantyStatus;
            claimLimitType: import("../../../prisma/generated/prisma/enums").ClaimLimitType;
            terms: string | null;
            claimedAt: Date | null;
            claimReason: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        warrantyId: string;
        claimNumber: string;
        description: string;
        status: ClaimStatus;
        resolution: string | null;
        claimAmount: import("@prisma/client-runtime-utils").Decimal | null;
        submittedAt: Date;
        approvedAt: Date | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findWarrantyById(warrantyId: string): Prisma.Prisma__WarrantyClient<({
        customer: {
            id: string;
            userId: string;
        } | null;
        seller: {
            id: string;
            userId: string;
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
        status: import("../../../prisma/generated/prisma/enums").WarrantyStatus;
        claimLimitType: import("../../../prisma/generated/prisma/enums").ClaimLimitType;
        terms: string | null;
        claimedAt: Date | null;
        claimReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    countClaimsForWarranty(warrantyId: string): Prisma.PrismaPromise<number>;
    create(data: Prisma.WarrantyClaimUncheckedCreateInput): Prisma.Prisma__WarrantyClaimClient<{
        warranty: {
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
            status: import("../../../prisma/generated/prisma/enums").WarrantyStatus;
            claimLimitType: import("../../../prisma/generated/prisma/enums").ClaimLimitType;
            terms: string | null;
            claimedAt: Date | null;
            claimReason: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        warrantyId: string;
        claimNumber: string;
        description: string;
        status: ClaimStatus;
        resolution: string | null;
        claimAmount: import("@prisma/client-runtime-utils").Decimal | null;
        submittedAt: Date;
        approvedAt: Date | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    update(id: string, data: Prisma.WarrantyClaimUpdateInput): Prisma.Prisma__WarrantyClaimClient<{
        warranty: {
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
            status: import("../../../prisma/generated/prisma/enums").WarrantyStatus;
            claimLimitType: import("../../../prisma/generated/prisma/enums").ClaimLimitType;
            terms: string | null;
            claimedAt: Date | null;
            claimReason: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        warrantyId: string;
        claimNumber: string;
        description: string;
        status: ClaimStatus;
        resolution: string | null;
        claimAmount: import("@prisma/client-runtime-utils").Decimal | null;
        submittedAt: Date;
        approvedAt: Date | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    markWarrantyClaimed(warrantyId: string): Prisma.Prisma__WarrantyClient<{
        id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
};
