import { prisma } from "../../../lib/prisma";
import { NOTIFICATION_INCLUDE } from "./notification.type";
function buildWhere(params) {
    const where = { userId: params.userId };
    if (params.isRead !== undefined)
        where.isRead = params.isRead;
    if (params.type)
        where.type = params.type;
    return where;
}
export const notificationRepository = {
    findMany(params) {
        return prisma.notification.findMany({
            where: buildWhere(params),
            include: NOTIFICATION_INCLUDE,
            skip: params.skip,
            take: params.take,
            orderBy: { createdAt: "desc" },
        });
    },
    count(params) {
        return prisma.notification.count({ where: buildWhere(params) });
    },
    countUnread(userId) {
        return prisma.notification.count({ where: { userId, isRead: false } });
    },
    findById(id) {
        return prisma.notification.findUnique({ where: { id }, include: NOTIFICATION_INCLUDE });
    },
    create(data) {
        return prisma.notification.create({ data, include: NOTIFICATION_INCLUDE });
    },
    markRead(id) {
        return prisma.notification.update({
            where: { id },
            data: { isRead: true, readAt: new Date() },
            include: NOTIFICATION_INCLUDE,
        });
    },
    markAllRead(userId) {
        return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true, readAt: new Date() } });
    },
    remove(id) {
        return prisma.notification.delete({ where: { id } });
    },
};
//# sourceMappingURL=notification.repository.js.map