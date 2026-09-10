import type { Prisma, OrderStatus, ProductItemStatus } from "../../../prisma/generated/prisma/client";
export interface FindOrdersParams {
    customerId?: string;
    status?: OrderStatus;
    search?: string;
    skip: number;
    take: number;
}
export declare const orderRepository: {
    findMany(params: FindOrdersParams): Prisma.PrismaPromise<({
        customer: {
            id: string;
            userId: string;
        };
        orderItems: ({
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
                status: ProductItemStatus;
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                manufacturedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            orderId: string;
            productItemId: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            discount: import("@prisma/client-runtime-utils").Decimal;
            tax: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: string;
        customerId: string;
        orderNumber: string;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        discount: import("@prisma/client-runtime-utils").Decimal;
        tax: import("@prisma/client-runtime-utils").Decimal;
        shipping: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        status: OrderStatus;
        paymentStatus: import("../../../prisma/generated/prisma/enums").PaymentStatus;
        shippingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        billingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        trackingNumber: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        orderedAt: Date;
        deliveredAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    count(params: Omit<FindOrdersParams, "skip" | "take">): Prisma.PrismaPromise<number>;
    findById(id: string): Prisma.Prisma__OnlineOrderClient<({
        customer: {
            id: string;
            userId: string;
        };
        orderItems: ({
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
                status: ProductItemStatus;
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                manufacturedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            orderId: string;
            productItemId: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            discount: import("@prisma/client-runtime-utils").Decimal;
            tax: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: string;
        customerId: string;
        orderNumber: string;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        discount: import("@prisma/client-runtime-utils").Decimal;
        tax: import("@prisma/client-runtime-utils").Decimal;
        shipping: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        status: OrderStatus;
        paymentStatus: import("../../../prisma/generated/prisma/enums").PaymentStatus;
        shippingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        billingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        trackingNumber: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        orderedAt: Date;
        deliveredAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    /** The customer profile linked to a user (used to scope customer orders). */
    findCustomerIdByUserId(userId: string): Prisma.Prisma__CustomerClient<{
        id: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findAvailableItemsByIds(ids: string[]): Prisma.PrismaPromise<({
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
    update(id: string, data: Prisma.OnlineOrderUpdateInput): Prisma.Prisma__OnlineOrderClient<{
        customer: {
            id: string;
            userId: string;
        };
        orderItems: ({
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
                status: ProductItemStatus;
                metadata: import("@prisma/client/runtime/client").JsonValue | null;
                manufacturedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            orderId: string;
            productItemId: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            discount: import("@prisma/client-runtime-utils").Decimal;
            tax: import("@prisma/client-runtime-utils").Decimal;
            total: import("@prisma/client-runtime-utils").Decimal;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: string;
        customerId: string;
        orderNumber: string;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        discount: import("@prisma/client-runtime-utils").Decimal;
        tax: import("@prisma/client-runtime-utils").Decimal;
        shipping: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        status: OrderStatus;
        paymentStatus: import("../../../prisma/generated/prisma/enums").PaymentStatus;
        shippingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        billingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        trackingNumber: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        orderedAt: Date;
        deliveredAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findItemIdsByOrder(orderId: string): Prisma.PrismaPromise<{
        productItemId: string;
    }[]>;
    setProductItemStatus(productItemIds: string[], status: ProductItemStatus): Prisma.PrismaPromise<Prisma.BatchPayload>;
};
