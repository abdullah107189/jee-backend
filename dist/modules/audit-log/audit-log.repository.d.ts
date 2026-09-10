import type { AuditSeverity, Prisma } from "../../../prisma/generated/prisma/client";
export interface FindAuditLogsParams {
    userId?: string;
    action?: string;
    entity?: string;
    entityId?: string;
    severity?: AuditSeverity;
    from?: Date;
    to?: Date;
    skip: number;
    take: number;
}
export declare const auditLogRepository: {
    findMany(params: FindAuditLogsParams): Prisma.PrismaPromise<({
        user: {
            email: string;
            id: string;
        };
    } & {
        id: string;
        userId: string;
        action: string;
        entity: string;
        entityId: string;
        changes: import("@prisma/client/runtime/client").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        severity: AuditSeverity;
        createdAt: Date;
    })[]>;
    count(params: Omit<FindAuditLogsParams, "skip" | "take">): Prisma.PrismaPromise<number>;
    findById(id: string): Prisma.Prisma__AuditLogClient<({
        user: {
            email: string;
            id: string;
        };
    } & {
        id: string;
        userId: string;
        action: string;
        entity: string;
        entityId: string;
        changes: import("@prisma/client/runtime/client").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        severity: AuditSeverity;
        createdAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    create(data: Prisma.AuditLogUncheckedCreateInput): Prisma.Prisma__AuditLogClient<{
        user: {
            email: string;
            id: string;
        };
    } & {
        id: string;
        userId: string;
        action: string;
        entity: string;
        entityId: string;
        changes: import("@prisma/client/runtime/client").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        severity: AuditSeverity;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    statsGroupByEntity(): Prisma.GetAuditLogGroupByPayload<{
        by: "entity"[];
        _count: {
            _all: true;
        };
    }>;
    statsGroupByAction(): Prisma.GetAuditLogGroupByPayload<{
        by: "action"[];
        _count: {
            _all: true;
        };
    }>;
};
