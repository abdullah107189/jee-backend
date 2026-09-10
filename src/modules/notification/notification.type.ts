import type { NotificationChannel, NotificationType, Prisma } from "../../../prisma/generated/prisma/client";

export const NOTIFICATION_INCLUDE = {
  user: { select: { id: true, email: true, firstName: true, lastName: true } },
} satisfies Prisma.NotificationInclude;

export type NotificationWithUser = Prisma.NotificationGetPayload<{ include: typeof NOTIFICATION_INCLUDE }>;

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: unknown;
  channel?: NotificationChannel;
  priority?: string;
}

export interface NotificationQuery {
  isRead?: boolean;
  type?: NotificationType;
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface ListNotificationsResult {
  items: NotificationWithUser[];
  total: number;
  unread: number;
}