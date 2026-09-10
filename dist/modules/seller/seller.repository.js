import { prisma } from "../../../lib/prisma";
import { SELLER_WITH_USER_INCLUDE } from "./seller.type";
function buildWhere(params) {
    const where = { deletedAt: null };
    if (params.status)
        where.status = params.status;
    if (params.search) {
        where.OR = [
            { user: { email: { contains: params.search, mode: "insensitive" } } },
            { user: { firstName: { contains: params.search, mode: "insensitive" } } },
            { user: { lastName: { contains: params.search, mode: "insensitive" } } },
            { companyName: { contains: params.search, mode: "insensitive" } },
        ];
    }
    return where;
}
export const sellerRepository = {
    findMany(params) {
        return prisma.seller.findMany({
            where: buildWhere(params),
            include: SELLER_WITH_USER_INCLUDE,
            skip: params.skip,
            take: params.take,
            orderBy: { createdAt: "desc" },
        });
    },
    count(params) {
        return prisma.seller.count({ where: buildWhere(params) });
    },
    findById(id) {
        return prisma.seller.findUnique({ where: { id }, include: SELLER_WITH_USER_INCLUDE });
    },
    findByUserId(userId) {
        return prisma.seller.findUnique({ where: { userId }, include: SELLER_WITH_USER_INCLUDE });
    },
    findUserByEmail(email) {
        return prisma.user.findUnique({ where: { email }, select: { id: true } });
    },
    /** Creates the SELLER user and its Seller profile in one operation. */
    create(data) {
        return prisma.seller.create({
            data: {
                companyName: data.companyName,
                businessLicense: data.businessLicense,
                address: data.address,
                city: data.city,
                state: data.state,
                zipCode: data.zipCode,
                country: data.country,
                taxId: data.taxId,
                user: {
                    create: {
                        email: data.email,
                        password: data.password,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                        role: "SELLER",
                        isVerified: false,
                        isActive: true,
                    },
                },
            },
            include: SELLER_WITH_USER_INCLUDE,
        });
    },
    update(id, data) {
        return prisma.seller.update({ where: { id }, data, include: SELLER_WITH_USER_INCLUDE });
    },
    /** Removes the Seller profile and soft-deletes the backing User account. */
    async remove(id, userId) {
        await prisma.seller.delete({ where: { id } });
        await prisma.user.update({
            where: { id: userId },
            data: { deletedAt: new Date(), isActive: false },
            select: { id: true },
        });
    },
};
//# sourceMappingURL=seller.repository.js.map