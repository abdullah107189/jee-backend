import type { Request, Response } from "express";
import type { UserRole } from "../../../prisma/generated/prisma/client";
import { AppError } from "../../middleware/error.middleware";
import { ok, paginated, parsePagination, queryDate, queryString } from "../../utils/api";
import { ACTIVITY_LOG, ACTIVITY_LOG_MESSAGES } from "./activity-log.constant";
import { activityLogService } from "./activity-log.service";
import { validateCreateActivityInput } from "./activity-log.validation";

function sendValidationError(res: Response, errors: string[]): Response {
  return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}

export const activityLogController = {
  async list(req: Request, res: Response) {
    const { page, limit, skip, take } = parsePagination(req.query as Record<string, unknown>, ACTIVITY_LOG.DEFAULT_PAGE_SIZE);
    const userId = queryString(req.query.userId);
    const search = queryString(req.query.search);
    const from = queryDate(req.query.from);
    const to = queryDate(req.query.to);

    const viewer = req.user ? { role: req.user.role as UserRole, userId: req.user.id } : undefined;
    const { items, total } = await activityLogService.list({ userId, search, from, to, page, limit, skip, take }, viewer);
    return paginated(res, items, page, limit, total, "Activity logs retrieved successfully");
  },

  async getById(req: Request, res: Response) {
    const viewer = req.user ? { role: req.user.role as UserRole, userId: req.user.id } : undefined;
    const log = await activityLogService.getById(String(req.params.id), viewer);
    return ok(res, log);
  },

  async create(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    const result = validateCreateActivityInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const log = await activityLogService.create(req.user.id, result.value);
    return res.status(201).json({ status: "success", message: ACTIVITY_LOG_MESSAGES.CREATED, data: log });
  },
};