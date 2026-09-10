import {
  fail,
  isEmail,
  pass,
  type ValidationResult,
} from "../../utils/validation";
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "./auth.type";

const MIN_PASSWORD = 6;
const MAX_PASSWORD = 128;

export function validateRegisterInput(data: unknown): ValidationResult<RegisterInput> {
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
  if (body.phone !== undefined && typeof body.phone !== "string") errors.push("Phone must be a string");

  if (errors.length > 0) return fail(errors);

  return pass({
    email: (body.email as string).trim().toLowerCase(),
    password: body.password as string,
    firstName: (body.firstName as string).trim(),
    lastName: (body.lastName as string).trim(),
    phone: body.phone !== undefined ? (body.phone as string).trim() : undefined,
  });
}

export function validateLoginInput(data: unknown): ValidationResult<LoginInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (typeof body.identifier !== "string" || body.identifier.trim() === "") {
    errors.push("Email or phone number is required");
  }
  if (typeof body.password !== "string" || body.password === "") errors.push("Password is required");

  if (errors.length > 0) return fail(errors);

  return pass({
    identifier: (body.identifier as string).trim(),
    password: body.password as string,
  });
}

export function validateChangePasswordInput(data: unknown): ValidationResult<ChangePasswordInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (typeof body.oldPassword !== "string" || body.oldPassword === "") errors.push("Current password is required");
  if (
    typeof body.newPassword !== "string" ||
    body.newPassword.length < MIN_PASSWORD ||
    body.newPassword.length > MAX_PASSWORD
  ) {
    errors.push(`New password must be between ${MIN_PASSWORD} and ${MAX_PASSWORD} characters`);
  }

  if (errors.length > 0) return fail(errors);

  return pass({
    oldPassword: body.oldPassword as string,
    newPassword: body.newPassword as string,
  });
}

export function validateForgotPasswordInput(data: unknown): ValidationResult<ForgotPasswordInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;

  if (typeof body.email !== "string" || !isEmail(body.email)) return fail(["A valid email address is required"]);

  return pass({ email: (body.email as string).trim().toLowerCase() });
}

export function validateResetPasswordInput(data: unknown): ValidationResult<ResetPasswordInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (typeof body.token !== "string" || body.token === "") errors.push("Reset token is required");
  if (
    typeof body.newPassword !== "string" ||
    body.newPassword.length < MIN_PASSWORD ||
    body.newPassword.length > MAX_PASSWORD
  ) {
    errors.push(`New password must be between ${MIN_PASSWORD} and ${MAX_PASSWORD} characters`);
  }

  if (errors.length > 0) return fail(errors);

  return pass({
    token: body.token as string,
    newPassword: body.newPassword as string,
  });
}