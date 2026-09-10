import type { PaymentMethod, PaymentStatus, PaymentVerificationStatus, Prisma } from "../../../prisma/generated/prisma/client";

export const PAYMENT_INCLUDE = {
  order: { select: { id: true, orderNumber: true, total: true, customerId: true } },
  offlineSale: { select: { id: true, invoiceNumber: true, total: true, sellerId: true } },
  verifiedBy: { select: { id: true, userId: true } },
} satisfies Prisma.PaymentInclude;

export type PaymentWithRelations = Prisma.PaymentGetPayload<{ include: typeof PAYMENT_INCLUDE }>;

export interface CreatePaymentInput {
  onlineOrderId?: string | null;
  offlineSaleId?: string | null;
  amount: number;
  method: PaymentMethod;
  transactionId?: string | null;
  gateway?: string | null;
  gatewayResponse?: unknown;
  status?: PaymentStatus;
}

export type UpdatePaymentInput = Prisma.PaymentUpdateInput;

export interface PaymentVerifyInput {
  verificationStatus: PaymentVerificationStatus;
  status?: PaymentStatus;
}

export interface PaymentQuery {
  onlineOrderId?: string;
  offlineSaleId?: string;
  status?: PaymentStatus;
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface ListPaymentsResult {
  items: PaymentWithRelations[];
  total: number;
}