import { prisma } from "../../../lib/prisma";
import type { AuditSeverity, Prisma } from "../../../prisma/generated/prisma/client";
import { AUDIT_LOG_INCLUDE } from "./audit-log.type";

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

function buildWhere(params: Omit<FindAuditLogsParams, "skip" | "take">): Prisma.AuditLogWhereInput {
  const where: Prisma.AuditLogWhereInput = {};
  if (params.userId) where.userId = params.userId;
  if (params.action) where.action = params.action;
  if (params.entity) where.entity = params.entity;
  if (params.entityId) where.entityId = params.entityId;
  if (params.severity) where.severity = params.severity;

  if (params.from || params.to) {
    where.createdAt = {
      ...(params.from ? { gte: params.from } : {}),
      ...(params.to ? { lte: params.to } : {}),
    };
  }

  return where;
}

export const auditLogRepository = {
  findMany(params: FindAuditLogsParams) {
    return prisma.auditLog.findMany({
      where: buildWhere(params),
      include: AUDIT_LOG_INCLUDE,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(params: Omit<FindAuditLogsParams, "skip" | "take">) {
    return prisma.auditLog.count({ where: buildWhere(params) });
  },

  findById(id: string) {
    return prisma.auditLog.findUnique({ where: { id }, include: AUDIT_LOG_INCLUDE });
  },

  create(data: Prisma.AuditLogUncheckedCreateInput) {
    return prisma.auditLog.create({ data, include: AUDIT_LOG_INCLUDE });
  },

  statsGroupByEntity() {
    return prisma.auditLog.groupBy({
      by: ["entity"],
      _count: { _all: true },
    });
  },

  statsGroupByAction() {
    return prisma.auditLog.groupBy({
      by: ["action"],
      _count: { _all: true },
    });
  },
};