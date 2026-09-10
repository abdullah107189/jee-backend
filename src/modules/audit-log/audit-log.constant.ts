import type { AuditSeverity } from "../../../prisma/generated/prisma/client";

export const AUDIT_SEVERITIES: readonly AuditSeverity[] = ["INFO", "WARNING", "ERROR", "CRITICAL"];

export const AUDIT_LOG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const AUDIT_LOG_MESSAGES = {
  NOT_FOUND: "Audit log not found",
  CREATED: "Audit log recorded successfully",
} as const;