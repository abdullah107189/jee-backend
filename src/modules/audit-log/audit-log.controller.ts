import type { Request, Response } from "express";
import type { AuditSeverity } from "../../../prisma/generated/prisma/client";
import { ok, paginated, parsePagination, queryDate, queryString } from "../../utils/api";
import { AUDIT_LOG, AUDIT_LOG_MESSAGES } from "./audit-log.constant";
import { auditLogService } from "./audit-log.service";
import { validateCreateAuditLogInput } from "./audit-log.validation";

function sendValidationError(res: Response, errors: string[]): Response {
  return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}

export const auditLogController = {
  async list(req: Request, res: Response) {
    const { page, limit, skip, take } = parsePagination(req.query as Record<string, unknown>, AUDIT_LOG.DEFAULT_PAGE_SIZE);
    const userId = queryString(req.query.userId);
    const action = queryString(req.query.action);
    const entity = queryString(req.query.entity);
    const entityId = queryString(req.query.entityId);
    const severity = queryString(req.query.severity) as AuditSeverity | undefined;
    const from = queryDate(req.query.from);
    const to = queryDate(req.query.to);

    const { items, total } = await auditLogService.list({
      userId, action, entity, entityId, severity, from, to, page, limit, skip, take,
    });
    return paginated(res, items, page, limit, total, "Audit logs retrieved successfully");
  },

  async stats(req: Request, res: Response) {
    const stats = await auditLogService.stats();
    return ok(res, stats);
  },

  async getById(req: Request, res: Response) {
    const log = await auditLogService.getById(String(req.params.id));
    return ok(res, log);
  },

  async create(req: Request, res: Response) {
    const result = validateCreateAuditLogInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const log = await auditLogService.create(result.value);
    return res.status(201).json({ status: "success", message: AUDIT_LOG_MESSAGES.CREATED, data: log });
  },
};