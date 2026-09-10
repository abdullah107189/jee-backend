export const CUSTOMER_WITH_USER_INCLUDE = {
    user: {
        select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
            role: true,
            isVerified: true,
            isActive: true,
            lastLogin: true,
        },
    },
};
//# sourceMappingURL=customer.type.js.map