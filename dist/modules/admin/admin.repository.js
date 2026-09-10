import { prisma } from "../../../lib/prisma";
import { ADMIN_WITH_USER_INCLUDE } from "./admin.type";
function buildWhere(params) {
    if (!params.search)
        return {};
    return {
        OR: [
            { user: { email: { contains: params.search, mode: "insensitive" } } },
            { user: { firstName: { contains: params.search, mode: "insensitive" } } },
            { user: { lastName: { contains: params.search, mode: "insensitive" } } },
            { user: { phone: { contains: params.search, mode: "insensitive" } } },
        ],
    };
}
export const adminRepository = {
    findMany(params) {
        return prisma.admin.findMany({
            where: buildWhere(params),
            include: ADMIN_WITH_USER_INCLUDE,
            skip: params.skip,
            take: params.take,
            orderBy: { createdAt: "desc" },
        });
    },
    count(params) {
        return prisma.admin.count({ where: buildWhere(params) });
    },
    findById(id) {
        return prisma.admin.findUnique({ where: { id }, include: ADMIN_WITH_USER_INCLUDE });
    },
    findByUserId(userId) {
        return prisma.admin.findUnique({ where: { userId } });
    },
    findUserByEmail(email) {
        return prisma.user.findUnique({ where: { email }, select: { id: true } });
    },
    /** Creates the ADMIN user and its Admin profile in one operation. */
    create(data) {
        return prisma.admin.create({
            data: {
                permissions: data.permissions ?? [],
                user: {
                    create: {
                        email: data.email,
                        password: data.password,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                        role: "ADMIN",
                        isVerified: true,
                        isActive: true,
                    },
                },
            },
            include: ADMIN_WITH_USER_INCLUDE,
        });
    },
    update(id, data) {
        return prisma.admin.update({ where: { id }, data, include: ADMIN_WITH_USER_INCLUDE });
    },
    /** Removes the Admin profile and soft-deletes the backing User account. */
    async remove(id, userId) {
        await prisma.admin.delete({ where: { id } });
        await prisma.user.update({
            where: { id: userId },
            data: { deletedAt: new Date(), isActive: false },
            select: { id: true },
        });
    },
};
//# sourceMappingURL=admin.repository.js.map