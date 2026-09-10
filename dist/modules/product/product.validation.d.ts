import type { Prisma } from "../../../prisma/generated/prisma/client";
import { type ValidationResult } from "../../utils/validation";
import type { CreateItemInput, CreateProductInput, CreateVariantInput } from "./product.type";
export declare function validateCreateProductInput(data: unknown): ValidationResult<CreateProductInput>;
export declare function validateUpdateProductInput(data: unknown): ValidationResult<Prisma.ProductUpdateInput>;
export declare function validateCreateVariantInput(data: unknown): ValidationResult<CreateVariantInput>;
export declare function validateUpdateVariantInput(data: unknown): ValidationResult<Prisma.ProductVariantUpdateInput>;
export declare function validateCreateItemInput(data: unknown): ValidationResult<CreateItemInput>;
export declare function validateUpdateItemInput(data: unknown): ValidationResult<Prisma.ProductItemUpdateInput>;
