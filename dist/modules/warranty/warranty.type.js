export const WARRANTY_INCLUDE = {
    productItem: {
        include: {
            variant: { include: { product: { select: { id: true, name: true, slug: true, warrantyMonths: true } } } },
        },
    },
    customer: { select: { id: true, userId: true } },
    seller: { select: { id: true, companyName: true } },
    _count: { select: { claims: true } },
};
//# sourceMappingURL=warranty.type.js.map