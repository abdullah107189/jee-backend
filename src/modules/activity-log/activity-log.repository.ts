import { prisma } from "../../lib/prisma";
import type { Prisma } from "../../../prisma/generated/prisma/client";
import { ACTIVITY_LOG_INCLUDE } from "./activity-log.type";

export interface FindActivityLogsParams {
  userId?: string;
  search?: string;
  from?: Date;
  to?: Date;
  skip: number;
  take: number;
}

function buildWhere(params: Omit<FindActivityLogsParams, "skip" | "take">): Prisma.ActivityLogWhereInput {
  const where: Prisma.ActivityLogWhereInput = {};
  if (params.userId) where.userId = params.userId;

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
  findMany(params: FindActivityLogsParams) {
    return prisma.activityLog.findMany({
      where: buildWhere(params),
      include: ACTIVITY_LOG_INCLUDE,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  },

  count(params: Omit<FindActivityLogsParams, "skip" | "take">) {
    return prisma.activityLog.count({ where: buildWhere(params) });
  },

  findById(id: string) {
    return prisma.activityLog.findUnique({ where: { id }, include: ACTIVITY_LOG_INCLUDE });
  },

  create(data: Prisma.ActivityLogUncheckedCreateInput) {
    return prisma.activityLog.create({ data, include: ACTIVITY_LOG_INCLUDE });
  },
};