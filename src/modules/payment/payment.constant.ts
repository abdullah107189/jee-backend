import type { PaymentMethod, PaymentStatus, PaymentVerificationStatus } from "../../../prisma/generated/prisma/client";

export const PAYMENT_METHODS: readonly PaymentMethod[] = ["Bkash", "Nagad", "Rocket"];
export const PAYMENT_STATUSES: readonly PaymentStatus[] = ["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIAL"];
export const PAYMENT_VERIFICATION_STATUSES: readonly PaymentVerificationStatus[] = ["PENDING", "VERIFIED", "REJECTED"];

export const PAYMENT = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const PAYMENT_MESSAGES = {
  NOT_FOUND: "Payment not found",
  ORDER_NOT_FOUND: "Order not found",
  OFFLINE_SALE_NOT_FOUND: "Offline sale not found",
  REFERENCE_REQUIRED: "Either onlineOrderId or offlineSaleId is required",
  CREATED: "Payment recorded successfully",
  UPDATED: "Payment updated successfully",
  VERIFIED: "Payment verification status updated",
} as const;