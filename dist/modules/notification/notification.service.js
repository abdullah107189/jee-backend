import { AppError } from "../../middleware/error.middleware";
import { NOTIFICATION, NOTIFICATION_MESSAGES } from "./notification.constant";
import { notificationRepository } from "./notification.repository";
export const notificationService = {
    async list(userId, query) {
        const params = {
            userId,
            isRead: query.isRead,
            type: query.type,
            skip: query.skip,
            take: query.take,
        };
        const [items, total, unread] = await Promise.all([
            notificationRepository.findMany(params),
            notificationRepository.count(params),
            notificationRepository.countUnread(userId),
        ]);
        return { items, total, unread };
    },
    async getById(id, userId, role) {
        const notification = await notificationRepository.findById(id);
        if (!notification)
            throw new AppError(NOTIFICATION_MESSAGES.NOT_FOUND, 404);
        if (role !== "ADMIN" && notification.userId !== userId) {
            throw new AppError(NOTIFICATION_MESSAGES.NOT_FOUND, 404);
        }
        return notification;
    },
    async create(input) {
        const data = {
            userId: input.userId,
            type: input.type,
            title: input.title,
            message: input.message,
            channel: input.channel ?? "IN_APP",
            priority: input.priority ?? NOTIFICATION.DEFAULT_PRIORITY,
            isRead: false,
        };
        if (input.data !== undefined)
            data.data = input.data;
        return notificationRepository.create(data);
    },
    async markRead(id, userId, role) {
        await this.getById(id, userId, role);
        return notificationRepository.markRead(id);
    },
    async markAllRead(userId) {
        await notificationRepository.markAllRead(userId);
    },
    async remove(id, userId, role) {
        await this.getById(id, userId, role);
        await notificationRepository.remove(id);
    },
};
//# sourceMappingURL=notification.service.js.map