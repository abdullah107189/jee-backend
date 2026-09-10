import { fail, pass, type ValidationResult } from "../../utils/validation";
import type { CreateActivityInput } from "./activity-log.type";

export function validateCreateActivityInput(data: unknown): ValidationResult<CreateActivityInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;

  if (typeof body.activity !== "string" || body.activity.trim() === "") {
    return fail(["Activity is required"]);
  }

  return pass({
    activity: (body.activity as string).trim(),
    description: body.description !== undefined && body.description !== null ? String(body.description) : undefined,
    data: body.data !== undefined ? body.data : undefined,
  });
}