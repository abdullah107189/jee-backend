import type { Request, Response } from "express";
import type { NotificationType, UserRole } from "../../../prisma/generated/prisma/client";
import AppError  from "../../errors/AppError";
import { noContent, ok, paginated, parsePagination, queryString } from "../../utils/api";
import { toBoolean } from "../../utils/validation";
import { NOTIFICATION, NOTIFICATION_MESSAGES } from "./notification.constant";
import { notificationService } from "./notification.service";
import { validateCreateNotificationInput } from "./notification.validation";

function sendValidationError(res: Response, errors: string[]): Response {
  return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}

export const notificationController = {
  async list(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    const { page, limit, skip, take } = parsePagination(req.query as Record<string, unknown>, NOTIFICATION.DEFAULT_PAGE_SIZE);
    const isRead = req.query.isRead !== undefined ? toBoolean(req.query.isRead) : undefined;
    const type = queryString(req.query.type) as NotificationType | undefined;

    const data = await notificationService.list(req.user.id, { isRead, type, page, limit, skip, take });
    return paginated(res, data.items, page, limit, data.total, "Notifications retrieved successfully");
  },

  async getById(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    const notification = await notificationService.getById(String(req.params.id), req.user.id, req.user.role as UserRole);
    return ok(res, notification);
  },

  async create(req: Request, res: Response) {
    const result = validateCreateNotificationInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const notification = await notificationService.create(result.value);
    return res.status(201).json({ status: "success", message: NOTIFICATION_MESSAGES.CREATED, data: notification });
  },

  async markRead(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    const notification = await notificationService.markRead(String(req.params.id), req.user.id, req.user.role as UserRole);
    return ok(res, notification, NOTIFICATION_MESSAGES.MARKED_READ);
  },

  async markAllRead(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    await notificationService.markAllRead(req.user.id);
    return ok(res, null, NOTIFICATION_MESSAGES.MARKED_ALL_READ);
  },

  async remove(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    await notificationService.remove(String(req.params.id), req.user.id, req.user.role as UserRole);
    return noContent(res);
  },
};