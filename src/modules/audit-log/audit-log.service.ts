import type { Prisma } from "../../../prisma/generated/prisma/client";
import { AppError } from "../../middleware/error.middleware";
import { AUDIT_LOG_MESSAGES } from "./audit-log.constant";
import { auditLogRepository } from "./audit-log.repository";
import type {
  AuditLogQuery,
  AuditLogWithUser,
  CreateAuditLogInput,
  ListAuditLogsResult,
} from "./audit-log.type";

export const auditLogService = {
  async list(query: AuditLogQuery): Promise<ListAuditLogsResult> {
    const params = {
      userId: query.userId,
      action: query.action,
      entity: query.entity,
      entityId: query.entityId,
      severity: query.severity,
      from: query.from,
      to: query.to,
      skip: query.skip,
      take: query.take,
    };
    const [items, total] = await Promise.all([auditLogRepository.findMany(params), auditLogRepository.count(params)]);
    return { items, total };
  },

  async getById(id: string): Promise<AuditLogWithUser> {
    const log = await auditLogRepository.findById(id);
    if (!log) throw new AppError(AUDIT_LOG_MESSAGES.NOT_FOUND, 404);
    return log;
  },

  async create(input: CreateAuditLogInput): Promise<AuditLogWithUser> {
    const data: Prisma.AuditLogUncheckedCreateInput = {
      userId: input.userId,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      severity: input.severity ?? "INFO",
    };
    if (input.changes !== undefined) data.changes = input.changes as Prisma.InputJsonValue;
    if (input.ipAddress !== undefined) data.ipAddress = input.ipAddress;
    if (input.userAgent !== undefined) data.userAgent = input.userAgent;
    if (input.metadata !== undefined) data.metadata = input.metadata as Prisma.InputJsonValue;

    return auditLogRepository.create(data);
  },

  async stats() {
    const [byEntity, byAction] = await Promise.all([
      auditLogRepository.statsGroupByEntity(),
      auditLogRepository.statsGroupByAction(),
    ]);
    return {
      byEntity: byEntity.map((row) => ({ entity: row.entity, count: row._count._all })),
      byAction: byAction.map((row) => ({ action: row.action, count: row._count._all })),
    };
  },
};