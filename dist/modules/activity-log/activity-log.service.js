import { AppError } from "../../middleware/error.middleware";
import { ACTIVITY_LOG_MESSAGES } from "./activity-log.constant";
import { activityLogRepository } from "./activity-log.repository";
export const activityLogService = {
    async list(query, viewer) {
        // Non-admins can only ever see their own activity.
        const scopedUserId = viewer && viewer.role !== "ADMIN" ? viewer.userId : query.userId;
        const params = {
            userId: scopedUserId,
            search: query.search,
            from: query.from,
            to: query.to,
            skip: query.skip,
            take: query.take,
        };
        const [items, total] = await Promise.all([activityLogRepository.findMany(params), activityLogRepository.count(params)]);
        return { items, total };
    },
    async getById(id, viewer) {
        const log = await activityLogRepository.findById(id);
        if (!log)
            throw new AppError(ACTIVITY_LOG_MESSAGES.NOT_FOUND, 404);
        if (viewer && viewer.role !== "ADMIN" && log.userId !== viewer.userId) {
            throw new AppError(ACTIVITY_LOG_MESSAGES.NOT_FOUND, 404);
        }
        return log;
    },
    async create(userId, input) {
        const data = {
            userId,
            activity: input.activity,
        };
        if (input.description !== undefined)
            data.description = input.description;
        if (input.data !== undefined)
            data.data = input.data;
        return activityLogRepository.create(data);
    },
};
//# sourceMappingURL=activity-log.service.js.map