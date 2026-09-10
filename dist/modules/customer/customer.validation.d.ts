import type { Prisma } from "../../../prisma/generated/prisma/client";
import { type ValidationResult } from "../../utils/validation";
import type { CreateCustomerInput } from "./customer.type";
export declare function validateCreateCustomerInput(data: unknown): ValidationResult<CreateCustomerInput>;
export declare function validateUpdateCustomerInput(data: unknown): ValidationResult<Prisma.CustomerUpdateInput>;
