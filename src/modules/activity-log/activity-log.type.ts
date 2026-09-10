import type { Prisma } from "../../../prisma/generated/prisma/client";

export const ACTIVITY_LOG_INCLUDE = {
  user: { select: { id: true, email: true, firstName: true, lastName: true } },
} satisfies Prisma.ActivityLogInclude;

export type ActivityLogWithUser = Prisma.ActivityLogGetPayload<{ include: typeof ACTIVITY_LOG_INCLUDE }>;

export interface CreateActivityInput {
  activity: string;
  description?: string | null;
  data?: unknown;
}

export interface ActivityLogQuery {
  userId?: string;
  search?: string;
  from?: Date;
  to?: Date;
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface ListActivityLogsResult {
  items: ActivityLogWithUser[];
  total: number;
}