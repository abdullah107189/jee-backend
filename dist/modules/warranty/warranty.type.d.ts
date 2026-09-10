import type { ClaimLimitType, Prisma, SaleType, WarrantyStatus } from "../../../prisma/generated/prisma/client";
export declare const WARRANTY_INCLUDE: {
    productItem: {
        include: {
            variant: {
                include: {
                    product: {
                        select: {
                            id: true;
                            name: true;
                            slug: true;
                            warrantyMonths: true;
                        };
                    };
                };
            };
        };
    };
    customer: {
        select: {
            id: true;
            userId: true;
        };
    };
    seller: {
        select: {
            id: true;
            companyName: true;
        };
    };
    _count: {
        select: {
            claims: true;
        };
    };
};
export type WarrantyWithRelations = Prisma.WarrantyGetPayload<{
    include: typeof WARRANTY_INCLUDE;
}>;
export interface CreateWarrantyInput {
    productItemId: string;
    saleType: SaleType;
    customerId?: string | null;
    sellerId?: string | null;
    onlineOrderId?: string | null;
    offlineSaleId?: string | null;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    status?: WarrantyStatus;
    claimLimitType?: ClaimLimitType;
    terms?: string | null;
}
export type UpdateWarrantyInput = Prisma.WarrantyUpdateInput;
export interface WarrantyQuery {
    customerId?: string;
    sellerId?: string;
    status?: WarrantyStatus;
    search?: string;
    page: number;
    limit: number;
    skip: number;
    take: number;
}
export interface ListWarrantiesResult {
    items: WarrantyWithRelations[];
    total: number;
}
