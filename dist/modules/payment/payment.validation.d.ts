import type { Prisma } from "../../../prisma/generated/prisma/client";
import { type ValidationResult } from "../../utils/validation";
import type { CreatePaymentInput, PaymentVerifyInput } from "./payment.type";
export declare function validateCreatePaymentInput(data: unknown): ValidationResult<CreatePaymentInput>;
export declare function validatePaymentVerifyInput(data: unknown): ValidationResult<PaymentVerifyInput>;
export declare function validateUpdatePaymentInput(data: unknown): ValidationResult<Prisma.PaymentUpdateInput>;
