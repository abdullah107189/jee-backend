import { prisma } from "../../../lib/prisma";
import type { NotificationType, Prisma } from "../../../prisma/generated/prisma/client";
import { NOTIFICATION_INCLUDE } from "./notification.type";

export interface FindNotificationsParams {
  userId: string;
  isRead?: boolean;
  type?: NotificationType;
  skip: number;
  take: number;
}

function buildWhere(params: Omit<FindNotificationsParams, "skip" | "take">): Prisma.NotificationWhereInput {
  const where: Prisma.NotificationWhereInput = { userId: params.userId };
  if (params.isRead !== undefined) where.isRead = params.isRead;
  if (params.type) where.type = params.type;
  return where;
}

export const notificationRepository = {
  findMany(params: FindNotificationsParams) {
    return prisma.notification.findMany({
      where: buildWhere(params),
      include: NOTIFICATION_INCLUDE,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(params: Omit<FindNotificationsParams, "skip" | "take">) {
    return prisma.notification.count({ where: buildWhere(params) });
  },

  countUnread(userId: string) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  },

  findById(id: string) {
    return prisma.notification.findUnique({ where: { id }, include: NOTIFICATION_INCLUDE });
  },

  create(data: Prisma.NotificationUncheckedCreateInput) {
    return prisma.notification.create({ data, include: NOTIFICATION_INCLUDE });
  },

  markRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
      include: NOTIFICATION_INCLUDE,
    });
  },

  markAllRead(userId: string) {
    return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true, readAt: new Date() } });
  },

  remove(id: string) {
    return prisma.notification.delete({ where: { id } });
  },
};