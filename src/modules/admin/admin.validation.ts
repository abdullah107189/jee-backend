import { fail, isEmail, pass, type ValidationResult } from "../../utils/validation";
import type { CreateAdminInput, UpdateAdminInput } from "./admin.type";

const MIN_PASSWORD = 6;
const MAX_PASSWORD = 128;

function isStringArray(value: unknown): boolean {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function validateCreateAdminInput(data: unknown): ValidationResult<CreateAdminInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (typeof body.email !== "string" || !isEmail(body.email)) errors.push("A valid email address is required");
  if (
    typeof body.password !== "string" ||
    body.password.length < MIN_PASSWORD ||
    body.password.length > MAX_PASSWORD
  ) {
    errors.push(`Password must be between ${MIN_PASSWORD} and ${MAX_PASSWORD} characters`);
  }
  if (typeof body.firstName !== "string" || body.firstName.trim() === "") errors.push("First name is required");
  if (typeof body.lastName !== "string" || body.lastName.trim() === "") errors.push("Last name is required");
  if (body.permissions !== undefined && !isStringArray(body.permissions)) {
    errors.push("Permissions must be an array of strings");
  }

  if (errors.length > 0) return fail(errors);

  return pass({
    email: (body.email as string).trim().toLowerCase(),
    password: body.password as string,
    firstName: (body.firstName as string).trim(),
    lastName: (body.lastName as string).trim(),
    phone: body.phone !== undefined && (body.phone as string).trim() !== "" ? (body.phone as string).trim() : undefined,
    permissions: body.permissions !== undefined ? (body.permissions as string[]) : undefined,
  });
}

export function validateUpdateAdminInput(data: unknown): ValidationResult<UpdateAdminInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;

  if (body.permissions === undefined) return fail(["At least one field must be provided"]);
  if (!isStringArray(body.permissions)) return fail(["Permissions must be an array of strings"]);

  return pass({ permissions: body.permissions as string[] });
}