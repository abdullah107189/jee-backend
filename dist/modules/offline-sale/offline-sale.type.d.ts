import type { Prisma } from "../../../prisma/generated/prisma/client";
export declare const OFFLINE_SALE_INCLUDE: {
    productItem: {
        include: {
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
    };
    seller: {
        select: {
            id: true;
            companyName: true;
        };
    };
    customer: {
        select: {
            id: true;
            userId: true;
        };
    };
};
export type OfflineSaleWithRelations = Prisma.OfflineSaleGetPayload<{
    include: typeof OFFLINE_SALE_INCLUDE;
}>;
export interface CreateOfflineSaleInput {
    productItemId: string;
    customerId?: string | null;
    customerName: string;
    customerPhone: string;
    customerEmail?: string | null;
    salePrice: number;
    discount?: number;
    tax?: number;
    notes?: string | null;
    paymentMethod?: string | null;
    saleDate?: Date | string | null;
}
export type UpdateOfflineSaleInput = Prisma.OfflineSaleUpdateInput;
export interface OfflineSaleQuery {
    sellerId?: string;
    search?: string;
    from?: Date;
    to?: Date;
    page: number;
    limit: number;
    skip: number;
    take: number;
}
export interface ListOfflineSalesResult {
    items: OfflineSaleWithRelations[];
    total: number;
}
