import { prisma } from "../../../lib/prisma";
import { CUSTOMER_WITH_USER_INCLUDE } from "./customer.type";
function buildWhere(params) {
    const where = { deletedAt: null };
    if (params.search) {
        where.OR = [
            { user: { email: { contains: params.search, mode: "insensitive" } } },
            { user: { firstName: { contains: params.search, mode: "insensitive" } } },
            { user: { lastName: { contains: params.search, mode: "insensitive" } } },
            { user: { phone: { contains: params.search, mode: "insensitive" } } },
        ];
    }
    return where;
}
export const customerRepository = {
    findMany(params) {
        return prisma.customer.findMany({
            where: buildWhere(params),
            include: CUSTOMER_WITH_USER_INCLUDE,
            skip: params.skip,
            take: params.take,
            orderBy: { createdAt: "desc" },
        });
    },
    count(params) {
        return prisma.customer.count({ where: buildWhere(params) });
    },
    findById(id) {
        return prisma.customer.findUnique({ where: { id }, include: CUSTOMER_WITH_USER_INCLUDE });
    },
    findByUserId(userId) {
        return prisma.customer.findUnique({ where: { userId }, include: CUSTOMER_WITH_USER_INCLUDE });
    },
    findUserByEmail(email) {
        return prisma.user.findUnique({ where: { email }, select: { id: true } });
    },
    /** Creates the CUSTOMER user and its Customer profile in one operation. */
    create(data) {
        return prisma.customer.create({
            data: {
                shippingAddress: data.shippingAddress,
                billingAddress: data.billingAddress,
                preferredPayment: data.preferredPayment,
                user: {
                    create: {
                        email: data.email,
                        password: data.password,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                        role: "CUSTOMER",
                        isVerified: false,
                        isActive: true,
                    },
                },
            },
            include: CUSTOMER_WITH_USER_INCLUDE,
        });
    },
    update(id, data) {
        return prisma.customer.update({ where: { id }, data, include: CUSTOMER_WITH_USER_INCLUDE });
    },
    /** Removes the Customer profile and soft-deletes the backing User account. */
    async remove(id, userId) {
        await prisma.customer.delete({ where: { id } });
        await prisma.user.update({
            where: { id: userId },
            data: { deletedAt: new Date(), isActive: false },
            select: { id: true },
        });
    },
};
//# sourceMappingURL=customer.repository.js.map