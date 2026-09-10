import type { Prisma } from "../../../prisma/generated/prisma/client";
export interface FindActivityLogsParams {
    userId?: string;
    search?: string;
    from?: Date;
    to?: Date;
    skip: number;
    take: number;
}
export declare const activityLogRepository: {
    findMany(params: FindActivityLogsParams): Prisma.PrismaPromise<({
        user: {
            email: string;
            firstName: string;
            id: string;
            lastName: string;
        };
    } & {
        id: string;
        userId: string;
        activity: string;
        description: string | null;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
    })[]>;
    count(params: Omit<FindActivityLogsParams, "skip" | "take">): Prisma.PrismaPromise<number>;
    findById(id: string): Prisma.Prisma__ActivityLogClient<({
        user: {
            email: string;
            firstName: string;
            id: string;
            lastName: string;
        };
    } & {
        id: string;
        userId: string;
        activity: string;
        description: string | null;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    create(data: Prisma.ActivityLogUncheckedCreateInput): Prisma.Prisma__ActivityLogClient<{
        user: {
            email: string;
            firstName: string;
            id: string;
            lastName: string;
        };
    } & {
        id: string;
        userId: string;
        activity: string;
        description: string | null;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
};
