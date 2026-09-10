import { ok, paginated, parsePagination, queryDate, queryString } from "../../utils/api";
import { AUDIT_LOG, AUDIT_LOG_MESSAGES } from "./audit-log.constant";
import { auditLogService } from "./audit-log.service";
import { validateCreateAuditLogInput } from "./audit-log.validation";
function sendValidationError(res, errors) {
    return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}
export const auditLogController = {
    async list(req, res) {
        const { page, limit, skip, take } = parsePagination(req.query, AUDIT_LOG.DEFAULT_PAGE_SIZE);
        const userId = queryString(req.query.userId);
        const action = queryString(req.query.action);
        const entity = queryString(req.query.entity);
        const entityId = queryString(req.query.entityId);
        const severity = queryString(req.query.severity);
        const from = queryDate(req.query.from);
        const to = queryDate(req.query.to);
        const { items, total } = await auditLogService.list({
            userId, action, entity, entityId, severity, from, to, page, limit, skip, take,
        });
        return paginated(res, items, page, limit, total, "Audit logs retrieved successfully");
    },
    async stats(req, res) {
        const stats = await auditLogService.stats();
        return ok(res, stats);
    },
    async getById(req, res) {
        const log = await auditLogService.getById(String(req.params.id));
        return ok(res, log);
    },
    async create(req, res) {
        const result = validateCreateAuditLogInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const log = await auditLogService.create(result.value);
        return res.status(201).json({ status: "success", message: AUDIT_LOG_MESSAGES.CREATED, data: log });
    },
};
//# sourceMappingURL=audit-log.controller.js.map