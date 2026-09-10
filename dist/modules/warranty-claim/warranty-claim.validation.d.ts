import type { Prisma } from "../../../prisma/generated/prisma/client";
import { type ValidationResult } from "../../utils/validation";
import type { ClaimStatusInput, CreateClaimInput } from "./warranty-claim.type";
export declare function validateCreateClaimInput(data: unknown): ValidationResult<CreateClaimInput>;
export declare function validateClaimStatusInput(data: unknown): ValidationResult<ClaimStatusInput>;
export declare function validateUpdateClaimInput(data: unknown): ValidationResult<Prisma.WarrantyClaimUpdateInput>;
