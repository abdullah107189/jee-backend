import type { AuditLogQuery, AuditLogWithUser, CreateAuditLogInput, ListAuditLogsResult } from "./audit-log.type";
export declare const auditLogService: {
    list(query: AuditLogQuery): Promise<ListAuditLogsResult>;
    getById(id: string): Promise<AuditLogWithUser>;
    create(input: CreateAuditLogInput): Promise<AuditLogWithUser>;
    stats(): Promise<{
        byEntity: {
            entity: string;
            count: number;
        }[];
        byAction: {
            action: string;
            count: number;
        }[];
    }>;
};
