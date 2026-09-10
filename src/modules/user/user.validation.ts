import type { Prisma, UserRole } from "../../../prisma/generated/prisma/client";
import { fail, isEmail, pass, toBoolean, type ValidationResult } from "../../utils/validation";
import { USER_ROLES } from "./user.constant";
import type { CreateUserInput } from "./user.type";

const MIN_PASSWORD = 6;
const MAX_PASSWORD = 128;

function isKnownRole(value: unknown): boolean {
  return typeof value === "string" && (USER_ROLES as readonly string[]).includes(value);
}

export function validateCreateUserInput(data: unknown): ValidationResult<CreateUserInput> {
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
  if (!isKnownRole(body.role)) errors.push("Role must be one of: ADMIN, SELLER, CUSTOMER");
  if (body.phone !== undefined && body.phone !== null && typeof body.phone !== "string") {
    errors.push("Phone must be a string or null");
  }

  if (errors.length > 0) return fail(errors);

  const input: CreateUserInput = {
    email: (body.email as string).trim().toLowerCase(),
    password: body.password as string,
    firstName: (body.firstName as string).trim(),
    lastName: (body.lastName as string).trim(),
    role: body.role as UserRole,
  };
  if (typeof body.phone === "string" && body.phone.trim() !== "") input.phone = body.phone.trim();
  if (body.isVerified !== undefined) input.isVerified = toBoolean(body.isVerified);
  if (body.isActive !== undefined) input.isActive = toBoolean(body.isActive);

  return pass(input);
}

export function validateUpdateUserInput(data: unknown): ValidationResult<Prisma.UserUpdateInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (body.email !== undefined && (typeof body.email !== "string" || !isEmail(body.email))) {
    errors.push("Email must be a valid email address");
  }
  if (
    body.password !== undefined &&
    (typeof body.password !== "string" ||
      body.password.length < MIN_PASSWORD ||
      body.password.length > MAX_PASSWORD)
  ) {
    errors.push(`Password must be between ${MIN_PASSWORD} and ${MAX_PASSWORD} characters`);
  }
  if (body.firstName !== undefined && (typeof body.firstName !== "string" || body.firstName.trim() === "")) {
    errors.push("First name must be a non-empty string");
  }
  if (body.lastName !== undefined && (typeof body.lastName !== "string" || body.lastName.trim() === "")) {
    errors.push("Last name must be a non-empty string");
  }
  if (body.role !== undefined && !isKnownRole(body.role)) {
    errors.push("Role must be one of: ADMIN, SELLER, CUSTOMER");
  }
  if (body.phone !== undefined && body.phone !== null && typeof body.phone !== "string") {
    errors.push("Phone must be a string or null");
  }

  if (errors.length > 0) return fail(errors);

  const input: Prisma.UserUpdateInput = {};
  if (body.email !== undefined) input.email = (body.email as string).trim().toLowerCase();
  if (body.password !== undefined) input.password = body.password as string;
  if (body.firstName !== undefined) input.firstName = (body.firstName as string).trim();
  if (body.lastName !== undefined) input.lastName = (body.lastName as string).trim();
  if (body.role !== undefined) input.role = body.role as UserRole;
  if (body.phone === null) input.phone = null;
  else if (typeof body.phone === "string") input.phone = body.phone.trim();
  if (body.isVerified !== undefined) input.isVerified = toBoolean(body.isVerified);
  if (body.isActive !== undefined) input.isActive = toBoolean(body.isActive);

  if (Object.keys(input).length === 0) return fail(["At least one field must be provided"]);

  return pass(input);
}

export function validateProfileInput(data: unknown): ValidationResult<Prisma.UserUpdateInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (body.email !== undefined && (typeof body.email !== "string" || !isEmail(body.email))) {
    errors.push("Email must be a valid email address");
  }
  if (body.firstName !== undefined && (typeof body.firstName !== "string" || body.firstName.trim() === "")) {
    errors.push("First name must be a non-empty string");
  }
  if (body.lastName !== undefined && (typeof body.lastName !== "string" || body.lastName.trim() === "")) {
    errors.push("Last name must be a non-empty string");
  }
  if (body.phone !== undefined && body.phone !== null && typeof body.phone !== "string") {
    errors.push("Phone must be a string or null");
  }

  if (errors.length > 0) return fail(errors);

  const input: Prisma.UserUpdateInput = {};
  if (body.email !== undefined) input.email = (body.email as string).trim().toLowerCase();
  if (body.firstName !== undefined) input.firstName = (body.firstName as string).trim();
  if (body.lastName !== undefined) input.lastName = (body.lastName as string).trim();
  if (body.phone === null) input.phone = null;
  else if (typeof body.phone === "string") input.phone = body.phone.trim();

  if (Object.keys(input).length === 0) return fail(["At least one field must be provided"]);

  return pass(input);
}