import type { Prisma } from "../../../prisma/generated/prisma/client";
import { type ValidationResult } from "../../utils/validation";
import type { CreateCategoryInput } from "./category.type";
export declare function validateCreateCategoryInput(data: unknown): ValidationResult<CreateCategoryInput>;
export declare function validateUpdateCategoryInput(data: unknown): ValidationResult<Prisma.CategoryUpdateInput>;
