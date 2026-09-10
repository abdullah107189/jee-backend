import type { Prisma, UserRole } from "../../../prisma/generated/prisma/client";
import type { CreatePaymentInput, ListPaymentsResult, PaymentQuery, PaymentVerifyInput, PaymentWithRelations } from "./payment.type";
export declare const paymentService: {
    list(query: PaymentQuery, viewer?: {
        role: UserRole;
        userId: string;
    }): Promise<ListPaymentsResult>;
    getById(id: string): Promise<PaymentWithRelations>;
    create(userId: string, role: UserRole, input: CreatePaymentInput): Promise<PaymentWithRelations>;
    verify(id: string, adminUserId: string, input: PaymentVerifyInput): Promise<PaymentWithRelations>;
    update(id: string, input: Prisma.PaymentUpdateInput): Promise<PaymentWithRelations>;
};
