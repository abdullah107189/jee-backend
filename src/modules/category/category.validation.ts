import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase, hyphen-separated",
    )
    .optional(),
  description: z.string().optional(),
  parentId: z.string().cuid("Invalid parentId").optional(),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export function validateCreateCategoryInput(body: unknown) {
  const result = createCategorySchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join(".") || "root",
      message: issue.message,
    }));
    return { ok: false as const, errors };
  }
  return { ok: true as const, value: result.data };
}
