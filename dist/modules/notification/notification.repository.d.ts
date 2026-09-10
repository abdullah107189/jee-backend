import type { NotificationType, Prisma } from "../../../prisma/generated/prisma/client";
export interface FindNotificationsParams {
    userId: string;
    isRead?: boolean;
    type?: NotificationType;
    skip: number;
    take: number;
}
export declare const notificationRepository: {
    findMany(params: FindNotificationsParams): Prisma.PrismaPromise<({
        user: {
            email: string;
            firstName: string;
            id: string;
            lastName: string;
        };
    } & {
        id: string;
        userId: string;
        type: NotificationType;
        title: string;
        message: string;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        channel: import("../../../prisma/generated/prisma/enums").NotificationChannel;
        isRead: boolean;
        priority: string;
        sentAt: Date;
        readAt: Date | null;
        createdAt: Date;
    })[]>;
    count(params: Omit<FindNotificationsParams, "skip" | "take">): Prisma.PrismaPromise<number>;
    countUnread(userId: string): Prisma.PrismaPromise<number>;
    findById(id: string): Prisma.Prisma__NotificationClient<({
        user: {
            email: string;
            firstName: string;
            id: string;
            lastName: string;
        };
    } & {
        id: string;
        userId: string;
        type: NotificationType;
        title: string;
        message: string;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        channel: import("../../../prisma/generated/prisma/enums").NotificationChannel;
        isRead: boolean;
        priority: string;
        sentAt: Date;
        readAt: Date | null;
        createdAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    create(data: Prisma.NotificationUncheckedCreateInput): Prisma.Prisma__NotificationClient<{
        user: {
            email: string;
            firstName: string;
            id: string;
            lastName: string;
        };
    } & {
        id: string;
        userId: string;
        type: NotificationType;
        title: string;
        message: string;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        channel: import("../../../prisma/generated/prisma/enums").NotificationChannel;
        isRead: boolean;
        priority: string;
        sentAt: Date;
        readAt: Date | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    markRead(id: string): Prisma.Prisma__NotificationClient<{
        user: {
            email: string;
            firstName: string;
            id: string;
            lastName: string;
        };
    } & {
        id: string;
        userId: string;
        type: NotificationType;
        title: string;
        message: string;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        channel: import("../../../prisma/generated/prisma/enums").NotificationChannel;
        isRead: boolean;
        priority: string;
        sentAt: Date;
        readAt: Date | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    markAllRead(userId: string): Prisma.PrismaPromise<Prisma.BatchPayload>;
    remove(id: string): Prisma.Prisma__NotificationClient<{
        id: string;
        userId: string;
        type: NotificationType;
        title: string;
        message: string;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        channel: import("../../../prisma/generated/prisma/enums").NotificationChannel;
        isRead: boolean;
        priority: string;
        sentAt: Date;
        readAt: Date | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
};
