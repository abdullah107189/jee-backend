// import { z } from "zod";
// import { fail, pass, type ValidationResult } from "../../utils/validation";
// import type {
//   CreateFilterGroupInput,
//   UpdateFilterGroupInput,
// } from "./filter.type";

// function formatZodErrors(error: z.ZodError): string[] {
//   return error.issues.map((issue) => {
//     const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
//     return `${path}${issue.message}`;
//   });
// }

// const filterTypeEnum = z.enum([
//   "MULTI_SELECT",
//   "SINGLE_SELECT",
//   "RANGE",
//   "BOOLEAN",
// ]);

// const optionSchema = z.object({
//   id: z.string().optional(),
//   value: z.string().trim().min(1, "Option value required"),
//   label: z.string().trim().optional(),
//   sortOrder: z.number().int().min(0).optional(),
// });

// const filterSchema = z.object({
//   id: z.string().optional(),
//   name: z.string().trim().min(1, "Filter name required"),
//   label: z.string().trim().optional(),
//   type: filterTypeEnum,
//   sortOrder: z.number().int().min(0).optional(),
//   options: z.array(optionSchema).min(1, "At least 1 option required"),
// });

// /* ─────────── Create ─────────── */

// const createSchema = z.object({
//   name: z.string().trim().min(2, "Name required"),
//   slug: z
//     .string()
//     .trim()
//     .regex(/^[a-z0-9-]+$/, "Slug lowercase, hyphens")
//     .optional(),
//   categoryId: z.string().trim().min(1, "Category required"),
//   sortOrder: z.number().int().min(0).optional(),
//   filters: z.array(filterSchema).min(1, "At least 1 filter required"),
// });

// export function validateCreateFilterGroupInput(
//   data: unknown,
// ): ValidationResult<CreateFilterGroupInput> {
//   const result = createSchema.safeParse(data);
//   if (!result.success) return fail(formatZodErrors(result.error));
//   return pass(result.data as CreateFilterGroupInput);
// }

// /* ─────────── Update ─────────── */

// const updateSchema = z.object({
//   name: z.string().trim().min(2).optional(),
//   slug: z.string().trim().regex(/^[a-z0-9-]+$/).optional(),
//   sortOrder: z.number().int().min(0).optional(),
//   isActive: z.boolean().optional(),
//   filters: z.array(filterSchema).optional(),
// });

// export function validateUpdateFilterGroupInput(
//   data: unknown,
// ): ValidationResult<UpdateFilterGroupInput> {
//   const result = updateSchema.safeParse(data);
//   if (!result.success) return fail(formatZodErrors(result.error));
//   return pass(result.data as UpdateFilterGroupInput);
// }

// /* ─────────── Product filter values ─────────── */

// const productFilterSchema = z.object({
//   filterId: z.string().min(1),
//   filterOptionIds: z.array(z.string()).min(1),
// });

// export function validateProductFilterValues(
//   data: unknown,
// ): ValidationResult<{ filters: any[] }> {
//   const schema = z.object({
//     filters: z.array(productFilterSchema),
//   });
//   const result = schema.safeParse(data);
//   if (!result.success) return fail(formatZodErrors(result.error));
//   return pass(result.data);
// }