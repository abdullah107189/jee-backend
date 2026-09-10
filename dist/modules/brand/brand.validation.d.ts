import type { Prisma } from "../../../prisma/generated/prisma/client";
import { type ValidationResult } from "../../utils/validation";
import type { CreateBrandInput } from "./brand.type";
export declare function validateCreateBrandInput(data: unknown): ValidationResult<CreateBrandInput>;
export declare function validateUpdateBrandInput(data: unknown): ValidationResult<Prisma.BrandUpdateInput>;
