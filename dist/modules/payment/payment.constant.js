export const PAYMENT_METHODS = ["Bkash", "Nagad", "Rocket"];
export const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIAL"];
export const PAYMENT_VERIFICATION_STATUSES = ["PENDING", "VERIFIED", "REJECTED"];
export const PAYMENT = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
};
export const PAYMENT_MESSAGES = {
    NOT_FOUND: "Payment not found",
    ORDER_NOT_FOUND: "Order not found",
    OFFLINE_SALE_NOT_FOUND: "Offline sale not found",
    REFERENCE_REQUIRED: "Either onlineOrderId or offlineSaleId is required",
    CREATED: "Payment recorded successfully",
    UPDATED: "Payment updated successfully",
    VERIFIED: "Payment verification status updated",
};
//# sourceMappingURL=payment.constant.js.map