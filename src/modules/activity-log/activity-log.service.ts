import type { Prisma, UserRole } from "../../../prisma/generated/prisma/client";
import { AppError } from "../../middleware/error.middleware";
import { ACTIVITY_LOG_MESSAGES } from "./activity-log.constant";
import { activityLogRepository } from "./activity-log.repository";
import type {
  ActivityLogQuery,
  ActivityLogWithUser,
  CreateActivityInput,
  ListActivityLogsResult,
} from "./activity-log.type";

export const activityLogService = {
  async list(query: ActivityLogQuery, viewer?: { role: UserRole; userId: string }): Promise<ListActivityLogsResult> {
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

  async getById(id: string, viewer?: { role: UserRole; userId: string }): Promise<ActivityLogWithUser> {
    const log = await activityLogRepository.findById(id);
    if (!log) throw new AppError(ACTIVITY_LOG_MESSAGES.NOT_FOUND, 404);
    if (viewer && viewer.role !== "ADMIN" && log.userId !== viewer.userId) {
      throw new AppError(ACTIVITY_LOG_MESSAGES.NOT_FOUND, 404);
    }
    return log;
  },

  async create(userId: string, input: CreateActivityInput): Promise<ActivityLogWithUser> {
    const data: Prisma.ActivityLogUncheckedCreateInput = {
      userId,
      activity: input.activity,
    };
    if (input.description !== undefined) data.description = input.description;
    if (input.data !== undefined) data.data = input.data as Prisma.InputJsonValue;

    return activityLogRepository.create(data);
  },
};