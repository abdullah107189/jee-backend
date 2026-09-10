import type { Prisma } from "../../../prisma/generated/prisma/client";
import { fail, isBoolean, isSlug, pass, toBoolean, type ValidationResult } from "../../utils/validation";
import type { CreateCategoryInput } from "./category.type";

export function validateCreateCategoryInput(data: unknown): ValidationResult<CreateCategoryInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (typeof body.name !== "string" || body.name.trim() === "") errors.push("Name is required");
  if (body.slug !== undefined && (typeof body.slug !== "string" || !isSlug(body.slug))) {
    errors.push("Slug must be a valid URL slug (lowercase letters, numbers and hyphens)");
  }
  if (body.level !== undefined && (typeof body.level !== "number" || !Number.isInteger(body.level) || body.level < 0)) {
    errors.push("Level must be a non-negative integer");
  }
  if (body.isActive !== undefined && !isBoolean(body.isActive)) errors.push("isActive must be a boolean");
  if (body.parentId !== undefined && body.parentId !== null && typeof body.parentId !== "string") {
    errors.push("parentId must be a string or null");
  }
  if (body.description !== undefined && body.description !== null && typeof body.description !== "string") {
    errors.push("description must be a string or null");
  }
  if (body.icon !== undefined && body.icon !== null && typeof body.icon !== "string") {
    errors.push("icon must be a string or null");
  }

  if (errors.length > 0) return fail(errors);

  return pass({
    name: (body.name as string).trim(),
    slug: body.slug !== undefined ? (body.slug as string).trim() : undefined,
    description: body.description !== undefined && body.description !== null ? String(body.description) : (body.description ?? undefined),
    parentId: body.parentId !== undefined && body.parentId !== null ? (body.parentId as string) : undefined,
    level: body.level !== undefined ? (body.level as number) : undefined,
    icon: body.icon !== undefined && body.icon !== null ? (body.icon as string) : undefined,
    isActive: body.isActive !== undefined ? toBoolean(body.isActive) : undefined,
  });
}

export function validateUpdateCategoryInput(data: unknown): ValidationResult<Prisma.CategoryUpdateInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (body.name !== undefined && (typeof body.name !== "string" || body.name.trim() === "")) {
    errors.push("Name must be a non-empty string");
  }
  if (body.slug !== undefined && (typeof body.slug !== "string" || !isSlug(body.slug))) {
    errors.push("Slug must be a valid slug");
  }
  if (body.level !== undefined && (typeof body.level !== "number" || !Number.isInteger(body.level) || body.level < 0)) {
    errors.push("Level must be a non-negative integer");
  }
  if (body.isActive !== undefined && !isBoolean(body.isActive)) errors.push("isActive must be a boolean");
  if (body.parentId !== undefined && body.parentId !== null && typeof body.parentId !== "string") {
    errors.push("parentId must be a string or null");
  }

  if (errors.length > 0) return fail(errors);

  const input: Prisma.CategoryUpdateInput = {};
  if (body.name !== undefined) input.name = (body.name as string).trim();
  if (body.slug !== undefined) input.slug = (body.slug as string).trim();
  if (body.description !== undefined) input.description = body.description === null ? null : String(body.description);
  if (body.parentId === null) {
    input.parent = { disconnect: true };
  } else if (body.parentId !== undefined) {
    input.parent = { connect: { id: String(body.parentId) } };
  }
  if (body.level !== undefined) input.level = body.level as number;
  if (body.icon !== undefined) input.icon = body.icon === null ? null : (body.icon as string);
  if (body.isActive !== undefined) input.isActive = toBoolean(body.isActive);

  if (Object.keys(input).length === 0) return fail(["At least one field must be provided"]);

  return pass(input);
}