export const PAYMENT_INCLUDE = {
    order: { select: { id: true, orderNumber: true, total: true, customerId: true } },
    offlineSale: { select: { id: true, invoiceNumber: true, total: true, sellerId: true } },
    verifiedBy: { select: { id: true, userId: true } },
};
//# sourceMappingURL=payment.type.js.map