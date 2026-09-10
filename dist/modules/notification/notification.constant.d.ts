import type { NotificationChannel, NotificationType } from "../../../prisma/generated/prisma/client";
export declare const NOTIFICATION_TYPES: readonly NotificationType[];
export declare const NOTIFICATION_CHANNELS: readonly NotificationChannel[];
export declare const NOTIFICATION: {
    readonly DEFAULT_PAGE_SIZE: 20;
    readonly MAX_PAGE_SIZE: 100;
    /** LOW, MEDIUM, HIGH, URGENT */
    readonly DEFAULT_PRIORITY: "MEDIUM";
};
export declare const NOTIFICATION_MESSAGES: {
    readonly NOT_FOUND: "Notification not found";
    readonly CREATED: "Notification sent successfully";
    readonly MARKED_READ: "Notification marked as read";
    readonly MARKED_ALL_READ: "All notifications marked as read";
    readonly DELETED: "Notification removed successfully";
};
