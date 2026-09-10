import type { PaymentStatus, PaymentVerificationStatus, Prisma } from "../../../prisma/generated/prisma/client";
export interface FindPaymentsParams {
    onlineOrderId?: string;
    offlineSaleId?: string;
    status?: PaymentStatus;
    /** Scopes to payments on orders of a given customer profile. */
    customerId?: string;
    /** Scopes to payments on offline sales of a given seller profile. */
    sellerId?: string;
    skip: number;
    take: number;
}
export declare const paymentRepository: {
    findMany(params: FindPaymentsParams): Prisma.PrismaPromise<({
        offlineSale: {
            id: string;
            invoiceNumber: string | null;
            sellerId: string;
            total: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        order: {
            customerId: string;
            id: string;
            orderNumber: string;
            total: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        verifiedBy: {
            id: string;
            userId: string;
        } | null;
    } & {
        id: string;
        onlineOrderId: string | null;
        offlineSaleId: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        method: import("../../../prisma/generated/prisma/enums").PaymentMethod;
        status: PaymentStatus;
        transactionId: string | null;
        gateway: string | null;
        gatewayResponse: import("@prisma/client/runtime/client").JsonValue | null;
        verificationStatus: PaymentVerificationStatus;
        verifiedById: string | null;
        verifiedAt: Date | null;
        processedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    count(params: Omit<FindPaymentsParams, "skip" | "take">): Prisma.PrismaPromise<number>;
    findById(id: string): Prisma.Prisma__PaymentClient<({
        offlineSale: {
            id: string;
            invoiceNumber: string | null;
            sellerId: string;
            total: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        order: {
            customerId: string;
            id: string;
            orderNumber: string;
            total: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        verifiedBy: {
            id: string;
            userId: string;
        } | null;
    } & {
        id: string;
        onlineOrderId: string | null;
        offlineSaleId: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        method: import("../../../prisma/generated/prisma/enums").PaymentMethod;
        status: PaymentStatus;
        transactionId: string | null;
        gateway: string | null;
        gatewayResponse: import("@prisma/client/runtime/client").JsonValue | null;
        verificationStatus: PaymentVerificationStatus;
        verifiedById: string | null;
        verifiedAt: Date | null;
        processedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
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
    findOnlineOrder(id: string): Prisma.Prisma__OnlineOrderClient<{
        customerId: string;
        id: string;
        total: import("@prisma/client-runtime-utils").Decimal;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findOfflineSale(id: string): Prisma.Prisma__OfflineSaleClient<{
        id: string;
        sellerId: string;
        total: import("@prisma/client-runtime-utils").Decimal;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    create(data: Prisma.PaymentUncheckedCreateInput): Prisma.Prisma__PaymentClient<{
        offlineSale: {
            id: string;
            invoiceNumber: string | null;
            sellerId: string;
            total: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        order: {
            customerId: string;
            id: string;
            orderNumber: string;
            total: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        verifiedBy: {
            id: string;
            userId: string;
        } | null;
    } & {
        id: string;
        onlineOrderId: string | null;
        offlineSaleId: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        method: import("../../../prisma/generated/prisma/enums").PaymentMethod;
        status: PaymentStatus;
        transactionId: string | null;
        gateway: string | null;
        gatewayResponse: import("@prisma/client/runtime/client").JsonValue | null;
        verificationStatus: PaymentVerificationStatus;
        verifiedById: string | null;
        verifiedAt: Date | null;
        processedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    update(id: string, data: Prisma.PaymentUpdateInput): Prisma.Prisma__PaymentClient<{
        offlineSale: {
            id: string;
            invoiceNumber: string | null;
            sellerId: string;
            total: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        order: {
            customerId: string;
            id: string;
            orderNumber: string;
            total: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        verifiedBy: {
            id: string;
            userId: string;
        } | null;
    } & {
        id: string;
        onlineOrderId: string | null;
        offlineSaleId: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        method: import("../../../prisma/generated/prisma/enums").PaymentMethod;
        status: PaymentStatus;
        transactionId: string | null;
        gateway: string | null;
        gatewayResponse: import("@prisma/client/runtime/client").JsonValue | null;
        verificationStatus: PaymentVerificationStatus;
        verifiedById: string | null;
        verifiedAt: Date | null;
        processedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
};
