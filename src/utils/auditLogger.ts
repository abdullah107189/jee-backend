import { auditLogService } from "../modules/audit-log/audit-log.service";
import type { AuditSeverity } from "../../prisma/generated/prisma/client";

export interface LogAuditParams {
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: unknown;
  severity?: AuditSeverity;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: unknown;
}

/**
 * High-performance, non-blocking audit logging utility.
 * Logs are fired asynchronously in the background so they never slow down or fail the primary request.
 */
export function logAudit(params: LogAuditParams): void {
  auditLogService
    .create({
      userId: params.userId,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      changes: params.changes,
      severity: params.severity ?? "INFO",
      ipAddress: params.ipAddress ?? null,
      userAgent: params.userAgent ?? null,
      metadata: params.metadata,
    })
    .catch((err) => {
      console.warn(`[AuditLog] Failed to record audit log for action ${params.action}:`, err?.message || err);
    });
}

