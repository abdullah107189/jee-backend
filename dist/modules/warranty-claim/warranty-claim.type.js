export const CLAIM_INCLUDE = {
    warranty: {
        include: {
            productItem: {
                include: {
                    variant: { include: { product: { select: { id: true, name: true, slug: true } } } },
                },
            },
            customer: { select: { id: true, userId: true } },
        },
    },
};
//# sourceMappingURL=warranty-claim.type.js.map