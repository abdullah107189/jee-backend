export const ORDER_INCLUDE = {
    customer: { select: { id: true, userId: true } },
    orderItems: {
        include: {
            productItem: {
                include: {
                    variant: {
                        include: {
                            product: { select: { id: true, name: true, slug: true } },
                        },
                    },
                },
            },
        },
    },
};
//# sourceMappingURL=order.type.js.map