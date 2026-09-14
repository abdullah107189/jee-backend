import { z } from "zod";

const variantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  attributes: z
    .record(z.string(), z.union([z.string(), z.number()]))
    .default({}),
  price: z.number().positive("Price must be greater than 0"),
  comparePrice: z.number().positive().optional(),
  images: z.array(z.string().url("Each image must be a valid URL")).default([]),
  stockQuantity: z.number().int().nonnegative().default(1),
  lowStockThreshold: z.number().int().nonnegative().default(5),
  isActive: z.boolean().default(true),
});

export const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase, hyphen-separated",
    )
    .optional(),
  description: z.string().optional(),
  specifications: z.record(z.string(), z.any()).optional(),
  warrantyMonths: z.number().int().nonnegative().default(12),
  warrantyTerms: z.string().optional(),
  categoryId: z.string().cuid("Invalid categoryId").optional(),
  brandId: z.string().cuid("Invalid brandId").optional(),
  isPublished: z.boolean().default(false),
  isActive: z.boolean().default(true),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export function validateCreateProductInput(body: unknown) {
  const result = createProductSchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join(".") || "root",
      message: issue.message,
    }));
    return { ok: false as const, errors };
  }
  return { ok: true as const, value: result.data };
}
