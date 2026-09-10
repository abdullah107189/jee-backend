import { prisma } from "../../../lib/prisma";
export const authRepository = {
    findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    },
    findByPhone(phone) {
        return prisma.user.findUnique({ where: { phone } });
    },
    findById(id) {
        return prisma.user.findUnique({ where: { id } });
    },
    create(data) {
        return prisma.user.create({ data });
    },
    updateLastLogin(id) {
        return prisma.user.update({ where: { id }, data: { lastLogin: new Date() } });
    },
    updatePassword(id, hashedPassword) {
        return prisma.user.update({ where: { id }, data: { password: hashedPassword }, select: { id: true } });
    },
};
//# sourceMappingURL=auth.repository.js.map