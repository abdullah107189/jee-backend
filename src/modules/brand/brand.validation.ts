import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase, hyphen-separated",
    )
    .optional(),
  logo: z.string().url("Logo must be a valid URL").optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;

export function validateCreateBrandInput(body: unknown) {
  const result = createBrandSchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join(".") || "root",
      message: issue.message,
    }));
    return { ok: false as const, errors };
  }
  return { ok: true as const, value: result.data };
}
