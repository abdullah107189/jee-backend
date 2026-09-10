import type { Prisma } from "../../../prisma/generated/prisma/client";
import { type ValidationResult } from "../../utils/validation";
import type { CreateUserInput } from "./user.type";
export declare function validateCreateUserInput(data: unknown): ValidationResult<CreateUserInput>;
export declare function validateUpdateUserInput(data: unknown): ValidationResult<Prisma.UserUpdateInput>;
export declare function validateProfileInput(data: unknown): ValidationResult<Prisma.UserUpdateInput>;
