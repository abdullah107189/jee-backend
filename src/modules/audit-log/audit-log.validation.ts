import { fail, pass, type ValidationResult } from "../../utils/validation";
import { AUDIT_SEVERITIES } from "./audit-log.constant";
import type { CreateAuditLogInput } from "./audit-log.type";

export function validateCreateAuditLogInput(data: unknown): ValidationResult<CreateAuditLogInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (typeof body.userId !== "string" || body.userId.trim() === "") errors.push("userId is required");
  if (typeof body.action !== "string" || body.action.trim() === "") errors.push("Action is required");
  if (typeof body.entity !== "string" || body.entity.trim() === "") errors.push("Entity is required");
  if (typeof body.entityId !== "string" || body.entityId.trim() === "") errors.push("entityId is required");
  if (body.severity !== undefined && !(AUDIT_SEVERITIES as readonly string[]).includes(body.severity as string)) {
    errors.push(`Severity must be one of: ${AUDIT_SEVERITIES.join(", ")}`);
  }

  if (errors.length > 0) return fail(errors);

  return pass({
    userId: (body.userId as string).trim(),
    action: (body.action as string).trim(),
    entity: (body.entity as string).trim(),
    entityId: (body.entityId as string).trim(),
    changes: body.changes !== undefined ? body.changes : undefined,
    ipAddress: body.ipAddress !== undefined && body.ipAddress !== null ? String(body.ipAddress) : undefined,
    userAgent: body.userAgent !== undefined && body.userAgent !== null ? String(body.userAgent) : undefined,
    metadata: body.metadata !== undefined ? body.metadata : undefined,
    severity: body.severity !== undefined ? (body.severity as CreateAuditLogInput["severity"]) : undefined,
  });
}