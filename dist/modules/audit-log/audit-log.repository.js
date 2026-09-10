import { prisma } from "../../../lib/prisma";
import { AUDIT_LOG_INCLUDE } from "./audit-log.type";
function buildWhere(params) {
    const where = {};
    if (params.userId)
        where.userId = params.userId;
    if (params.action)
        where.action = params.action;
    if (params.entity)
        where.entity = params.entity;
    if (params.entityId)
        where.entityId = params.entityId;
    if (params.severity)
        where.severity = params.severity;
    if (params.from || params.to) {
        where.createdAt = {
            ...(params.from ? { gte: params.from } : {}),
            ...(params.to ? { lte: params.to } : {}),
        };
    }
    return where;
}
export const auditLogRepository = {
    findMany(params) {
        return prisma.auditLog.findMany({
            where: buildWhere(params),
            include: AUDIT_LOG_INCLUDE,
            skip: params.skip,
            take: params.take,
            orderBy: { createdAt: "desc" },
        });
    },
    count(params) {
        return prisma.auditLog.count({ where: buildWhere(params) });
    },
    findById(id) {
        return prisma.auditLog.findUnique({ where: { id }, include: AUDIT_LOG_INCLUDE });
    },
    create(data) {
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
//# sourceMappingURL=audit-log.repository.js.map