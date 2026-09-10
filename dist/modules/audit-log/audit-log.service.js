import { AppError } from "../../middleware/error.middleware";
import { AUDIT_LOG_MESSAGES } from "./audit-log.constant";
import { auditLogRepository } from "./audit-log.repository";
export const auditLogService = {
    async list(query) {
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
    async getById(id) {
        const log = await auditLogRepository.findById(id);
        if (!log)
            throw new AppError(AUDIT_LOG_MESSAGES.NOT_FOUND, 404);
        return log;
    },
    async create(input) {
        const data = {
            userId: input.userId,
            action: input.action,
            entity: input.entity,
            entityId: input.entityId,
            severity: input.severity ?? "INFO",
        };
        if (input.changes !== undefined)
            data.changes = input.changes;
        if (input.ipAddress !== undefined)
            data.ipAddress = input.ipAddress;
        if (input.userAgent !== undefined)
            data.userAgent = input.userAgent;
        if (input.metadata !== undefined)
            data.metadata = input.metadata;
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
//# sourceMappingURL=audit-log.service.js.map