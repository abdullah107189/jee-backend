import type { UserRole } from "../../../prisma/generated/prisma/client";
import type { CreateNotificationInput, ListNotificationsResult, NotificationQuery, NotificationWithUser } from "./notification.type";
export declare const notificationService: {
    list(userId: string, query: NotificationQuery): Promise<ListNotificationsResult>;
    getById(id: string, userId: string, role: UserRole): Promise<NotificationWithUser>;
    create(input: CreateNotificationInput): Promise<NotificationWithUser>;
    markRead(id: string, userId: string, role: UserRole): Promise<NotificationWithUser>;
    markAllRead(userId: string): Promise<void>;
    remove(id: string, userId: string, role: UserRole): Promise<void>;
};
