import type { Prisma } from "../../../prisma/generated/prisma/client";
export interface FindOfflineSalesParams {
    sellerId?: string;
    search?: string;
    from?: Date;
    to?: Date;
    skip: number;
    take: number;
}
export declare const offlineSaleRepository: {
    findMany(params: FindOfflineSalesParams): Prisma.PrismaPromise<({
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
        seller: {
            companyName: string;
            id: string;
        };
    } & {
        id: string;
        productItemId: string;
        sellerId: string;
        customerId: string | null;
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        salePrice: import("@prisma/client-runtime-utils").Decimal;
        discount: import("@prisma/client-runtime-utils").Decimal;
        tax: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        notes: string | null;
        invoiceNumber: string | null;
        paymentMethod: string | null;
        paymentStatus: import("../../../prisma/generated/prisma/enums").PaymentStatus;
        saleDate: Date;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    count(params: Omit<FindOfflineSalesParams, "skip" | "take">): Prisma.PrismaPromise<number>;
    findById(id: string): Prisma.Prisma__OfflineSaleClient<({
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
        seller: {
            companyName: string;
            id: string;
        };
    } & {
        id: string;
        productItemId: string;
        sellerId: string;
        customerId: string | null;
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        salePrice: import("@prisma/client-runtime-utils").Decimal;
        discount: import("@prisma/client-runtime-utils").Decimal;
        tax: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        notes: string | null;
        invoiceNumber: string | null;
        paymentMethod: string | null;
        paymentStatus: import("../../../prisma/generated/prisma/enums").PaymentStatus;
        saleDate: Date;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findSellerIdByUserId(userId: string): Prisma.Prisma__SellerClient<{
        id: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findProductItem(productItemId: string): Prisma.Prisma__ProductItemClient<({
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    setProductItemStatus(productItemId: string, status: "AVAILABLE" | "SOLD"): Prisma.Prisma__ProductItemClient<{
        id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findByInvoiceNumber(invoiceNumber: string): Prisma.Prisma__OfflineSaleClient<{
        id: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    create(data: Prisma.OfflineSaleUncheckedCreateInput): Prisma.Prisma__OfflineSaleClient<{
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
        seller: {
            companyName: string;
            id: string;
        };
    } & {
        id: string;
        productItemId: string;
        sellerId: string;
        customerId: string | null;
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        salePrice: import("@prisma/client-runtime-utils").Decimal;
        discount: import("@prisma/client-runtime-utils").Decimal;
        tax: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        notes: string | null;
        invoiceNumber: string | null;
        paymentMethod: string | null;
        paymentStatus: import("../../../prisma/generated/prisma/enums").PaymentStatus;
        saleDate: Date;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    update(id: string, data: Prisma.OfflineSaleUpdateInput): Prisma.Prisma__OfflineSaleClient<{
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
        seller: {
            companyName: string;
            id: string;
        };
    } & {
        id: string;
        productItemId: string;
        sellerId: string;
        customerId: string | null;
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        salePrice: import("@prisma/client-runtime-utils").Decimal;
        discount: import("@prisma/client-runtime-utils").Decimal;
        tax: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        notes: string | null;
        invoiceNumber: string | null;
        paymentMethod: string | null;
        paymentStatus: import("../../../prisma/generated/prisma/enums").PaymentStatus;
        saleDate: Date;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    remove(id: string): Prisma.Prisma__OfflineSaleClient<{
        id: string;
        productItemId: string;
        sellerId: string;
        customerId: string | null;
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        salePrice: import("@prisma/client-runtime-utils").Decimal;
        discount: import("@prisma/client-runtime-utils").Decimal;
        tax: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        notes: string | null;
        invoiceNumber: string | null;
        paymentMethod: string | null;
        paymentStatus: import("../../../prisma/generated/prisma/enums").PaymentStatus;
        saleDate: Date;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
};
