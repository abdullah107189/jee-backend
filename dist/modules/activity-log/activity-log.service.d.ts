import type { UserRole } from "../../../prisma/generated/prisma/client";
import type { ActivityLogQuery, ActivityLogWithUser, CreateActivityInput, ListActivityLogsResult } from "./activity-log.type";
export declare const activityLogService: {
    list(query: ActivityLogQuery, viewer?: {
        role: UserRole;
        userId: string;
    }): Promise<ListActivityLogsResult>;
    getById(id: string, viewer?: {
        role: UserRole;
        userId: string;
    }): Promise<ActivityLogWithUser>;
    create(userId: string, input: CreateActivityInput): Promise<ActivityLogWithUser>;
};
