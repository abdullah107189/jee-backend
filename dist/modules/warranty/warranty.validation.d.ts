import type { Prisma } from "../../../prisma/generated/prisma/client";
import { type ValidationResult } from "../../utils/validation";
import type { CreateWarrantyInput } from "./warranty.type";
export declare function validateCreateWarrantyInput(data: unknown): ValidationResult<CreateWarrantyInput>;
export declare function validateUpdateWarrantyInput(data: unknown): ValidationResult<Prisma.WarrantyUpdateInput>;
