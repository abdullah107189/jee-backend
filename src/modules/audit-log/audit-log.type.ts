import type { AuditSeverity, Prisma } from "../../../prisma/generated/prisma/client";

export const AUDIT_LOG_INCLUDE = {
  user: { select: { id: true, email: true } },
} satisfies Prisma.AuditLogInclude;

export type AuditLogWithUser = Prisma.AuditLogGetPayload<{ include: typeof AUDIT_LOG_INCLUDE }>;

export interface CreateAuditLogInput {
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: unknown;
  severity?: AuditSeverity;
}

export type AuditLogQuery = {
  userId?: string;
  action?: string;
  entity?: string;
  entityId?: string;
  severity?: AuditSeverity;
  from?: Date;
  to?: Date;
  page: number;
  limit: number;
  skip: number;
  take: number;
};

export interface ListAuditLogsResult {
  items: AuditLogWithUser[];
  total: number;
}