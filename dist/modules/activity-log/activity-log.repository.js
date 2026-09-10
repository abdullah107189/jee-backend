import { prisma } from "../../../lib/prisma";
import { ACTIVITY_LOG_INCLUDE } from "./activity-log.type";
function buildWhere(params) {
    const where = {};
    if (params.userId)
        where.userId = params.userId;
    if (params.from || params.to) {
        where.createdAt = {
            ...(params.from ? { gte: params.from } : {}),
            ...(params.to ? { lte: params.to } : {}),
        };
    }
    if (params.search) {
        where.OR = [{ activity: { contains: params.search, mode: "insensitive" } }];
    }
    return where;
}
export const activityLogRepository = {
    findMany(params) {
        return prisma.activityLog.findMany({
            where: buildWhere(params),
            include: ACTIVITY_LOG_INCLUDE,
            skip: params.skip,
            take: params.take,
            orderBy: { createdAt: "desc" },
        });
    },
    count(params) {
        return prisma.activityLog.count({ where: buildWhere(params) });
    },
    findById(id) {
        return prisma.activityLog.findUnique({ where: { id }, include: ACTIVITY_LOG_INCLUDE });
    },
    create(data) {
        return prisma.activityLog.create({ data, include: ACTIVITY_LOG_INCLUDE });
    },
};
//# sourceMappingURL=activity-log.repository.js.map