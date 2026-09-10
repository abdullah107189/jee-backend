/** Admin rows always come with their User account (no password). */
export const ADMIN_WITH_USER_INCLUDE = {
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
//# sourceMappingURL=admin.type.js.map