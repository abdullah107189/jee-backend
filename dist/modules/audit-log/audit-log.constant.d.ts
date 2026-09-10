import type { AuditSeverity } from "../../../prisma/generated/prisma/client";
export declare const AUDIT_SEVERITIES: readonly AuditSeverity[];
export declare const AUDIT_LOG: {
    readonly DEFAULT_PAGE_SIZE: 20;
    readonly MAX_PAGE_SIZE: 100;
};
export declare const AUDIT_LOG_MESSAGES: {
    readonly NOT_FOUND: "Audit log not found";
    readonly CREATED: "Audit log recorded successfully";
};
