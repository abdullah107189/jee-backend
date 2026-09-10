import type { PaymentMethod, PaymentStatus, PaymentVerificationStatus } from "../../../prisma/generated/prisma/client";
export declare const PAYMENT_METHODS: readonly PaymentMethod[];
export declare const PAYMENT_STATUSES: readonly PaymentStatus[];
export declare const PAYMENT_VERIFICATION_STATUSES: readonly PaymentVerificationStatus[];
export declare const PAYMENT: {
    readonly DEFAULT_PAGE_SIZE: 20;
    readonly MAX_PAGE_SIZE: 100;
};
export declare const PAYMENT_MESSAGES: {
    readonly NOT_FOUND: "Payment not found";
    readonly ORDER_NOT_FOUND: "Order not found";
    readonly OFFLINE_SALE_NOT_FOUND: "Offline sale not found";
    readonly REFERENCE_REQUIRED: "Either onlineOrderId or offlineSaleId is required";
    readonly CREATED: "Payment recorded successfully";
    readonly UPDATED: "Payment updated successfully";
    readonly VERIFIED: "Payment verification status updated";
};
