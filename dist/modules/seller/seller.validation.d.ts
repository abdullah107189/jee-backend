import type { Prisma } from "../../../prisma/generated/prisma/client";
import { type ValidationResult } from "../../utils/validation";
import type { CreateSellerInput, SellerProfileInput } from "./seller.type";
export declare function validateCreateSellerInput(data: unknown): ValidationResult<CreateSellerInput>;
export declare function validateSellerProfileInput(data: unknown): ValidationResult<SellerProfileInput>;
export declare function validateUpdateSellerInput(data: unknown): ValidationResult<Prisma.SellerUpdateInput>;
