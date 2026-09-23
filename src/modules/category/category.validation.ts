import { z } from "zod";
import { fail, pass, type ValidationResult } from "../../utils/validation";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  ReorderCategoriesInput,
} from "./category.type";

/* ─────────── Helpers ─────────── */

function formatZodErrors(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
    return `${path}${issue.message}`;
  });
}

/* ─────────── Create ─────────── */

const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, alphanumeric, hyphens")
    .optional(),
  description: z.string().trim().max(500).optional(),
  parentId: z.string().trim().optional(),
  icon: z.string().trim().optional(),
  image: z.string().trim().url("Image must be a valid URL").optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export function validateCreateCategoryInput(
  data: unknown,
): ValidationResult<CreateCategoryInput> {
  const result = createCategorySchema.safeParse(data);

  if (!result.success) return fail(formatZodErrors(result.error));

  return pass({
    name: result.data.name,
    slug: result.data.slug,
    description: result.data.description,
    parentId: result.data.parentId,
    icon: result.data.icon,
    image: result.data.image,
    sortOrder: result.data.sortOrder,
    isActive: result.data.isActive,
  });
}

/* ─────────── Update ─────────── */

const updateCategorySchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().trim().max(500).optional(),
  parentId: z.string().trim().nullable().optional(),
  icon: z.string().trim().optional(),
  image: z.string().trim().url().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export function validateUpdateCategoryInput(
  data: unknown,
): ValidationResult<UpdateCategoryInput> {
  const result = updateCategorySchema.safeParse(data);

  if (!result.success) return fail(formatZodErrors(result.error));

  return pass(result.data);
}

/* ─────────── Reorder ─────────── */

const reorderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().trim().min(1),
        sortOrder: z.number().int().min(0),
      }),
    )
    .min(1, "items must not be empty"),
});

export function validateReorderCategoriesInput(
  data: unknown,
): ValidationResult<ReorderCategoriesInput> {
  const result = reorderSchema.safeParse(data);

  if (!result.success) return fail(formatZodErrors(result.error));

  return pass(result.data);
}
