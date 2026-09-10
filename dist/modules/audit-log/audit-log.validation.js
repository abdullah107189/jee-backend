import { fail, pass } from "../../utils/validation";
import { AUDIT_SEVERITIES } from "./audit-log.constant";
export function validateCreateAuditLogInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const errors = [];
    if (typeof body.userId !== "string" || body.userId.trim() === "")
        errors.push("userId is required");
    if (typeof body.action !== "string" || body.action.trim() === "")
        errors.push("Action is required");
    if (typeof body.entity !== "string" || body.entity.trim() === "")
        errors.push("Entity is required");
    if (typeof body.entityId !== "string" || body.entityId.trim() === "")
        errors.push("entityId is required");
    if (body.severity !== undefined && !AUDIT_SEVERITIES.includes(body.severity)) {
        errors.push(`Severity must be one of: ${AUDIT_SEVERITIES.join(", ")}`);
    }
    if (errors.length > 0)
        return fail(errors);
    return pass({
        userId: body.userId.trim(),
        action: body.action.trim(),
        entity: body.entity.trim(),
        entityId: body.entityId.trim(),
        changes: body.changes !== undefined ? body.changes : undefined,
        ipAddress: body.ipAddress !== undefined && body.ipAddress !== null ? String(body.ipAddress) : undefined,
        userAgent: body.userAgent !== undefined && body.userAgent !== null ? String(body.userAgent) : undefined,
        metadata: body.metadata !== undefined ? body.metadata : undefined,
        severity: body.severity !== undefined ? body.severity : undefined,
    });
}
//# sourceMappingURL=audit-log.validation.js.map