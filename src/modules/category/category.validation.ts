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

// ------ filter validation -----------

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),

  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),

  brandId: z.string().optional(),
  warrantyMonths: z.coerce.number().int().nonnegative().optional(),

  sortBy: z.enum(["price-asc", "price-desc", "newest", "popular"]).optional(),

  // dynamic attribute filters — color, size, capacity…
  filter: z.record(z.string(), z.string()).optional().default({}),
});

export type ProductListQuery = z.infer<typeof productListQuerySchema>;

export function validateProductListQuery(body: unknown) {
  // ignore known URL params, treat rest as filter
  const KNOWN_KEYS = new Set([
    "page",
    "limit",
    "minPrice",
    "maxPrice",
    "brandId",
    "warrantyMonths",
    "sortBy",
    "filter",
  ]);

  const raw = (body ?? {}) as Record<string, unknown>;
  const filter: Record<string, string> = {};
  const parsed: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (KNOWN_KEYS.has(key)) parsed[key] = value;
    else if (typeof value === "string") filter[key] = value;
  }

  parsed.filter = filter;

  const result = productListQuerySchema.safeParse(parsed);
  if (!result.success) {
    const errors = result.error.issues.map((i) => ({
      field: i.path.join(".") || "root",
      message: i.message,
    }));
    return { ok: false as const, errors };
  }
  return { ok: true as const, value: result.data };
}
