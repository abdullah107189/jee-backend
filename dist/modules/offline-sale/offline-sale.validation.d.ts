import type { Prisma } from "../../../prisma/generated/prisma/client";
import { type ValidationResult } from "../../utils/validation";
import type { CreateOfflineSaleInput } from "./offline-sale.type";
export declare function validateCreateOfflineSaleInput(data: unknown): ValidationResult<CreateOfflineSaleInput>;
export declare function validateUpdateOfflineSaleInput(data: unknown): ValidationResult<Prisma.OfflineSaleUpdateInput>;
