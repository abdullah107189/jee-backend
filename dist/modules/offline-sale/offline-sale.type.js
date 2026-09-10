export const OFFLINE_SALE_INCLUDE = {
    productItem: {
        include: {
            variant: { include: { product: { select: { id: true, name: true, slug: true } } } },
        },
    },
    seller: { select: { id: true, companyName: true } },
    customer: { select: { id: true, userId: true } },
};
//# sourceMappingURL=offline-sale.type.js.map