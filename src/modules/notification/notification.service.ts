import type { Prisma, UserRole } from "../../../prisma/generated/prisma/client";
import AppError  from "../../errors/AppError";
import { NOTIFICATION, NOTIFICATION_MESSAGES } from "./notification.constant";
import { notificationRepository } from "./notification.repository";
import type {
  CreateNotificationInput,
  ListNotificationsResult,
  NotificationQuery,
  NotificationWithUser,
} from "./notification.type";

export const notificationService = {
  async list(userId: string, query: NotificationQuery): Promise<ListNotificationsResult> {
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

  async getById(id: string, userId: string, role: UserRole): Promise<NotificationWithUser> {
    const notification = await notificationRepository.findById(id);
    if (!notification) throw new AppError(NOTIFICATION_MESSAGES.NOT_FOUND, 404);
    if (role !== "ADMIN" && notification.userId !== userId) {
      throw new AppError(NOTIFICATION_MESSAGES.NOT_FOUND, 404);
    }
    return notification;
  },

  async create(input: CreateNotificationInput): Promise<NotificationWithUser> {
    const data: Prisma.NotificationUncheckedCreateInput = {
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      channel: input.channel ?? "IN_APP",
      priority: input.priority ?? NOTIFICATION.DEFAULT_PRIORITY,
      isRead: false,
    };
    if (input.data !== undefined) data.data = input.data as Prisma.InputJsonValue;

    return notificationRepository.create(data);
  },

  async markRead(id: string, userId: string, role: UserRole): Promise<NotificationWithUser> {
    await this.getById(id, userId, role);
    return notificationRepository.markRead(id);
  },

  async markAllRead(userId: string): Promise<void> {
    await notificationRepository.markAllRead(userId);
  },

  async remove(id: string, userId: string, role: UserRole): Promise<void> {
    await this.getById(id, userId, role);
    await notificationRepository.remove(id);
  },
};